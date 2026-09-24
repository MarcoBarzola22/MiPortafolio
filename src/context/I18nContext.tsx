import React, {
  createContext,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import {
  SupportedLanguage,
  TranslationKey,
  TranslationParams,
  I18nContextState,
} from '@/types/i18n';
import { es } from '@/data/locales/es';
import { en } from '@/data/locales/en';

export const STORAGE_KEY = 'the-minty-gazette-lang';

const TITLES: Record<SupportedLanguage, string> = {
  es: 'Portafolio Marco Barzola',
  en: 'Portafolio Marco Barzola',
};

// Registro de diccionarios estáticos cargados en memoria
const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  es,
  en,
};

/**
 * Registra o actualiza el diccionario de traducciones para un idioma específico.
 */
export const registerDictionary = (
  lang: SupportedLanguage,
  dict: Record<string, string>
): void => {
  dictionaries[lang] = { ...dictionaries[lang], ...dict };
};

/**
 * Obtiene el mapa completo de traducciones registrado para un idioma.
 */
export const getDictionary = (
  lang: SupportedLanguage
): Record<string, string> => {
  return dictionaries[lang];
};

/**
 * Lee de forma segura el idioma almacenado en localStorage con fallback a 'es'.
 */
const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
  } catch {
    // Si localStorage está bloqueado (ej. modo incógnito estricto), fallback silencioso a 'es'
  }
  return 'es';
};

/**
 * Guarda de forma segura el idioma seleccionado en localStorage.
 */
const persistLanguage = (lang: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Falla silenciosa si localStorage está bloqueado o excede cuota
  }
};

/**
 * Helper para interpolación ligera de tokens con formato `{nombreVariable}`.
 */
export const interpolate = (
  text: string,
  params?: TranslationParams
): string => {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
};

export const I18nContext = createContext<I18nContextState | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
  /** Idioma inicial opcional, útil para pruebas unitarias */
  initialLanguage?: SupportedLanguage;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    () => initialLanguage ?? getInitialLanguage()
  );

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    persistLanguage(newLang);
  }, []);

  // useLayoutEffect para sincronización síncrona pre-paint de <html lang> y <title> (QA #7, RA-01)
  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      const title =
        dictionaries[language]?.['doc.title'] ?? TITLES[language];
      document.title = title;
    }
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const activeDict = dictionaries[language];
      const fallbackDict = dictionaries.es;
      const rawText = activeDict?.[key] ?? fallbackDict?.[key] ?? key;
      return interpolate(rawText, params);
    },
    [language]
  );

  const contextValue = useMemo<I18nContextState>(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
