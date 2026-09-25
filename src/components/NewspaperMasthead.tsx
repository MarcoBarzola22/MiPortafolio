import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';

const NewspaperMasthead: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const today = new Date();
  const locale = language === 'es' ? 'es-AR' : 'en-US';
  const rawDate = today.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Capitalizar primera letra para formato editorial uniforme
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <header className="w-full border-b-2 border-rule-bold pb-4 mb-4">
      {/* Top Bar with Editorial Metadata, Language Selector and Theme Toggle */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2.5 sm:gap-3 text-xs font-body uppercase tracking-widest text-ink-muted mb-4 border-b border-rule-light/50 pb-3">
        {/* Left: Location & Date (Fecha oculta en móviles pequeños para evitar amontonamiento) */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <span>{t('masthead.location')}</span>
          <span className="hidden sm:inline border-l border-rule-light pl-2.5 text-ink-subtle">{formattedDate}</span>
        </div>

        {/* Center: Edition subtitle ("special engineering edition") */}
        <div className="text-center text-mono-sm font-mono lowercase tracking-normal text-ink-subtle px-2">
          {t('masthead.edition')}
        </div>

        {/* Right: Language Selector and Theme Toggle */}
        <div className="flex items-center justify-center md:justify-end gap-3 flex-shrink-0">
          {/* Accessible Language Selector (WCAG 2.1 AA - QA #5, Plan §4.1) */}
          <div 
            className="inline-flex items-center p-0.5 rounded border border-rule-light bg-paper-elevated text-ink-headline"
            role="group"
            aria-label="Selector de idioma / Language selector"
          >
            <button
              type="button"
              onClick={() => setLanguage('es')}
              disabled={language === 'es'}
              aria-current={language === 'es' ? 'true' : undefined}
              aria-label={language === 'es' ? 'Español (Idioma activo)' : t('masthead.langSwitchToEsAria')}
              className={`px-2 py-0.5 text-xs font-mono font-semibold rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base ${
                language === 'es'
                  ? 'bg-paper-card text-mint-contrast border border-rule-bold shadow-xs cursor-default'
                  : 'text-ink-muted hover:text-ink-headline hover:bg-paper-muted cursor-pointer'
              }`}
            >
              {t('masthead.langEsLabel')}
            </button>
            <span className="text-rule-light px-0.5 select-none" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              disabled={language === 'en'}
              aria-current={language === 'en' ? 'true' : undefined}
              aria-label={language === 'en' ? 'English (Current language)' : t('masthead.langSwitchToEnAria')}
              className={`px-2 py-0.5 text-xs font-mono font-semibold rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base ${
                language === 'en'
                  ? 'bg-paper-card text-mint-contrast border border-rule-bold shadow-xs cursor-default'
                  : 'text-ink-muted hover:text-ink-headline hover:bg-paper-muted cursor-pointer'
              }`}
            >
              {t('masthead.langEnLabel')}
            </button>
          </div>

          {/* Edition / Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded border border-rule-light bg-paper-elevated text-ink-headline hover:border-mint-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base"
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

      {/* Masthead Title and Editorial Slogan */}
      <div className="text-center mb-6">
        <h1 className="masthead text-3xl sm:text-5xl md:text-display font-bold tracking-tight leading-none text-ink-headline break-words px-2">
          THE <span className="highlight-underline">BARZOLA</span> TIMES
        </h1>
        <p className="font-body text-xs sm:text-sm md:text-base text-ink-muted mt-2 italic px-2">
          "{t('masthead.tagline')}"
        </p>
      </div>
    </header>
  );
};

export default NewspaperMasthead;
