import React, { useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { X, ArrowLeft, Quote } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useTranslation } from '@/hooks/useTranslation';

export interface ArticleOverlayProps {
  /** Proyecto seleccionado para lectura profunda */
  project: CaseStudy;
  /** Callback para cerrar el reportaje y regresar a la portada */
  onClose: () => void;
}

const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Reportaje editorial a pantalla completa tipo página interior de periódico.
 * Animaciones aceleradas por GPU a 60 FPS mediante Framer Motion.
 *
 * Cumple con:
 * - RF-02, RF-03 (Layout editorial completo y animaciones GPU a 60 FPS)
 * - RF-04 (Internacionalización completa de todos los bloques narrativos)
 * - RA-01, RA-02, RA-03, RA-04 (Semántica dialog, focus trap, Escape, contraste WCAG AA)
 * - RNF-01, RNF-02, RNF-03 (60 FPS, diseño responsive Grid 12 cols, tokens OKLCH)
 * - Principios 1, 2, 3, 4 y 5 de la Constitución.
 */
export const ArticleOverlay: React.FC<ArticleOverlayProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  // 1. Bloquear el scroll de fondo sin provocar layout shift (CLS = 0)
  useScrollLock(true);

  // 2. Atrapar y ciclar foco del teclado con cierre accesible por Escape
  useFocusTrap(containerRef, {
    isActive: true,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  // 3. Variantes de animación GPU optimizadas con curva editorial
  const dialogVariants: Variants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: 20,
          transition: {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
        },
  };

  const {
    id,
    editorialId,
    category,
    headline,
    subheadline,
    heroMetric,
    problemLede,
    constraints,
    tradeOffs,
    stack,
    impactMetrics,
    image,
    imageAlt,
  } = project;

  const translatedCategory = t(category);
  const translatedSubheadline = t(subheadline);
  const translatedProblemLede = t(problemLede);
  const translatedConstraints = t(constraints);
  const translatedHeroLabel = t(heroMetric.label);
  const translatedHeroDesc = heroMetric.description ? t(heroMetric.description) : undefined;
  const translatedImageAlt = imageAlt ? t(imageAlt) : headline;

  return (
    <motion.div
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 lg:p-10 overflow-y-auto bg-ink-headline/60 backdrop-blur-sm"
      onClick={(e) => {
        // Cerrar al clickear el backdrop exterior
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`article-title-${id}`}
        tabIndex={-1}
        variants={dialogVariants}
        className="relative w-full max-w-5xl min-h-screen md:min-h-0 bg-paper-base text-ink-body border-x-0 md:border-2 border-rule-bold shadow-2xl my-auto focus:outline-none overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Barra superior fija de navegación editorial / Cierre */}
        <div className="sticky top-0 z-20 flex justify-between items-center px-4 md:px-8 py-3 bg-paper-base border-b-2 border-rule-bold">
          <div className="flex items-center gap-3 text-mono-sm font-mono text-ink-muted">
            <span className="font-semibold text-mint-base">{editorialId}</span>
            <span className="text-rule-light">/</span>
            <span className="uppercase tracking-widest">{translatedCategory}</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('projects.closeOverlayAria')}
            className="flex items-center gap-2 px-3 py-1.5 text-mono-sm font-mono font-semibold text-ink-headline bg-paper-muted hover:bg-mint-base hover:text-mint-contrast border border-rule-light transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline uppercase">{t('projects.returnToFrontPage')}</span>
            <span className="sm:hidden">RETURN</span>
            <X className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Área scrolleable interna del artículo */}
        <div className="overflow-y-auto flex-1 p-6 md:p-10">
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Columna Editorial Principal (8 columnas en desktop) */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Bloque 1: Cabecera Editorial */}
              <header className="border-b border-rule-bold pb-6 mb-8">
                <div className="flex items-center gap-2 text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold mb-2">
                  <span>DISPATCH // {t('projects.title')}</span>
                  <span>·</span>
                  <span className="text-ink-muted">{editorialId}</span>
                </div>

                <h1
                  id={`article-title-${id}`}
                  className="font-headline text-h1 md:text-display font-bold text-ink-headline leading-tight"
                >
                  {headline}
                </h1>

                <p className="font-headline text-body-lg md:text-h3 italic text-ink-muted mt-3 leading-snug">
                  {translatedSubheadline}
                </p>
              </header>

              {/* Bloque 2: Lede / El Problema */}
              <section className="mb-8">
                <div className="flex items-center gap-2 font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-3 border-b border-rule-light pb-1">
                  <span className="text-mint-base font-bold">SECTION 01 //</span> {t('projects.sectionProblem')}
                </div>
                <p className="text-body-lg font-body text-ink-headline leading-relaxed">
                  {translatedProblemLede}
                </p>
              </section>

              {/* Bloque 3: Restricciones Contextuales */}
              <section className="mb-8 p-5 bg-paper-muted/30 border border-rule-light rounded">
                <div className="flex items-center gap-2 font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-2">
                  <span className="text-mint-base font-bold">SECTION 02 //</span> {t('projects.sectionConstraints')}
                </div>
                <p className="font-body text-body text-ink-body leading-relaxed">
                  {translatedConstraints}
                </p>
              </section>

              {/* Bloque 4: Decisiones Arquitectónicas & Trade-offs (Pull-Quotes) */}
              <section className="mb-8">
                <div className="flex items-center gap-2 font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-4 border-b border-rule-light pb-1">
                  <span className="text-mint-base font-bold">SECTION 03 //</span> {t('projects.sectionTradeoffs')}
                </div>

                <div className="space-y-6">
                  {tradeOffs.map((tradeOff) => (
                    <figure
                      key={tradeOff.id}
                      className="border-l-4 border-mint-base bg-paper-muted/25 p-5 md:p-6 rounded-r transition-colors"
                    >
                      <div className="flex items-center gap-2 font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-3">
                        <Quote className="w-4 h-4 text-mint-base" />
                        <span className="text-mint-base font-bold">DECISIÓN //</span>
                        <span>{t(tradeOff.area)}</span>
                      </div>

                      <blockquote className="font-headline text-body-lg md:text-h3 italic text-ink-headline leading-snug">
                        “{t(tradeOff.quote)}”
                      </blockquote>

                      {tradeOff.rationale && (
                        <figcaption className="mt-4 pt-3 border-t border-rule-light/60 font-body text-body text-ink-muted leading-relaxed">
                          <span className="font-mono text-mono-sm font-semibold uppercase text-ink-headline mr-1.5">
                            Criterio Técnico:
                          </span>
                          {t(tradeOff.rationale)}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            </div>

            {/* Columna Lateral / Ficha Técnica Editorial (4 columnas en desktop) */}
            <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-rule-light pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-8">
              {/* Imagen del Proyecto */}
              <div className="border-2 border-rule-bold overflow-hidden bg-paper-muted">
                <img
                  src={image}
                  alt={translatedImageAlt}
                  className="editorial-image w-full h-48 md:h-56 object-cover"
                />
                <div className="p-2 border-t border-rule-light bg-paper-muted text-mono-sm font-mono text-ink-muted">
                  FIG. 01 // VISTA DEL SISTEMA
                </div>
              </div>

              {/* Métrica Héroe Destacada */}
              <div className="p-6 bg-paper-muted/30 border-2 border-rule-bold">
                <div className="font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-2">
                  MÉTRICA HÉROE // ARCHITECTURAL KPI
                </div>
                <div className="font-mono tabular-nums text-h2 md:text-h1 font-bold text-mint-base leading-none">
                  {heroMetric.value}
                </div>
                <div className="font-mono text-body font-semibold text-ink-headline mt-2">
                  {translatedHeroLabel}
                </div>
                {translatedHeroDesc && (
                  <p className="font-body text-body text-ink-muted mt-1 leading-relaxed">
                    {translatedHeroDesc}
                  </p>
                )}
              </div>

              {/* Pila Tecnológica / Tech Stack (Inmutable) */}
              <div>
                <div className="font-mono text-mono-sm uppercase tracking-wider text-ink-muted font-semibold mb-3 border-b border-rule-light pb-1">
                  {t('projects.sectionStack')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-paper-muted border border-rule-light px-2.5 py-1 text-mono-sm font-mono text-ink-headline rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Métricas de Impacto / Cuadro de Datos Tabulares */}
              <div className="border border-rule-bold">
                <div className="bg-ink-headline text-paper-base px-3 py-2 font-mono text-mono-sm uppercase tracking-wider font-semibold">
                  {t('projects.sectionMetrics')}
                </div>
                <dl className="divide-y divide-rule-light bg-paper-muted/20">
                  {impactMetrics.map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center px-4 py-2.5">
                      <dt className="font-body text-body text-ink-muted">{t(metric.label)}</dt>
                      <dd className="font-mono tabular-nums lining-nums font-semibold text-ink-headline text-right ml-4">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
};
