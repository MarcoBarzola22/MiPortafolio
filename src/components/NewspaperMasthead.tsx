const NewspaperMasthead = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full border-b-2 border-foreground/80 pb-4 mb-4">
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
    </header>
  );
};

export default NewspaperMasthead;
