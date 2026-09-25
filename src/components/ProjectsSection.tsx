import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { caseStudies } from '@/data/caseStudies';
import { CaseStudy } from '@/types/caseStudy';
import { useTranslation } from '@/hooks/useTranslation';
import { ProjectCard } from './ProjectCard';
import { ArticleOverlay } from './ArticleOverlay';

/**
 * Sección orquestadora de Casos de Estudio ("THE DAILY REPORTS").
 * Gestiona el grid adaptativo de portadas y el ciclo de vida del overlay modal.
 *
 * Cumple con:
 * - RF-01 (Tarjetas con datos reales)
 * - RF-04 (Internacionalización completa de encabezados y contenidos)
 * - RF-05 (Gestión de estado local sin router)
 * - RA-01 (Aislamiento de fondo con inert durante el modal)
 * - Principios 1, 2, 4 y 5 de la Constitución.
 */
const ProjectsSection = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);

  return (
    <section className="animate-fade-in-up w-full max-w-full">
      {/* Contenedor principal de portada, marcado como inerte cuando el modal está abierto */}
      <div inert={selectedProject !== null ? true : undefined} className="w-full">
        {/* Encabezado Editorial de Sección Internacionalizado */}
        <div className="text-center mb-8">
          <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
            {t('projects.kicker')}
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-h2 font-bold mt-4 text-ink-headline break-words">
            {t('projects.title')}
          </h2>
          <p className="font-headline text-sm sm:text-base md:text-body-lg italic text-ink-muted mt-2">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Separadores Editoriales Dobles */}
        <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
          <div className="border-t border-rule-light"></div>
        </div>

        {/* Grid Adaptativo de Tarjetas de Casos de Estudio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {caseStudies.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selectedProject?.id === project.id}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      {/* Reportaje Editorial a Pantalla Completa con Transiciones de Salida */}
      <AnimatePresence>
        {selectedProject && (
          <ArticleOverlay
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
