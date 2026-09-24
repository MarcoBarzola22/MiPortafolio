import { ExternalLink } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

export interface ProjectCardProps {
  /** Objeto de datos del caso de estudio */
  project: CaseStudy;
  /** Callback invocado al seleccionar la tarjeta para lectura profunda */
  onSelect?: (project: CaseStudy) => void;
  /** Estado de selección actual */
  isSelected?: boolean;
}

/**
 * Componente de tarjeta de portada con diseño editorial estricto y patrón accesible WCAG AA.
 * Cumple con RF-01, RA-05, RNF-03 y Principios 2 y 4 de la Constitución.
 */
export const ProjectCard = ({
  project,
  onSelect,
  isSelected = false,
}: ProjectCardProps) => {
  const {
    editorialId,
    heroMetric,
    image,
    imageAlt,
    category,
    headline,
    subheadline,
    excerpt,
    stack,
  } = project;

  const handleSelect = () => {
    onSelect?.(project);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <article
      className={`article-card relative w-full h-full flex flex-col bg-paper-card border-2 border-rule-bold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-mint-base ${
        isSelected ? 'ring-2 ring-mint-base' : ''
      }`}
    >
      {/* Botón transparente accesible de cobertura total (Patrón Inclusive Components) */}
      <button
        type="button"
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        aria-label={`Leer reportaje completo: ${headline}`}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base focus-visible:ring-offset-2 focus-visible:ring-offset-paper-base"
      >
        <span className="sr-only">Leer reportaje completo: {headline}</span>
      </button>

      {/* Barra superior de metadatos editoriales tipo periódico */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-rule-light bg-paper-muted text-mono-sm font-mono">
        <span className="text-ink-muted font-mono tabular-nums font-semibold tracking-wider">
          {editorialId}
        </span>
        <div className="flex items-center gap-1.5 font-mono tabular-nums font-bold text-mint-base">
          <span>{heroMetric.value}</span>
          <span className="text-ink-muted font-normal text-mono-sm">
            ({heroMetric.label})
          </span>
        </div>
      </div>

      {/* Imagen editorial */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-paper-muted">
        <img
          src={image}
          alt={imageAlt || headline}
          className="editorial-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-headline/60 via-ink-headline/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Indicador visual de hover (decorativo, sin colisión interactiva con el botón principal) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          <span className="bg-mint-base text-mint-contrast px-4 py-2 font-mono text-mono-sm font-semibold flex items-center gap-2 shadow-lg">
            Read Full Story <ExternalLink className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Contenido editorial */}
      <div className="p-5 md:p-6 article-highlight transition-colors duration-300 flex flex-col flex-1">
        <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
          {category}
        </span>

        <h3 className="font-headline text-h3 font-bold mt-2 leading-tight text-ink-headline">
          {headline}
        </h3>

        <p className="font-headline text-body italic text-ink-muted mt-2">
          {subheadline}
        </p>

        <p className="font-body text-body text-ink-body mt-4 leading-relaxed flex-1">
          {excerpt}
        </p>

        {/* Tags del Stack con tokens semánticos */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-rule-dashed">
          {stack.map((tech) => (
            <span
              key={tech}
              className="bg-paper-muted border border-rule-light px-2 py-1 text-mono-sm font-mono text-ink-headline rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
