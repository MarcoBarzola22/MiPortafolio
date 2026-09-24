import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll del documento de fondo sin producir layout shifts (CLS = 0).
 * Calcula el ancho de la barra de desplazamiento e inyecta paddingRight compensatorio en document.body.
 *
 * Cumple con:
 * - RNF-01 (Cero Cumulative Layout Shift durante modales)
 * - Decisión de Alcance 5 (spec.md)
 * - Principio 3 de la Constitución (Experiencia visual fluida y sin saltos)
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    const documentElement = document.documentElement;
    const body = document.body;

    // 1. Calcular el ancho de la barra de desplazamiento
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    // 2. Guardar los estilos inline originales para su restauración fiel
    const originalBodyOverflow = body.style.overflow;
    const originalDocOverflow = documentElement.style.overflow;
    const originalBodyPaddingRight = body.style.paddingRight;

    // 3. Compensar el espacio del scrollbar para evitar que la UI salte horizontalmente
    if (scrollbarWidth > 0) {
      const computedPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${computedPadding + scrollbarWidth}px`;
    }

    // 4. Bloquear el scroll en ambos elementos raíz
    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    // 5. Cleanup: restaurar exactamente las propiedades previas
    return () => {
      body.style.overflow = originalBodyOverflow;
      documentElement.style.overflow = originalDocOverflow;
      body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isLocked]);
};
