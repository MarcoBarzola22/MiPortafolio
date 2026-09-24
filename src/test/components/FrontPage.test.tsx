import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@/context/I18nContext';
import FrontPage from '@/components/FrontPage';

describe('FrontPage Component (Real Identity & Dual-Layer GPU Portrait)', () => {
  it('renderiza la identidad real de Marco Nicolás Barzola y su filiación con la UNVIME en español', () => {
    render(
      <I18nProvider initialLanguage="es">
        <FrontPage />
      </I18nProvider>
    );

    // Titular principal
    expect(
      screen.getByRole('heading', { level: 2, name: /MARCO NICOLÁS BARZOLA/i })
    ).toBeInTheDocument();

    // Subtitular y drop-cap
    expect(screen.getAllByText(/UNVIME/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Full-Stack Developer/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ÚLTIMA HORA/i)).toBeInTheDocument();

    // Pie de foto editorial en español
    expect(
      screen.getByText(/Marco Barzola — Desarrollador Full-Stack/i)
    ).toBeInTheDocument();

    // Erradicación de textos ficticios antiguos
    expect(screen.queryByText(/Photo by Editorial Staff/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/5\+ Years of Building at Scale/i)).not.toBeInTheDocument();
  });

  it('renderiza la fotografía con doble capa GPU, atributos LCP y clases optimizadas', () => {
    const { container } = render(
      <I18nProvider initialLanguage="es">
        <FrontPage />
      </I18nProvider>
    );

    const baseLayer = container.querySelector('.portrait-layer-base') as HTMLImageElement;
    const warmthLayer = container.querySelector('.portrait-layer-warmth') as HTMLImageElement;

    expect(baseLayer).toBeInTheDocument();
    expect(warmthLayer).toBeInTheDocument();

    // Verificación de atributos LCP prioritarios
    expect(baseLayer.getAttribute('loading')).toBe('eager');
    expect(baseLayer.getAttribute('fetchPriority')).toBe('high');
    expect(baseLayer.src).toContain('marco-barzola-profile');

    // Capa cálida superpuesta con aria-hidden
    expect(warmthLayer.getAttribute('aria-hidden')).toBe('true');
  });

  it('actualiza titulares y pie de foto al conmutar a inglés', () => {
    render(
      <I18nProvider initialLanguage="en">
        <FrontPage />
      </I18nProvider>
    );

    expect(screen.getByText(/BREAKING NEWS/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Marco Barzola — Full-Stack Developer/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Architecture & Systems/i)).toBeInTheDocument();
  });
});
