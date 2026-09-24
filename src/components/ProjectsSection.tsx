import { ExternalLink } from 'lucide-react';
import projectLaikavet from '@/assets/project-laikavet.jpg';
import projectAutomation from '@/assets/project-automation.jpg';
import projectInfrastructure from '@/assets/project-infrastructure.jpg';

interface ProjectProps {
  image: string;
  category: string;
  headline: string;
  subheadline: string;
  excerpt: string;
  tags: string[];
}

const ProjectCard = ({ image, category, headline, subheadline, excerpt, tags }: ProjectProps) => (
  <article className="article-card w-full h-full flex flex-col bg-card border-2 border-foreground/80 overflow-hidden group">
    {/* Image */}
    <div className="relative h-48 md:h-56 overflow-hidden">
      <img
        src={image}
        alt={headline}
        className="editorial-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hover overlay with link */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-primary text-primary-foreground px-4 py-2 font-body text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
          Read Full Story <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 md:p-6 article-highlight transition-colors duration-300 flex flex-col flex-1">
      <span className="text-xs font-body uppercase tracking-widest text-primary">
        {category}
      </span>
      
      <h3 className="font-headline text-2xl md:text-3xl font-bold mt-2 leading-tight">
        {headline}
      </h3>
      
      <p className="font-headline text-base italic text-muted-foreground mt-2">
        {subheadline}
      </p>

      <p className="font-body text-sm text-foreground/80 mt-4 leading-relaxed flex-1">
        {excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-foreground/30">
        {tags.map((tag) => (
          <span key={tag} className="bg-secondary px-2 py-1 text-xs font-body text-secondary-foreground">
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
      image: projectLaikavet,
      category: "Featured Project",
      headline: "LaikaVet",
      subheadline: "Modern Pet Healthcare Platform",
      excerpt: "A comprehensive veterinary management system enabling pet owners to track health records, book appointments, and communicate with veterinarians. Built with React Native and a Node.js backend.",
      tags: ["React Native", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      image: projectAutomation,
      category: "Automation",
      headline: "Enterprise Workflow Engine",
      subheadline: "Connecting 50+ Services Seamlessly",
      excerpt: "Designed and implemented a no-code automation platform using n8n, enabling business users to create complex workflows without developer intervention. Reduced manual processes by 80%.",
      tags: ["n8n", "Docker", "REST APIs", "Webhooks"],
    },
    {
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
        <span className="bg-foreground text-background px-3 py-1 text-xs font-body uppercase tracking-widest">
          Projects Section
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-bold mt-4">
          THE <span className="highlight">DAILY</span> REPORTS
        </h2>
        <p className="font-headline text-lg italic text-muted-foreground mt-2">
          Featured Works & Case Studies
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-foreground/80 py-1 mb-8">
        <div className="border-t border-foreground/30"></div>
      </div>

      {/* Vertical Adaptive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.headline} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
