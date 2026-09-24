import { useContext } from 'react';
import { I18nContext } from '@/context/I18nContext';
import { I18nContextState } from '@/types/i18n';

/**
 * Hook personalizado para consumir el motor de internacionalización (i18n).
 * 
 * Expone:
 * - `language`: Idioma actualmente activo ('es' | 'en').
 * - `setLanguage`: Función para conmutar el idioma con persistencia.
 * - `t`: Función para resolver textos con interpolación `{param}` y fallback seguro.
 * 
 * @throws {Error} Si se consume fuera de un `I18nProvider`.
 */
export const useTranslation = (): I18nContextState => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation debe utilizarse dentro de un <I18nProvider>');
  }

  return context;
};

export default useTranslation;
