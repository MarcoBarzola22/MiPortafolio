import { useReducer, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import NewspaperMasthead from '@/components/NewspaperMasthead';
import NewspaperNav from '@/components/NewspaperNav';
import FrontPage from '@/components/FrontPage';
import TechStackSection from '@/components/TechStackSection';
import ProjectsSection from '@/components/ProjectsSection';
import ClassifiedsSection from '@/components/ClassifiedsSection';
import { navigationReducer, initialNavigationState } from '@/reducers/navigationReducer';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useSwipeDetection } from '@/hooks/useSwipeDetection';

const sections = [
  { id: 0, component: FrontPage },
  { id: 1, component: TechStackSection },
  { id: 2, component: ProjectsSection },
  { id: 3, component: ClassifiedsSection },
];

const App = () => {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { currentPage, displayedPage, animationPhase, direction } = state;
  const isAnimating = animationPhase !== 'idle';

  // Entry animation on first load
  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isAnimating) return;
    dispatch({ type: 'NAVIGATE_TO', targetPage: newPage });
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
    // Asegurar que el evento proviene del propio contenedor de la página y no de elementos hijos
    if (e.target !== e.currentTarget) return;

    if (animationPhase === 'flipping-out') {
      dispatch({ type: 'FLIP_OUT_COMPLETE' });
    } else if (animationPhase === 'flipping-in') {
      dispatch({ type: 'FLIP_IN_COMPLETE' });
    } else if (animationPhase === 'bouncing') {
      dispatch({ type: 'BOUNCE_COMPLETE' });
    }
  };

  // Navegación por teclado (Flechas Izquierda / Derecha)
  useKeyboardNavigation({
    currentPage,
    isAnimating,
    onNavigate: handlePageChange,
  });

  // Navegación por gestos táctiles (Swipe Izquierda / Derecha)
  useSwipeDetection({
    isAnimating,
    onSwipeLeft: () => handlePageChange(currentPage + 1),
    onSwipeRight: () => handlePageChange(currentPage - 1),
  });

  const CurrentSection = sections[displayedPage].component;

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-background text-foreground border border-border shadow-lg",
            description: "text-muted-foreground",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-muted text-muted-foreground",
          },
        }}
      />
      <div className={`min-h-screen paper-bg ${hasLoaded ? 'animate-unfold' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Masthead Header (Estático) */}
          <NewspaperMasthead />

          {/* Sticky Navigation Bar */}
          <NewspaperNav 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />

          {/* Page Content with Flip Animation & Boundary Bounce */}
          <main 
            onAnimationEnd={handleAnimationEnd}
            className={`
              scroll-pt-20 transition-all duration-300 transform-gpu
              ${animationPhase === 'flipping-out' 
                ? 'animate-page-flip-out opacity-0' 
                : animationPhase === 'flipping-in'
                ? 'animate-page-flip-in opacity-100'
                : animationPhase === 'bouncing'
                ? direction === 'prev'
                  ? 'animate-bounce-edge-prev'
                  : 'animate-bounce-edge-next'
                : 'opacity-100'
              }
            `}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <CurrentSection />
          </main>

          {/* Page Indicator */}
          <div className="flex justify-center gap-2 mt-12 pt-8 border-t border-foreground/20">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handlePageChange(section.id)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${currentPage === section.id 
                    ? 'bg-primary scale-125' 
                    : 'bg-foreground/20 hover:bg-foreground/40'
                  }
                `}
                aria-label={`Go to page ${section.id + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
