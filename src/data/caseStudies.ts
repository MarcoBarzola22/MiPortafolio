import { CaseStudy } from '@/types/caseStudy';
import projectLaikavet from '@/assets/project-laikavet.jpg';
import projectAutomation from '@/assets/project-automation.jpg';
import projectInfrastructure from '@/assets/project-infrastructure.jpg';

export const caseStudies: CaseStudy[] = [
  {
    id: 'smartforge',
    editorialId: 'REP-2024.01',
    category: 'FULL-STACK · PWA',
    headline: 'SmartForge',
    subheadline: 'Motor Biomecánico de Periodización Inteligente',
    heroMetric: {
      value: 'O(N) → O(1)',
      label: 'Generación Algorítmica',
      description: 'Generación algorítmica de prescripciones en milisegundos',
    },
    excerpt: 'Digitalización y optimización algorítmica de la periodización deportiva, reemplazando hojas de cálculo estáticas por un motor relacional de fatiga articular.',
    problemLede: 'Un entrenador altamente cualificado gestionaba la periodización y auditoría de fatiga articular de sus clientes mediante hojas de cálculo estáticas en Excel. El cálculo dinámico de múltiples variables —equipo disponible en el gimnasio, restricciones horarias del cliente, esfuerzo percibido (RPE) y progresión de cargas cruzada con peso corporal— era imposible de escalar manualmente.',
    constraints: 'Proyecto bootstrapped (iniciado para uso personal y fase beta para un gimnasio local). Requería una arquitectura de muy bajo coste de mantenimiento, pero estrictamente replicable para poder migrar de un entorno local de desarrollo a la infraestructura del gimnasio sin fricción ni discrepancias.',
    tradeOffs: [
      {
        id: 'tradeoff-sf-1',
        area: 'Infraestructura & DevOps',
        quote: 'Asumí mayor complejidad DevOps inicial con Docker (PostgreSQL + Node/Express) en lugar de un BaaS rápido como Supabase, a cambio de control absoluto sobre el motor relacional para consultas biomecánicas y cero discrepancias entre desarrollo y producción.',
        rationale: 'Las consultas de acumulación de fatiga articular requieren joins complejos e integridad referencial estricta, inviable en entornos BaaS serverless no especializados.',
      },
      {
        id: 'tradeoff-sf-2',
        area: 'Gestión de Estado Asíncrono',
        quote: 'Opté por React Query en lugar de un store global masivo (Redux/Zustand), delegando la gestión del estado asíncrono y el caché al servidor para mantener la PWA ligera en dispositivos móviles dentro del gimnasio.',
        rationale: 'Minimiza la huella de memoria en el navegador móvil del usuario durante sesiones intensivas de entrenamiento con conectividad intermitente.',
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
      { label: 'Lógica Biomecánica', value: '100% Relacional' },
      { label: 'Tiempo de Cálculo', value: '< 20ms' },
      { label: 'Entorno DevOps', value: 'Dockerizado' },
      { label: 'Estado del Sistema', value: 'Fase Beta' },
    ],
    image: projectLaikavet,
    imageAlt: 'Captura del sistema SmartForge mostrando la interfaz de auditoría biomecánica y fatiga articular',
  },
  {
    id: 'fitplan-desktop',
    editorialId: 'REP-2024.02',
    category: 'DESKTOP · OFFLINE-FIRST',
    headline: 'FitPlan Desktop',
    subheadline: 'CRM Offline-First con Taxonomía de Ejercicios',
    heroMetric: {
      value: '100%',
      label: 'Offline-First',
      description: 'Tolerancia absoluta a cortes e intermitencias de red',
    },
    excerpt: 'Sistema local de escritorio diseñado para operar con cero latencia y tolerancia total a fallos de red en equipos de hardware limitado.',
    problemLede: 'Un entrenador necesitaba un sistema local (CRM) combinado con una taxonomía de ejercicios compleja (videos, grupos musculares, rangos de movimiento) para ensamblar plantillas de entrenamiento comercializables y exportarlas a Excel. Las soluciones web estándar fallaban debido a la fricción operativa: cortes de internet constantes e imposibilidad de operar sin conexión.',
    constraints: 'Hardware y conectividad severamente limitados. El usuario final operaba desde una netbook de baja gama en un entorno con red hostil (intermitente). El sistema requería disponibilidad 100% offline y capacidad para generar entregables interoperables (Excels enriquecidos).',
    tradeOffs: [
      {
        id: 'tradeoff-fp-1',
        area: 'Arquitectura de Ejecución',
        quote: 'Asumí un mayor peso de empaquetado y despliegue nativo con Electron + SQLite (Prisma) en lugar de una web app estándar, a cambio de lograr tolerancia total a fallos de red y latencia cero en lectura/escritura.',
        rationale: 'La dependencia de una API web provocaba pérdidas de datos durante cortes de conexión repentinos mientras se redactaban rutinas extensas.',
      },
      {
        id: 'tradeoff-fp-2',
        area: 'Optimización de Memoria V8',
        quote: 'Sacrifiqué el precargado agresivo de datos implementando evaluación perezosa (lazy evaluation) y estado reactivo para contener la huella de RAM de V8/Electron en una netbook de gama baja. La memoria solo retiene las entidades estrictamente en uso.',
        rationale: 'Evita que el proceso renderer de Chromium sature la memoria disponible del sistema operativo huésped.',
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
      { label: 'Disponibilidad de Red', value: '100% Offline' },
      { label: 'Latencia Lectura/Escritura', value: '0ms (Local)' },
      { label: 'Armado de Plantillas', value: 'Minutos vs Horas' },
      { label: 'Consumo de RAM', value: 'Controlado V8' },
    ],
    image: projectAutomation,
    imageAlt: 'Captura editorial de FitPlan Desktop ilustrando la taxonomía de ejercicios y ensamble de rutinas',
  },
  {
    id: 'interactive-digital-menu',
    editorialId: 'REP-2024.03',
    category: 'FULL-STACK · E-COMMERCE',
    headline: 'Interactive Digital Menu',
    subheadline: 'Conversational Commerce con Stock en Tiempo Real',
    heroMetric: {
      value: '0 PDFs',
      label: 'Menús Estáticos',
      description: 'Erradicación total de cartas estáticas y desactualizadas',
    },
    excerpt: 'Plataforma web dinámica orientada a conversational commerce que sustituye cartas PDF por un catálogo reactivo con despacho estructurado a WhatsApp.',
    problemLede: 'Un restaurante de gastronomía venezolana operaba con menús en formato PDF estático. Esto generaba un cuello de botella crítico: imposibilidad de actualizar precios o inhabilitar platos agotados en tiempo real, mala experiencia de usuario (obligando a descargar/hacer zoom en móviles) y una toma de pedidos manual muy propensa a errores comunicacionales en el delivery.',
    constraints: 'El negocio carecía de personal técnico, por lo que el panel de administración debía tener una curva de aprendizaje nula (fricción cero). Además, la solución debía acoplarse orgánicamente a sus canales de adquisición actuales (físico mediante QR en mesas y digital vía enlace en Instagram) sin obligar al cliente a descargar apps de terceros.',
    tradeOffs: [
      {
        id: 'tradeoff-idm-1',
        area: 'Embudo de Conversión & Checkout',
        quote: 'Sacrifiqué el control nativo del checkout final, delegándolo a WhatsApp mediante webhooks y formateo automatizado ("Conversational Commerce"), en lugar de construir una plataforma de e-commerce pesada con pasarela de pago in-app. Esto maximizó la conversión respetando el hábito natural del cliente.',
        rationale: 'El público objetivo abandonaba carritos tradicionales que exigían registros largos y pasarelas de pago externas engorrosas en smartphones.',
      },
      {
        id: 'tradeoff-idm-2',
        area: 'Panel de Control & CMS',
        quote: 'Elegí Node.js y PostgreSQL (Prisma ORM) para mantener el panel de administración extremadamente ligero, enfocado únicamente en actualizar precios al instante y alternar stock de ingredientes críticos, prescindiendo de soluciones CMS monolíticas sobredimensionadas.',
        rationale: 'Un personal no técnico requiere interfaces directas sin capas de abstracción complejas para operar durante las horas pico de servicio.',
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
      { label: 'Uso de Archivos PDF', value: '0% Erradicado' },
      { label: 'Sincronización de Stock', value: 'Tiempo Real' },
      { label: 'Precisión de Despacho', value: '100% Estructurado' },
      { label: 'Fricción de Pedido', value: 'Cero Apps Extra' },
    ],
    image: projectInfrastructure,
    imageAlt: 'Captura editorial de Interactive Digital Menu mostrando la selección de platos y el stock en tiempo real',
  },
];
