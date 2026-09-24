import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import { ProjectCard } from '@/components/ProjectCard';
import { caseStudies } from '@/data/caseStudies';

describe('ProjectCard Component', () => {
  const mockProject = caseStudies[0]; // SmartForge

  it('renderiza fielmente los datos editoriales y métricas del proyecto', () => {
    render(<ProjectCard project={mockProject} />);

    // Verificar ID editorial y métrica héroe con números tabulares
    expect(screen.getByText(mockProject.editorialId)).toBeInTheDocument();
    expect(screen.getByText(mockProject.heroMetric.value)).toBeInTheDocument();
    expect(screen.getByText(`(${mockProject.heroMetric.label})`)).toBeInTheDocument();

    // Verificar titulares y extracto
    expect(screen.getByText(mockProject.category)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: mockProject.headline })).toBeInTheDocument();
    expect(screen.getByText(mockProject.subheadline)).toBeInTheDocument();
    expect(screen.getByText(mockProject.excerpt)).toBeInTheDocument();

    // Verificar tags del stack
    mockProject.stack.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it('incluye clases tipográficas para números tabulares en ID editorial y métricas', () => {
    const { container } = render(<ProjectCard project={mockProject} />);

    const editorialIdEl = screen.getByText(mockProject.editorialId);
    expect(editorialIdEl).toHaveClass('tabular-nums');
    expect(editorialIdEl).toHaveClass('font-mono');

    const heroMetricVal = screen.getByText(mockProject.heroMetric.value);
    const parentContainer = heroMetricVal.closest('div');
    expect(parentContainer).toHaveClass('tabular-nums');
  });

  it('ejecuta onSelect al hacer click en el botón accesible expandido', () => {
    const handleSelect = vi.fn();
    render(<ProjectCard project={mockProject} onSelect={handleSelect} />);

    const accessibleButton = screen.getByRole('button', {
      name: `Leer reportaje completo: ${mockProject.headline}`,
    });

    fireEvent.click(accessibleButton);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockProject);
  });

  it('ejecuta onSelect al activar la tarjeta con tecla Enter y tecla Space', () => {
    const handleSelect = vi.fn();
    render(<ProjectCard project={mockProject} onSelect={handleSelect} />);

    const accessibleButton = screen.getByRole('button', {
      name: `Leer reportaje completo: ${mockProject.headline}`,
    });

    // Probar tecla Enter
    fireEvent.keyDown(accessibleButton, { key: 'Enter', code: 'Enter' });
    expect(handleSelect).toHaveBeenCalledTimes(1);

    // Probar tecla Space
    fireEvent.keyDown(accessibleButton, { key: ' ', code: 'Space' });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it('no presenta violaciones de accesibilidad automatizada según axe-core', async () => {
    const { container } = render(<ProjectCard project={mockProject} />);

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
