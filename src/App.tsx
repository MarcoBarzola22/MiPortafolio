import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Toaster } from 'sonner';
import NewspaperMasthead from '@/components/NewspaperMasthead';
import NewspaperNav from '@/components/NewspaperNav';
import FrontPage from '@/components/FrontPage';
import TechStackSection from '@/components/TechStackSection';
import ProjectsSection from '@/components/ProjectsSection';
import ClassifiedsSection from '@/components/ClassifiedsSection';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useSwipeDetection } from '@/hooks/useSwipeDetection';
import { I18nProvider } from '@/context/I18nContext';

const sections = [
  { id: 0, component: FrontPage },
  { id: 1, component: TechStackSection },
  { id: 2, component: ProjectsSection },
  { id: 3, component: ClassifiedsSection },
];

const pageVariants: Variants = {
  initial: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    transformOrigin: direction > 0 ? "right" : "left",
    scale: 1,
  }),
  animate: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center",
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    transformOrigin: direction > 0 ? "left" : "right",
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }
  })
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Entry animation on first load
  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    if (newPage < 0 || newPage >= sections.length) return;
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
  };

  // Navegación por teclado (Flechas Izquierda / Derecha)
  useKeyboardNavigation({
    currentPage,
    onNavigate: handlePageChange,
  });

  // Navegación por gestos táctiles (Swipe Izquierda / Derecha)
  useSwipeDetection({
    onSwipeLeft: () => handlePageChange(currentPage + 1),
    onSwipeRight: () => handlePageChange(currentPage - 1),
  });

  const CurrentSection = sections[currentPage].component;

  return (
    <I18nProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-paper-elevated text-ink-headline border-2 border-rule-bold shadow-lg font-mono rounded",
            title: "font-headline font-bold text-ink-headline text-body",
            description: "font-body text-ink-muted text-xs mt-1",
            actionButton: "bg-mint-base text-mint-contrast font-mono text-mono-sm uppercase tracking-wider",
            cancelButton: "bg-paper-muted text-ink-muted font-mono text-mono-sm",
          },
        }}
      />
      <div className={`min-h-screen paper-bg overflow-x-clip w-full max-w-full ${hasLoaded ? 'animate-unfold' : 'opacity-0'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          {/* Masthead Header (Estático) */}
          <NewspaperMasthead />

          {/* Sticky Navigation Bar */}
          <NewspaperNav 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />

          {/* Page Content with Framer Motion Directional Page Flip & Grid Stacking */}
          <div className="w-full relative grid min-h-[75vh]" style={{ perspective: '2000px' }}>
            <AnimatePresence custom={direction} initial={false}>
              <motion.main
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="transform-gpu w-full"
                style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden' }}
              >
                <CurrentSection />
              </motion.main>
            </AnimatePresence>
          </div>

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
    </I18nProvider>
  );
};

export default App;
