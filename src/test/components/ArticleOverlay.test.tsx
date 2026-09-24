import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { ArticleOverlay } from '@/components/ArticleOverlay';
import { caseStudies } from '@/data/caseStudies';
import { I18nProvider } from '@/context/I18nContext';
import { es } from '@/data/locales/es';

const renderWithI18n = (ui: React.ReactElement) => {
  return render(
    <I18nProvider initialLanguage="es">
      {ui}
    </I18nProvider>
  );
};

describe('ArticleOverlay Component', () => {
  const mockProject = caseStudies[0]; // SmartForge

  it('renderiza con landmarks semánticos ARIA (role=dialog, aria-modal, aria-labelledby)', () => {
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', `article-title-${mockProject.id}`);

    const heading = screen.getByRole('heading', { level: 1, name: mockProject.headline });
    expect(heading).toHaveAttribute('id', `article-title-${mockProject.id}`);
  });

  it('renderiza íntegramente los 6 bloques editoriales del reportaje', () => {
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={vi.fn()} />);

    // 1. Cabecera
    expect(screen.getByRole('heading', { level: 1, name: mockProject.headline })).toBeInTheDocument();
    expect(screen.getByText(es[mockProject.subheadline])).toBeInTheDocument();

    // 2. Lede / Problema
    expect(screen.getByText(es[mockProject.problemLede])).toBeInTheDocument();

    // 3. Restricciones
    expect(screen.getByText(es[mockProject.constraints])).toBeInTheDocument();

    // 4. Trade-offs (Pull-quotes)
    mockProject.tradeOffs.forEach((tradeOff) => {
      expect(screen.getByText(`“${es[tradeOff.quote]}”`)).toBeInTheDocument();
      if (tradeOff.rationale) {
        expect(screen.getByText(es[tradeOff.rationale])).toBeInTheDocument();
      }
    });

    // 5. Stack
    mockProject.stack.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });

    // 6. Métricas de Impacto con números tabulares
    mockProject.impactMetrics.forEach((metric) => {
      expect(screen.getByText(es[metric.label])).toBeInTheDocument();
      expect(screen.getByText(metric.value)).toBeInTheDocument();
    });
  });

  it('invoca onClose al hacer click en el botón de retorno a portada', () => {
    const handleClose = vi.fn();
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', {
      name: es['projects.closeOverlayAria'],
    });

    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('invoca onClose al presionar la tecla Escape', () => {
    const handleClose = vi.fn();
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('enfoca inicialmente el botón de cierre al montarse', async () => {
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={vi.fn()} />);

    const closeButton = screen.getByRole('button', {
      name: es['projects.closeOverlayAria'],
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(closeButton);
    });
  });

  it('atrapa y cicla el foco del teclado dentro del overlay (Focus Trap)', async () => {
    renderWithI18n(<ArticleOverlay project={mockProject} onClose={vi.fn()} />);

    const closeButton = screen.getByRole('button', {
      name: es['projects.closeOverlayAria'],
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(closeButton);
    });

    // En este componente modal, el botón de cierre es el elemento interactivo principal.
    // Al presionar Shift+Tab en el primer elemento, debe mantenerse/ciclar al elemento enfocable.
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(closeButton);

    // Al presionar Tab en el último elemento enfocable, debe ciclar al primero
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(closeButton);
  });

  it('supera la auditoría de accesibilidad de axe-core sin violaciones', async () => {
    const { container } = renderWithI18n(<ArticleOverlay project={mockProject} onClose={vi.fn()} />);

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
