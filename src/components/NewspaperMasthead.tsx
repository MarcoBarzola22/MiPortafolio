import { useState } from 'react';

interface MastheadProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pages = [
  { id: 0, label: 'Front Page', short: 'I' },
  { id: 1, label: 'Tech Stack', short: 'II' },
  { id: 2, label: 'Projects', short: 'III' },
  { id: 3, label: 'Classifieds', short: 'IV' },
];

const NewspaperMasthead = ({ currentPage, onPageChange }: MastheadProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full border-b-2 border-foreground/80 pb-4 mb-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center text-xs font-body uppercase tracking-widest text-muted-foreground mb-4">
        <span>Est. 2024</span>
        <span>{formattedDate}</span>
        <span>Volume I, Issue 1</span>
      </div>

      {/* Masthead Title */}
      <div className="text-center mb-6">
        <h1 className="masthead text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
          THE <span className="highlight-underline">PORTFOLIO</span> TIMES
        </h1>
        <p className="font-body text-sm md:text-base text-muted-foreground mt-2 italic">
          "All the Code That's Fit to Ship"
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex justify-center gap-1 md:gap-2 border-t border-b border-foreground/30 py-3">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onPageChange(page.id)}
            className={`
              px-3 md:px-6 py-2 font-headline text-sm md:text-base transition-all duration-300
              ${currentPage === page.id 
                ? 'bg-primary text-primary-foreground font-semibold' 
                : 'hover:bg-secondary text-foreground'
              }
            `}
          >
            <span className="hidden md:inline">{page.label}</span>
            <span className="md:hidden">§{page.short}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default NewspaperMasthead;
