import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface UseFocusTrapOptions {
  /** Indica si la trampa de foco debe estar activa */
  isActive: boolean;
  /** Callback opcional invocado al presionar la tecla Escape */
  onClose?: () => void;
  /** Referencia opcional al elemento disparador para restaurar foco explícitamente */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Referencia opcional al elemento que debe recibir foco inicial preferencial */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Hook para atrapar y ciclar el foco del teclado dentro de un contenedor modal.
 * Cumple con WCAG 2.1 AA (RA-02, RA-03) y Principio 1 y 4 de la Constitución.
 */
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  { isActive, onClose, triggerRef, initialFocusRef }: UseFocusTrapOptions
) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 1. Guardar el elemento previamente enfocado antes de activar el modal
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // 2. Establecer foco inicial en el contenedor o elemento interactivo preferido
    const focusInitialElement = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    };

    // Usar requestAnimationFrame para asegurar que el componente está renderizado
    const rafId = requestAnimationFrame(focusInitialElement);

    // 3. Listener para gestionar navegación cíclica con Tab/Shift+Tab y Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onClose) {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
        return;
      }

      if (event.key !== 'Tab') return;

      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const focusables = Array.from(
        currentContainer.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: si estamos en el primero o fuera del contenedor, ciclar al último
        if (
          document.activeElement === firstFocusable ||
          !currentContainer.contains(document.activeElement)
        ) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab estándar: si estamos en el último o fuera del contenedor, ciclar al primero
        if (
          document.activeElement === lastFocusable ||
          !currentContainer.contains(document.activeElement)
        ) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    // 4. Limpieza: remover listeners y restaurar foco
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown, true);

      const targetToRestore = triggerRef?.current ?? previousActiveElement.current;
      if (targetToRestore && typeof targetToRestore.focus === 'function') {
        targetToRestore.focus();
      }
    };
  }, [isActive, onClose, triggerRef, initialFocusRef, containerRef]);
};
