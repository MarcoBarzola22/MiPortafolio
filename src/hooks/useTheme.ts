import { useState, useEffect, useCallback } from 'react';

export type Theme = 'morning' | 'evening';

const STORAGE_KEY = 'gazette-theme';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Hook para la gestión del tema editorial ("Morning Edition" / "Evening Edition")
 * - Sincroniza con prefers-color-scheme y persiste en localStorage.
 * - Muta la clase .dark en document.documentElement sin provocar re-renders en cascada.
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'morning';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'morning' || saved === 'evening') {
      return saved;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'evening' : 'morning';
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'evening') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Escuchar cambios de preferencia del sistema si el usuario no ha forzado una elección manual
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const nextTheme: Theme = e.matches ? 'evening' : 'morning';
        setThemeState(nextTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'morning' ? 'evening' : 'morning'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    isDark: theme === 'evening',
    toggleTheme,
    setTheme,
  };
};

export default useTheme;
