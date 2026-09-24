import { Code, Server, Database, Cloud, Workflow, Terminal, Layers, Cpu } from 'lucide-react';

interface TechAdProps {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  featured?: boolean;
}

const TechAd = ({ icon, name, tagline, description, featured }: TechAdProps) => (
  <div 
    className={`
      article-card p-4 md:p-6 border-2 border-foreground/80 bg-card
      ${featured ? 'md:col-span-2 md:row-span-2' : ''}
    `}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-headline text-xl md:text-2xl font-bold">
          {name}
        </h3>
        <p className="font-body text-sm italic text-primary mt-1">
          "{tagline}"
        </p>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-dashed border-foreground/30">
      <p className="font-body text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>

    {/* Vintage Ad Footer */}
    <div className="mt-4 text-center">
      <span className="inline-block border border-foreground/30 px-3 py-1 text-xs font-body uppercase tracking-widest">
        ★ Preferred Tool ★
      </span>
    </div>
  </div>
);

const TechStackSection = () => {
  const technologies = [
    {
      icon: <Code className="w-6 h-6" />,
      name: "React",
      tagline: "The Framework of Choice",
      description: "Building dynamic user interfaces with component-based architecture. Expertise in hooks, context, and performance optimization.",
      featured: true,
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      name: "n8n",
      tagline: "Automate the Mundane",
      description: "Creating sophisticated workflow automations connecting hundreds of services without writing code.",
    },
    {
      icon: <Server className="w-6 h-6" />,
      name: "Node.js",
      tagline: "JavaScript Everywhere",
      description: "Server-side excellence with Express, Fastify, and event-driven architecture.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      name: "TypeScript",
      tagline: "Types Matter",
      description: "Bringing sanity to JavaScript with strong typing and excellent developer experience.",
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      name: "AWS",
      tagline: "Cloud Infrastructure",
      description: "Lambda, ECS, S3, CloudFront—architecting resilient cloud solutions at scale.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      name: "PostgreSQL",
      tagline: "Data Reliability",
      description: "Designing efficient schemas, complex queries, and ensuring data integrity.",
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      name: "Docker",
      tagline: "Containerize Everything",
      description: "Consistent environments from development to production with container orchestration.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      name: "Kubernetes",
      tagline: "Orchestration Mastery",
      description: "Managing containerized workloads with auto-scaling and self-healing deployments.",
    },
  ];

  return (
    <section className="animate-fade-in-up">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="bg-foreground text-background px-3 py-1 text-xs font-body uppercase tracking-widest">
          Technical Section
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-bold mt-4">
          THE <span className="highlight">TECH</span> STACK
        </h2>
        <p className="font-headline text-lg italic text-muted-foreground mt-2">
          Tools of the Trade — An Advertising Supplement
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-foreground/80 py-1 mb-8">
        <div className="border-t border-foreground/30"></div>
      </div>

      {/* Tech Grid - Vintage Ad Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {technologies.map((tech, index) => (
          <TechAd
            key={tech.name}
            {...tech}
          />
        ))}
      </div>

      {/* Footer Quote */}
      <div className="mt-10 text-center">
        <p className="font-headline text-lg italic text-muted-foreground">
          "The right tool for every job — expertly wielded."
        </p>
      </div>
    </section>
  );
};

export default TechStackSection;
