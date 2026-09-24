import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { caseStudies } from '@/data/caseStudies';
import { CaseStudy } from '@/types/caseStudy';
import { ProjectCard } from './ProjectCard';
import { ArticleOverlay } from './ArticleOverlay';

/**
 * Sección orquestadora de Casos de Estudio ("THE DAILY REPORTS").
 * Gestiona el grid adaptativo de portadas y el ciclo de vida del overlay modal.
 *
 * Cumple con:
 * - RF-01 (Tarjetas con datos reales)
 * - RF-05 (Gestión de estado local sin router)
 * - RA-01 (Aislamiento de fondo con inert durante el modal)
 * - Principios 1, 2, 4 y 5 de la Constitución.
 */
const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);

  return (
    <section className="animate-fade-in-up">
      {/* Contenedor principal de portada, marcado como inerte cuando el modal está abierto */}
      <div inert={selectedProject !== null ? true : undefined}>
        {/* Encabezado Editorial de Sección */}
        <div className="text-center mb-8">
          <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
            Projects Section
          </span>
          <h2 className="font-headline text-h2 font-bold mt-4 text-ink-headline">
            THE <span className="highlight">DAILY</span> REPORTS
          </h2>
          <p className="font-headline text-body-lg italic text-ink-muted mt-2">
            Featured Works & Architectural Case Studies
          </p>
        </div>

        {/* Separadores Editoriales Dobles */}
        <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
          <div className="border-t border-rule-light"></div>
        </div>

        {/* Grid Adaptativo de Tarjetas de Casos de Estudio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
