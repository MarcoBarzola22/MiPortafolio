import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { I18nProvider, STORAGE_KEY } from '@/context/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';

// Componente de prueba para verificar consumo del contexto
const TestConsumer = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div>
      <span data-testid="lang-display">{language}</span>
      <span data-testid="title-text">{t('frontpage.headline')}</span>
      <button
        type="button"
        data-testid="switch-en"
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        data-testid="switch-es"
        onClick={() => setLanguage('es')}
      >
        ES
      </button>
    </div>
  );
};

describe('I18nContext & I18nProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
    document.title = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia en español ("es") por defecto cuando localStorage está vacío', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('lang-display').textContent).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toBe('Portafolio Marco Barzola');
  });

  it('carga la preferencia guardada en localStorage si es válida ("en")', () => {
    localStorage.setItem(STORAGE_KEY, 'en');

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('lang-display').textContent).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('ignora valores inválidos en localStorage e inicia con fallback a "es"', () => {
    localStorage.setItem(STORAGE_KEY, 'fr');

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('lang-display').textContent).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('actualiza el idioma, persiste en localStorage y sincroniza <html lang> al conmutar', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    const switchBtn = screen.getByTestId('switch-en');

    act(() => {
      switchBtn.click();
    });

    expect(screen.getByTestId('lang-display').textContent).toBe('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('degrada graciosamente en memoria cuando localStorage lanza excepciones (modo incógnito)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: localStorage is disabled');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    // Debe iniciar en 'es' sin arrojar excepciones no controladas
    expect(screen.getByTestId('lang-display').textContent).toBe('es');

    // Al alternar idioma en memoria, debe responder
    const switchBtn = screen.getByTestId('switch-en');
    act(() => {
      switchBtn.click();
    });

    expect(screen.getByTestId('lang-display').textContent).toBe('en');
  });
});
