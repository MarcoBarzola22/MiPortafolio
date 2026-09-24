import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, interpolate } from '@/context/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';

describe('useTranslation & interpolate helper', () => {
  it('lanza un error explícito si se consume fuera de un I18nProvider', () => {
    // Silenciar error en console.error de react
    const originalError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useTranslation())).toThrow(
      'useTranslation debe utilizarse dentro de un <I18nProvider>'
    );

    console.error = originalError;
  });

  it('resuelve cadenas traducidas según el idioma activo', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider initialLanguage="es">{children}</I18nProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.language).toBe('es');
    expect(result.current.t('masthead.langEsLabel')).toBe('ES');
    expect(result.current.t('frontpage.headline')).toBe('MARCO NICOLÁS BARZOLA');

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t('frontpage.badge')).toBe('BREAKING NEWS');
  });

  it('interpola parámetros dinámicos con formato {token}', () => {
    const rawTemplate = '© {year} {author} · All Rights Reserved';
    const parsed = interpolate(rawTemplate, { year: 2026, author: 'Marco Barzola' });

    expect(parsed).toBe('© 2026 Marco Barzola · All Rights Reserved');
  });

  it('mantiene el token intacto si no se provee el parámetro correspondiente', () => {
    const rawTemplate = 'Hello {name}, your code is {code}';
    const parsed = interpolate(rawTemplate, { name: 'Marco' });

    expect(parsed).toBe('Hello Marco, your code is {code}');
  });

  it('retorna la propia clave si no existe en ningún diccionario (fallback seguro)', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider initialLanguage="en">{children}</I18nProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    // Casting as any para simular clave inexistente en tiempo de ejecución
    const missingKey = 'non.existent.key' as any;
    expect(result.current.t(missingKey)).toBe('non.existent.key');
  });
});
