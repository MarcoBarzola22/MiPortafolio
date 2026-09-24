/**
 * Tipos base para el motor de internacionalización ligero (i18n).
 * Arquitectura zero-dependencies basada en React Context y diccionarios estáticos.
 */

/**
 * Idiomas oficiales soportados por el portafolio.
 */
export type SupportedLanguage = 'es' | 'en';

/**
 * Parámetros dinámicos para interpolación de variables en cadenas traducidas.
 * Ejemplo: `{ year: 2026 }` sustituye `{year}` en la plantilla textual.
 */
export interface TranslationParams {
  [token: string]: string | number;
}

/**
 * Contrato de claves inferido directamente del diccionario maestro en español.
 */
export type TranslationDictionary = typeof import('@/data/locales/es').es;
export type TranslationKey = keyof TranslationDictionary;

/**
 * Contrato del estado y métodos expuestos por I18nContext.
 */
export interface I18nContextState {
  /** Idioma actualmente activo en la aplicación */
  language: SupportedLanguage;
  /** Función para conmutar el idioma activo con persistencia */
  setLanguage: (lang: SupportedLanguage) => void;
  /** Función de traducción con soporte de interpolación de tokens */
  t: (key: TranslationKey, params?: TranslationParams) => string;
}
