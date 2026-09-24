import React from 'react';
import { Code, Server, Database, Cloud, Workflow, Terminal, Layers, FileCode } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslationKey } from '@/types/i18n';

interface TechItem {
  icon: React.ReactNode;
  name: string;
  taglineKey: TranslationKey;
  descriptionKey: TranslationKey;
  featured?: boolean;
}

interface TechAdProps extends TechItem {
  t: (key: TranslationKey) => string;
}

const TechAd: React.FC<TechAdProps> = ({ icon, name, taglineKey, descriptionKey, featured, t }) => (
  <article 
    className={`
      article-card p-4 md:p-6 border-2 border-rule-bold bg-paper-elevated
      ${featured ? 'md:col-span-2 md:row-span-2' : ''}
    `}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-paper-muted text-mint-base border border-rule-light rounded">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-headline text-h3 font-bold text-ink-headline">
          {name}
        </h3>
        <p className="font-mono text-mono-sm italic text-mint-base mt-1">
          "{t(taglineKey)}"
        </p>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-dashed border-rule-dashed">
      <p className="font-body text-caption text-ink-body leading-relaxed">
        {t(descriptionKey)}
      </p>
    </div>

    {/* Vintage Ad Footer */}
    <div className="mt-4 text-center">
      <span className="inline-block border border-rule-light px-3 py-1 text-mono-sm font-mono uppercase tracking-widest text-ink-muted">
        {t('stack.badgePreferred')}
      </span>
    </div>
  </article>
);

const TechStackSection: React.FC = () => {
  const { t } = useTranslation();

  const technologies: TechItem[] = [
    {
      icon: <Code className="w-6 h-6" aria-hidden="true" />,
      name: "React",
      taglineKey: "stack.react.tagline",
      descriptionKey: "stack.react.desc",
      featured: true,
    },
    {
      icon: <Workflow className="w-6 h-6" aria-hidden="true" />,
      name: "n8n",
      taglineKey: "stack.n8n.tagline",
      descriptionKey: "stack.n8n.desc",
    },
    {
      icon: <Server className="w-6 h-6" aria-hidden="true" />,
      name: "Node.js",
      taglineKey: "stack.node.tagline",
      descriptionKey: "stack.node.desc",
    },
    {
      icon: <Layers className="w-6 h-6" aria-hidden="true" />,
      name: "TypeScript",
      taglineKey: "stack.ts.tagline",
      descriptionKey: "stack.ts.desc",
    },
    {
      icon: <Cloud className="w-6 h-6" aria-hidden="true" />,
      name: "AWS",
      taglineKey: "stack.aws.tagline",
      descriptionKey: "stack.aws.desc",
    },
    {
      icon: <Database className="w-6 h-6" aria-hidden="true" />,
      name: "PostgreSQL",
      taglineKey: "stack.postgres.tagline",
      descriptionKey: "stack.postgres.desc",
    },
    {
      icon: <Terminal className="w-6 h-6" aria-hidden="true" />,
      name: "Docker",
      taglineKey: "stack.docker.tagline",
      descriptionKey: "stack.docker.desc",
    },
    {
      icon: <FileCode className="w-6 h-6" aria-hidden="true" />,
      name: "Python",
      taglineKey: "stack.python.tagline",
      descriptionKey: "stack.python.desc",
    },
  ];

  return (
    <section className="animate-fade-in-up">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
          {t('stack.kicker')}
        </span>
        <h2 className="font-headline text-h2 font-bold mt-4 text-ink-headline">
          {t('stack.title')}
        </h2>
        <p className="font-headline text-body-lg italic text-ink-muted mt-2">
          {t('stack.subtitle')}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
        <div className="border-t border-rule-light"></div>
      </div>

      {/* Tech Grid - Vintage Ad Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {technologies.map((tech) => (
          <TechAd
            key={tech.name}
            {...tech}
            t={t}
          />
        ))}
      </div>

      {/* Footer Quote */}
      <div className="mt-10 text-center">
        <p className="font-headline text-body-lg italic text-ink-muted">
          {t('stack.footerQuote')}
        </p>
      </div>
    </section>
  );
};

export default TechStackSection;
