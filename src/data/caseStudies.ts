import { CaseStudy } from '@/types/caseStudy';
import projectLaikavet from '@/assets/project-laikavet.jpg';
import projectAutomation from '@/assets/project-automation.jpg';
import projectInfrastructure from '@/assets/project-infrastructure.jpg';

export const caseStudies: CaseStudy[] = [
  {
    id: 'smartforge',
    editorialId: 'REP-2024.01',
    category: 'project.smartforge.category',
    headline: 'SmartForge',
    subheadline: 'project.smartforge.subheadline',
    heroMetric: {
      value: 'O(N) → O(1)',
      label: 'project.smartforge.heroMetricLabel',
      description: 'project.smartforge.heroMetricDesc',
    },
    excerpt: 'project.smartforge.excerpt',
    problemLede: 'project.smartforge.problemLede',
    constraints: 'project.smartforge.constraints',
    tradeOffs: [
      {
        id: 'tradeoff-sf-1',
        area: 'project.smartforge.tradeoff1Area',
        quote: 'project.smartforge.tradeoff1Quote',
        rationale: 'project.smartforge.tradeoff1Rationale',
      },
      {
        id: 'tradeoff-sf-2',
        area: 'project.smartforge.tradeoff2Area',
        quote: 'project.smartforge.tradeoff2Quote',
        rationale: 'project.smartforge.tradeoff2Rationale',
      },
    ],
    stack: [
      'React',
      'TypeScript',
      'React Query',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Docker',
      'PWA',
    ],
    impactMetrics: [
      { label: 'project.smartforge.metric1Label', value: '100% Relacional' },
      { label: 'project.smartforge.metric2Label', value: '< 20ms' },
      { label: 'project.smartforge.metric3Label', value: 'Dockerizado' },
      { label: 'project.smartforge.metric4Label', value: 'Fase Beta' },
    ],
    image: projectLaikavet,
    imageAlt: 'project.smartforge.imageAlt',
  },
  {
    id: 'fitplan-desktop',
    editorialId: 'REP-2024.02',
    category: 'project.fitplan.category',
    headline: 'FitPlan Desktop',
    subheadline: 'project.fitplan.subheadline',
    heroMetric: {
      value: '100%',
      label: 'project.fitplan.heroMetricLabel',
      description: 'project.fitplan.heroMetricDesc',
    },
    excerpt: 'project.fitplan.excerpt',
    problemLede: 'project.fitplan.problemLede',
    constraints: 'project.fitplan.constraints',
    tradeOffs: [
      {
        id: 'tradeoff-fp-1',
        area: 'project.fitplan.tradeoff1Area',
        quote: 'project.fitplan.tradeoff1Quote',
        rationale: 'project.fitplan.tradeoff1Rationale',
      },
      {
        id: 'tradeoff-fp-2',
        area: 'project.fitplan.tradeoff2Area',
        quote: 'project.fitplan.tradeoff2Quote',
        rationale: 'project.fitplan.tradeoff2Rationale',
      },
    ],
    stack: [
      'Electron',
      'React 19',
      'TypeScript',
      'Prisma ORM',
      'SQLite',
      'Lazy Evaluation',
    ],
    impactMetrics: [
      { label: 'project.fitplan.metric1Label', value: '100% Offline' },
      { label: 'project.fitplan.metric2Label', value: '0ms (Local)' },
      { label: 'project.fitplan.metric3Label', value: 'Minutos vs Horas' },
      { label: 'project.fitplan.metric4Label', value: 'Controlado V8' },
    ],
    image: projectAutomation,
    imageAlt: 'project.fitplan.imageAlt',
  },
  {
    id: 'interactive-digital-menu',
    editorialId: 'REP-2024.03',
    category: 'project.menu.category',
    headline: 'Interactive Digital Menu',
    subheadline: 'project.menu.subheadline',
    heroMetric: {
      value: '0 PDFs',
      label: 'project.menu.heroMetricLabel',
      description: 'project.menu.heroMetricDesc',
    },
    excerpt: 'project.menu.excerpt',
    problemLede: 'project.menu.problemLede',
    constraints: 'project.menu.constraints',
    tradeOffs: [
      {
        id: 'tradeoff-idm-1',
        area: 'project.menu.tradeoff1Area',
        quote: 'project.menu.tradeoff1Quote',
        rationale: 'project.menu.tradeoff1Rationale',
      },
      {
        id: 'tradeoff-idm-2',
        area: 'project.menu.tradeoff2Area',
        quote: 'project.menu.tradeoff2Quote',
        rationale: 'project.menu.tradeoff2Rationale',
      },
    ],
    stack: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Prisma ORM',
      'WhatsApp Webhooks',
    ],
    impactMetrics: [
      { label: 'project.menu.metric1Label', value: '0% Erradicado' },
      { label: 'project.menu.metric2Label', value: 'Tiempo Real' },
      { label: 'project.menu.metric3Label', value: '100% Estructurado' },
      { label: 'project.menu.metric4Label', value: 'Cero Apps Extra' },
    ],
    image: projectInfrastructure,
    imageAlt: 'project.menu.imageAlt',
  },
];
