import { ExternalLink } from 'lucide-react';
import projectLaikavet from '@/assets/project-laikavet.jpg';
import projectAutomation from '@/assets/project-automation.jpg';
import projectInfrastructure from '@/assets/project-infrastructure.jpg';

interface ProjectProps {
  caseNumber: string;
  metric: string;
  metricLabel: string;
  image: string;
  category: string;
  headline: string;
  subheadline: string;
  excerpt: string;
  tags: string[];
}

const ProjectCard = ({ 
  caseNumber, 
  metric, 
  metricLabel, 
  image, 
  category, 
  headline, 
  subheadline, 
  excerpt, 
  tags 
}: ProjectProps) => (
  <article className="article-card w-full h-full flex flex-col bg-paper-card border-2 border-rule-bold overflow-hidden group">
    {/* Card Metadata Bar */}
    <div className="flex justify-between items-center px-4 py-2 border-b border-rule-light bg-paper-muted text-mono-sm font-mono">
      <span className="text-ink-muted tabular-nums font-semibold">{caseNumber}</span>
      <span className="text-mint-base font-bold tabular-nums flex items-center gap-1.5">
        <span>{metric}</span>
        <span className="text-ink-subtle font-normal">({metricLabel})</span>
      </span>
    </div>

    {/* Image */}
    <div className="relative h-48 md:h-56 overflow-hidden">
      <img
        src={image}
        alt={headline}
        className="editorial-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-headline/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hover overlay with link */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          type="button"
          className="bg-mint-base text-mint-contrast px-4 py-2 font-mono text-mono-sm font-semibold flex items-center gap-2 hover:bg-mint-hover transition-colors shadow-lg"
        >
          Read Full Story <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content */}
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

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-rule-dashed">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="bg-paper-muted border border-rule-light px-2 py-1 text-mono-sm font-mono text-ink-headline rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </article>
);

const ProjectsSection = () => {
  const projects: ProjectProps[] = [
    {
      caseNumber: "REP-2024.01",
      metric: "10,000+",
      metricLabel: "Active Pets",
      image: projectLaikavet,
      category: "Featured Project",
      headline: "LaikaVet",
      subheadline: "Modern Pet Healthcare Platform",
      excerpt: "A comprehensive veterinary management system enabling pet owners to track health records, book appointments, and communicate with veterinarians. Built with React Native and a Node.js backend.",
      tags: ["React Native", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      caseNumber: "REP-2024.02",
      metric: "80.0%",
      metricLabel: "Toil Reduction",
      image: projectAutomation,
      category: "Automation",
      headline: "Enterprise Workflow Engine",
      subheadline: "Connecting 50+ Services Seamlessly",
      excerpt: "Designed and implemented a no-code automation platform using n8n, enabling business users to create complex workflows without developer intervention. Reduced manual processes by 80%.",
      tags: ["n8n", "Docker", "REST APIs", "Webhooks"],
    },
    {
      caseNumber: "REP-2024.03",
      metric: "99.99%",
      metricLabel: "Service SLA",
      image: projectInfrastructure,
      category: "Infrastructure",
      headline: "Cloud Migration Initiative",
      subheadline: "Zero-Downtime at Scale",
      excerpt: "Led the migration of legacy infrastructure to AWS, implementing Kubernetes for container orchestration. Achieved 99.99% uptime and 60% cost reduction through optimized resource allocation.",
      tags: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    },
  ];

  return (
    <section className="animate-fade-in-up">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
          Projects Section
        </span>
        <h2 className="font-headline text-h2 font-bold mt-4 text-ink-headline">
          THE <span className="highlight">DAILY</span> REPORTS
        </h2>
        <p className="font-headline text-body-lg italic text-ink-muted mt-2">
          Featured Works & Case Studies
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
        <div className="border-t border-rule-light"></div>
      </div>

      {/* Vertical Adaptive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.headline} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
