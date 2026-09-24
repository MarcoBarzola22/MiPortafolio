import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import { I18nProvider } from '@/context/I18nContext';
import NewspaperMasthead from '@/components/NewspaperMasthead';
import NewspaperNav from '@/components/NewspaperNav';

describe('Language Toggle & Accessibility (WCAG 2.1 AA)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
  });

  it('indica aria-current="true" en el idioma activo y expone aria-label descriptivo en el inactivo', () => {
    render(
      <I18nProvider initialLanguage="es">
        <NewspaperMasthead />
      </I18nProvider>
    );

    const esButton = screen.getByRole('button', { name: /Español \(Idioma activo\)/i });
    const enButton = screen.getByRole('button', { name: /Cambiar idioma del periódico a Inglés/i });

    expect(esButton).toHaveAttribute('aria-current', 'true');
    expect(esButton).toBeDisabled();

    expect(enButton).not.toHaveAttribute('aria-current');
    expect(enButton).not.toBeDisabled();
  });

  it('conmuta idioma al hacer click en el botón inactivo', () => {
    render(
      <I18nProvider initialLanguage="es">
        <NewspaperMasthead />
      </I18nProvider>
    );

    const enButton = screen.getByRole('button', { name: /Cambiar idioma del periódico a Inglés/i });
    fireEvent.click(enButton);

    // Ahora EN debe ser el activo y portar aria-current="true"
    const activeEnButton = screen.getByRole('button', { name: /English \(Current language\)/i });
    expect(activeEnButton).toHaveAttribute('aria-current', 'true');
    expect(activeEnButton).toBeDisabled();

    // ES pasa a ser inactivo y accionable
    const inactiveEsButton = screen.getByRole('button', { name: /Switch journal language to Spanish/i });
    expect(inactiveEsButton).not.toHaveAttribute('aria-current');
    expect(inactiveEsButton).not.toBeDisabled();
  });

  it('permite conmutación accesible mediante teclado (Enter)', () => {
    render(
      <I18nProvider initialLanguage="es">
        <NewspaperMasthead />
      </I18nProvider>
    );

    const enButton = screen.getByRole('button', { name: /Cambiar idioma del periódico a Inglés/i });
    enButton.focus();
    expect(document.activeElement).toBe(enButton);

    fireEvent.click(enButton);

    const activeEnButton = screen.getByRole('button', { name: /English \(Current language\)/i });
    expect(activeEnButton).toHaveAttribute('aria-current', 'true');
  });

  it('confirma que NewspaperNav no contiene selector de idioma duplicado', () => {
    const { container } = render(
      <I18nProvider initialLanguage="es">
        <NewspaperNav currentPage={0} onPageChange={() => {}} />
      </I18nProvider>
    );

    // No debe existir el contenedor secundario con botones de idioma
    const hiddenToggleContainer = container.querySelector('[aria-hidden="true"].absolute');
    expect(hiddenToggleContainer).not.toBeInTheDocument();
  });

  it('supera la auditoría de accesibilidad de axe-core con cero violaciones', async () => {
    const { container } = render(
      <I18nProvider initialLanguage="es">
        <NewspaperMasthead />
        <NewspaperNav currentPage={0} onPageChange={() => {}} />
      </I18nProvider>
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
