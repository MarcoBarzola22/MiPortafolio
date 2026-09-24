import { useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  currentPage: number;
  isAnimating: boolean;
  onNavigate: (targetPage: number) => void;
}

export const useKeyboardNavigation = ({
  currentPage,
  isAnimating,
  onNavigate,
}: UseKeyboardNavigationOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar navegación por teclado mientras hay animación en curso
      if (isAnimating) return;

      // Ignorar si el usuario está interactuando con elementos de formulario editables
      const activeEl = document.activeElement as HTMLElement | null;
      const target = event.target as HTMLElement | null;
      const el = activeEl || target;

      if (el) {
        const isEditable =
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          el.isContentEditable;

        if (isEditable) return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate(currentPage + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAnimating, onNavigate]);
};

export default useKeyboardNavigation;
