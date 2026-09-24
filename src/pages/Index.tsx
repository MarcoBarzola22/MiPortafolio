import { useState, useEffect } from 'react';
import NewspaperMasthead from '@/components/NewspaperMasthead';
import FrontPage from '@/components/FrontPage';
import TechStackSection from '@/components/TechStackSection';
import ProjectsSection from '@/components/ProjectsSection';
import ClassifiedsSection from '@/components/ClassifiedsSection';

const sections = [
  { id: 0, component: FrontPage },
  { id: 1, component: TechStackSection },
  { id: 2, component: ProjectsSection },
  { id: 3, component: ClassifiedsSection },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedPage, setDisplayedPage] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Entry animation on first load
  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isAnimating) return;

    setIsAnimating(true);

    // After flip-out animation, switch content and flip-in
    setTimeout(() => {
      setDisplayedPage(newPage);
      setCurrentPage(newPage);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 300);
  };

  const CurrentSection = sections[displayedPage].component;

  return (
    <div className={`min-h-screen paper-bg ${hasLoaded ? 'animate-unfold' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Masthead */}
        <NewspaperMasthead 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />

        {/* Page Content with Flip Animation */}
        <main 
          className={`
            transition-all duration-300 transform-gpu
            ${isAnimating 
              ? 'animate-page-flip-out opacity-0' 
              : 'animate-page-flip-in opacity-100'
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
  );
};

export default Index;
