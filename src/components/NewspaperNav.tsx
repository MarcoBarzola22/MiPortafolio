import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface NavProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const NewspaperNav: React.FC<NavProps> = ({ currentPage, onPageChange }) => {
  const { t } = useTranslation();

  const pages = [
    { id: 0, label: t('nav.frontpage'), short: 'I' },
    { id: 1, label: t('nav.stack'), short: 'II' },
    { id: 2, label: t('nav.projects'), short: 'III' },
    { id: 3, label: t('nav.classifieds'), short: 'IV' },
  ];

  return (
    <nav
      aria-label="Secciones del periódico"
      className="sticky top-0 z-30 w-full bg-paper-base/95 backdrop-blur-sm border-t border-b border-rule-bold py-3 mb-8 transition-colors"
    >
      <div className="relative max-w-7xl mx-auto flex items-center justify-center px-2">
        {/* Navigation Page Buttons */}
        <div className="flex justify-center gap-1 md:gap-2">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageChange(page.id)}
              className={`
                px-3 md:px-6 py-2 font-headline text-body transition-all duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base
                ${currentPage === page.id
                  ? 'bg-mint-base text-mint-contrast font-semibold shadow-sm'
                  : 'hover:bg-paper-muted text-ink-headline'
                }
              `}
            >
              <span className="hidden md:inline">{page.label}</span>
              <span className="md:hidden">§{page.short}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NewspaperNav;
