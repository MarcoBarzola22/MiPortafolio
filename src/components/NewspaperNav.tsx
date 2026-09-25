import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface NavProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const NewspaperNav: React.FC<NavProps> = ({ currentPage, onPageChange }) => {
  const { t } = useTranslation();

  const pages = [
    { id: 0, label: t('nav.frontpage') },
    { id: 1, label: t('nav.stack') },
    { id: 2, label: t('nav.projects') },
    { id: 3, label: t('nav.classifieds') },
  ];

  return (
    <nav
      aria-label="Secciones del periódico"
      className="sticky top-0 z-50 w-full bg-paper-base border-t border-b border-rule-bold shadow-md py-2 sm:py-2.5 mb-6 sm:mb-8 transition-colors"
    >
      <div className="w-full max-w-7xl mx-auto overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-4">
        {/* Navigation Page Buttons - Always Full Names with Responsive Font & Smooth Scroll */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 md:gap-3 min-w-max mx-auto">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageChange(page.id)}
              className={`
                px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 font-headline text-xs sm:text-sm md:text-body transition-all duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base flex-shrink-0 cursor-pointer
                ${currentPage === page.id
                  ? 'bg-mint-base text-mint-contrast font-semibold shadow-sm'
                  : 'hover:bg-paper-muted text-ink-headline'
                }
              `}
            >
              <span>{page.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NewspaperNav;
