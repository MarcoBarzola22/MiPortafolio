import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@/context/I18nContext';
import ClassifiedsSection from '@/components/ClassifiedsSection';

describe('ClassifiedsSection Component (Real Data & Identity)', () => {
  it('renderiza la información de contacto verídica de Marco Barzola y erradica placeholders', () => {
    render(
      <I18nProvider initialLanguage="es">
        <ClassifiedsSection />
      </I18nProvider>
    );

    // Enlaces de contacto reales
    const emailLink = screen.getByRole('link', { name: /marcobarzoladev@gmail\.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:marcobarzoladev@gmail.com');
    expect(emailLink).toHaveAttribute('target', '_blank');
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');

    const githubLink = screen.getByRole('link', { name: /@MarcoBarzola22/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/MarcoBarzola22');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByRole('link', { name: /marco-nicolás-barzola-789a8a341/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/marco-nicolás-barzola-789a8a341');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Botón dinámico de descarga de CV en español
    const cvLinkEs = screen.getByRole('link', { name: /Descargar CV/i });
    expect(cvLinkEs).toHaveAttribute('href', '/cv-es.pdf');
    expect(cvLinkEs).toHaveAttribute('download');

    // Ubicación real y filiación UNVIME
    expect(screen.getByText(/Villa Mercedes, San Luis, Argentina/i)).toBeInTheDocument();
    expect(screen.getByText(/UNVIME/i)).toBeInTheDocument();

    // Erradicación de datos ficticios
    expect(screen.queryByText(/hello@portfolio\.dev/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/San Francisco, CA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/@developer/i)).not.toBeInTheDocument();
  });

  it('interpola el año actual en el pie de imprenta editorial', () => {
    const currentYear = new Date().getFullYear().toString();

    render(
      <I18nProvider initialLanguage="es">
        <ClassifiedsSection />
      </I18nProvider>
    );

    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    expect(screen.getAllByText(/Marco Nicolás Barzola/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/THE BARZOLA TIMES/i)).toBeInTheDocument();
  });

  it('renderiza la biografía y llamados a la acción en inglés al conmutar el idioma', () => {
    render(
      <I18nProvider initialLanguage="en">
        <ClassifiedsSection />
      </I18nProvider>
    );

    expect(screen.getByText(/About the Engineer/i)).toBeInTheDocument();
    const cvLinkEn = screen.getByRole('link', { name: /Download CV/i });
    expect(cvLinkEn).toHaveAttribute('href', '/cv-en.pdf');
    expect(cvLinkEn).toHaveAttribute('download');
    expect(screen.getByText(/CLASSIFIEDS/i)).toBeInTheDocument();
  });
});
