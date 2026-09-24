/**
 * Modelo de datos TypeScript estricto para Casos de Estudio Editoriales.
 * Especificación: specs/003-case-studies/spec.md (RF-04, RNF-03)
 * Plan: specs/003-case-studies/plan.md (§3), specs/004-identity-and-i18n/plan.md (§1, §2)
 */

import { TranslationKey } from './i18n';

export interface HeroMetric {
  /** Valor numérico o sintáctico de alto impacto (ej: "O(N) → O(1)", "100%", "0") */
  value: string;
  /** Unidad o etiqueta corta (ej: "Offline", "PDFs", "Latencia") */
  label: TranslationKey;
  /** Contexto o descripción complementaria de la métrica */
  description?: TranslationKey;
}

export interface ArchitecturalTradeOff {
  /** ID único o correlativo para renderizado de listas */
  id: string;
  /** Título o ámbito de la decisión (ej: "Infraestructura & DevOps", "Gestión de Estado") */
  area: TranslationKey;
  /** Cita editorial destacada con la estructura "Sacrificamos X para ganar Y" */
  quote: TranslationKey;
  /** Razón técnica de ingeniería detrás del compromiso */
  rationale?: TranslationKey;
}

export interface CaseStudyMetric {
  /** Etiqueta descriptiva del impacto logrado */
  label: TranslationKey;
  /** Valor o resultado alcanzado con tabular-nums */
  value: string;
}

export interface CaseStudy {
  /** Identificador técnico único para claves de React y referencias DOM (ej: "smartforge") */
  id: string;
  /** Identificador editorial tipo prensa (ej: "REP-2024.01") */
  editorialId: string;
  /** Categoría temática en mayúsculas (ej: "FULL-STACK · PWA") */
  category: TranslationKey;
  /** Titular principal inmutable del proyecto (nombre propio técnico) */
  headline: string;
  /** Bajada o subtitular periodístico explicativo */
  subheadline: TranslationKey;
  /** Métrica héroe visible tanto en tarjeta como en cabecera del artículo */
  heroMetric: HeroMetric;
  /** Extracto condensado para la tarjeta de portada (1-2 oraciones) */
  excerpt: TranslationKey;
  /** Narrativa detallada del problema inicial (Lede periodístico) */
  problemLede: TranslationKey;
  /** Restricciones de contexto, hardware o presupuesto que condicionaron el diseño */
  constraints: TranslationKey;
  /** Decisiones de compromiso arquitectónico modeladas como pull-quotes */
  tradeOffs: ArchitecturalTradeOff[];
  /** Pila tecnológica completa (términos universales inmutables) */
  stack: string[];
  /** Métricas finales de impacto y entrega con números tabulares */
  impactMetrics: CaseStudyMetric[];
  /** Ruta al asset de imagen editorial del proyecto */
  image: string;
  /** Texto alternativo descriptivo de la imagen para lectores de pantalla */
  imageAlt: TranslationKey;
}
