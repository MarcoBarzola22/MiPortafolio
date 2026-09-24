/**
 * Modelo de datos TypeScript estricto para Casos de Estudio Editoriales.
 * Especificación: specs/003-case-studies/spec.md (RF-04, RNF-03)
 * Plan: specs/003-case-studies/plan.md (§3)
 */

export interface HeroMetric {
  /** Valor numérico o sintáctico de alto impacto (ej: "O(N) → O(1)", "100%", "0") */
  value: string;
  /** Unidad o etiqueta corta (ej: "Offline", "PDFs", "Latencia") */
  label: string;
  /** Contexto o descripción complementaria de la métrica */
  description?: string;
}

export interface ArchitecturalTradeOff {
  /** ID único o correlativo para renderizado de listas */
  id: string;
  /** Título o ámbito de la decisión (ej: "Infraestructura & DevOps", "Gestión de Estado") */
  area: string;
  /** Cita editorial destacada con la estructura "Sacrificamos X para ganar Y" */
  quote: string;
  /** Razón técnica de ingeniería detrás del compromiso */
  rationale?: string;
}

export interface CaseStudyMetric {
  /** Etiqueta descriptiva del impacto logrado */
  label: string;
  /** Valor o resultado alcanzado con tabular-nums */
  value: string;
}

export interface CaseStudy {
  /** Identificador técnico único para claves de React y referencias DOM (ej: "smartforge") */
  id: string;
  /** Identificador editorial tipo prensa (ej: "REP-2024.01") */
  editorialId: string;
  /** Categoría temática en mayúsculas (ej: "FULL-STACK · PWA") */
  category: string;
  /** Titular principal del proyecto */
  headline: string;
  /** Bajada o subtitular periodístico explicativo */
  subheadline: string;
  /** Métrica héroe visible tanto en tarjeta como en cabecera del artículo */
  heroMetric: HeroMetric;
  /** Extracto condensado para la tarjeta de portada (1-2 oraciones) */
  excerpt: string;
  /** Narrativa detallada del problema inicial (Lede periodístico) */
  problemLede: string;
  /** Restricciones de contexto, hardware o presupuesto que condicionaron el diseño */
  constraints: string;
  /** Decisiones de compromiso arquitectónico modeladas como pull-quotes */
  tradeOffs: ArchitecturalTradeOff[];
  /** Pila tecnológica completa */
  stack: string[];
  /** Métricas finales de impacto y entrega con números tabulares */
  impactMetrics: CaseStudyMetric[];
  /** Ruta al asset de imagen editorial del proyecto */
  image: string;
  /** Texto alternativo descriptivo de la imagen para lectores de pantalla */
  imageAlt: string;
}
