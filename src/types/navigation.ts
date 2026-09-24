export type AnimationPhase = 'idle' | 'flipping-out' | 'flipping-in' | 'bouncing';
export type Direction = 'next' | 'prev' | 'none';

export interface NavigationState {
  currentPage: number;
  displayedPage: number;
  animationPhase: AnimationPhase;
  direction: Direction;
}

export type NavigationAction =
  | { type: 'NAVIGATE_TO'; targetPage: number }
  | { type: 'FLIP_OUT_COMPLETE' }
  | { type: 'FLIP_IN_COMPLETE' }
  | { type: 'BOUNCE_COMPLETE' };
