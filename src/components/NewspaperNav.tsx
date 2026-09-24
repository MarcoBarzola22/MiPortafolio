interface NavProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pages = [
  { id: 0, label: 'Front Page', short: 'I' },
  { id: 1, label: 'Tech Stack', short: 'II' },
  { id: 2, label: 'Projects', short: 'III' },
  { id: 3, label: 'Classifieds', short: 'IV' },
];

const NewspaperNav = ({ currentPage, onPageChange }: NavProps) => {
  return (
    <nav
      aria-label="Secciones del periódico"
      className="sticky top-0 z-30 w-full bg-paper-base/95 backdrop-blur-sm border-t border-b border-rule-bold py-3 mb-8 transition-colors"
    >
      <div className="flex justify-center gap-1 md:gap-2">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onPageChange(page.id)}
            className={`
              px-3 md:px-6 py-2 font-headline text-body transition-all duration-300 rounded
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
    </nav>
  );
};

export default NewspaperNav;
