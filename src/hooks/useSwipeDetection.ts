import { useEffect, useRef } from 'react';

interface UseSwipeDetectionOptions {
  isAnimating: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

function isInsideScrollable(element: HTMLElement | null): boolean {
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      current.scrollWidth > current.clientWidth
    ) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

export const useSwipeDetection = ({
  isAnimating,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeDetectionOptions) => {
  const touchStartRef = useRef<{ x: number; y: number; ignored: boolean } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating || e.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      // Excluir áreas de scroll horizontal interno (como el carrusel de proyectos)
      if (isInsideScrollable(target)) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          ignored: true,
        };
        return;
      }

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        ignored: false,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || touchStartRef.current.ignored || isAnimating) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      // Si el desplazamiento vertical es mayor o igual al horizontal, es scroll vertical -> ignorar
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        return;
      }

      // Validar umbral mínimo de 50px
      if (Math.abs(deltaX) < threshold) {
        return;
      }

      if (deltaX < 0) {
        // Desplazamiento hacia la izquierda: pasar a la siguiente página
        onSwipeLeft();
      } else {
        // Desplazamiento hacia la derecha: volver a la página previa
        onSwipeRight();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isAnimating, onSwipeLeft, onSwipeRight, threshold]);
};

export default useSwipeDetection;
