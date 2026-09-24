import { NavigationState, NavigationAction } from '@/types/navigation';

export const TOTAL_PAGES = 4;

export const initialNavigationState: NavigationState = {
  currentPage: 0,
  displayedPage: 0,
  animationPhase: 'idle',
  direction: 'none',
};

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO': {
      if (state.animationPhase !== 'idle' || action.targetPage === state.currentPage) {
        return state;
      }

      // Límite de navegación: rebote si se intenta salir de los extremos
      if (action.targetPage < 0) {
        return {
          ...state,
          animationPhase: 'bouncing',
          direction: 'prev',
        };
      }

      if (action.targetPage >= TOTAL_PAGES) {
        return {
          ...state,
          animationPhase: 'bouncing',
          direction: 'next',
        };
      }

      return {
        ...state,
        currentPage: action.targetPage,
        animationPhase: 'flipping-out',
        direction: action.targetPage > state.currentPage ? 'next' : 'prev',
      };
    }

    case 'FLIP_OUT_COMPLETE': {
      if (state.animationPhase !== 'flipping-out') return state;
      return {
        ...state,
        displayedPage: state.currentPage,
        animationPhase: 'flipping-in',
      };
    }

    case 'FLIP_IN_COMPLETE': {
      if (state.animationPhase !== 'flipping-in') return state;
      return {
        ...state,
        animationPhase: 'idle',
        direction: 'none',
      };
    }

    case 'BOUNCE_COMPLETE': {
      if (state.animationPhase !== 'bouncing') return state;
      return {
        ...state,
        animationPhase: 'idle',
        direction: 'none',
      };
    }

    default:
      return state;
  }
}
