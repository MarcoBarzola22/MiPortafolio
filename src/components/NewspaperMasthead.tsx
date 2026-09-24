import { Sun, Moon } from 'lucide-react';
import useTheme from '@/hooks/useTheme';

const NewspaperMasthead = () => {
  const { isDark, toggleTheme } = useTheme();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full border-b-2 border-rule-bold pb-4 mb-4">
      {/* Top Bar with Editorial Metadata and Edition Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-body uppercase tracking-widest text-ink-muted mb-4 border-b border-rule-light/50 pb-2">
        <span>Est. 2024</span>
        <span className="hidden sm:inline">{formattedDate}</span>
        
        {/* Edition Switcher Button */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">Volume I, Issue 1</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded border border-rule-light bg-paper-elevated text-ink-headline hover:border-mint-base transition-colors focus:outline-none focus:ring-2 focus:ring-mint-base"
            aria-label={`Cambiar a ${isDark ? 'Morning Edition' : 'Evening Edition'}`}
            title={`Cambiar a ${isDark ? 'Morning Edition' : 'Evening Edition'}`}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-mint-base" aria-hidden="true" />
                <span>Evening Edition</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-mint-base" aria-hidden="true" />
                <span>Morning Edition</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Masthead Title */}
      <div className="text-center mb-6">
        <h1 className="masthead text-display font-bold tracking-tight leading-none text-ink-headline">
          THE <span className="highlight-underline">PORTFOLIO</span> TIMES
        </h1>
        <p className="font-body text-sm md:text-base text-ink-muted mt-2 italic">
          "All the Code That's Fit to Ship"
        </p>
      </div>
    </header>
  );
};

export default NewspaperMasthead;
