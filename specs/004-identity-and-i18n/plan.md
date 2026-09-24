# PLAN-004: Identidad, Contenido Real e Internacionalización (i18n)

**Spec:** [specs/004-identity-and-i18n/spec.md](./spec.md)  
**Estado:** Propuesto (Pendiente de Aprobación)  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 1, 2, 3, 4, 5, 6  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 1, 2, 3, 4, 5  

---

## 0. Resumen Ejecutivo y Resoluciones de Arquitectura

Este plan técnico desglosa la implementación de la **Fase 4: Identidad, Contenido Real e Internacionalización (i18n)**. Aborda la erradicación total de marcadores de posición (*placeholders*) para integrar los datos profesionales reales de **Marco Nicolas Barzola** y su fotografía de perfil, desplegando simultáneamente un motor de internacionalización ligero (bilingüe Español/Inglés) con cero librerías externas.

### Resoluciones a los hallazgos de auditoría (QA & Tech Lead):
1. **Diccionarios Planos y Tipados:** Estructura de diccionario plana y fuertemente tipada (`es.ts` y `en.ts`). `src/data/caseStudies.ts` mantendrá la taxonomía estructural y claves de traducción, mientras que la narrativa extensa se resolverá mediante `useTranslation(key)`. Soporte de interpolación ligera con regex para tokens (ej. `{year}`). Memorización del valor del contexto con `useMemo`. *(Resuelve QA #1, #2, #3, #4)*.
2. **Accesibilidad Semántica de Controles:** El selector de idioma utilizará botones explícitos donde el idioma activo lleva `aria-current="true"` y el inactivo es el elemento interactivo. El selector compacto de `NewspaperNav` se marcará con `aria-hidden="true"` para evitar duplicidad y ruido en lectores de pantalla, dejando el del *Masthead* como el control principal. *(Resuelve QA #5, #6)*.
3. **Sincronización Pre-Paint del DOM:** Uso de `useLayoutEffect` en el `I18nProvider` para mutar `<html lang>` y `<title>` antes de que el navegador pinte el fotograma, erradicando el parpadeo de accesibilidad. *(Resuelve QA #7)*.
4. **Optimización de Fotografía (LCP, CLS y Tactil):** Contenedor de imagen con dimensiones y `aspect-ratio` explícitos, `loading="eager"`, `fetchpriority="high"`, y aislamiento de interacciones táctiles con `@media (hover: hover)` para evitar el *sticky hover*. Fallback CSS con tramado halftone ante contingencias de red. *(Resuelve QA #8, #9, #10)*.
5. **Cumplimiento Estricto del Principio 3 (Animaciones GPU a 60 FPS):** Prohibición absoluta de animar `filter`. Se implementará una composición de dos capas: capa base monocromo fija y capa superior con calidez vintage, cuya animación en `:hover` / `:focus-within` operará exclusivamente mutando `opacity: 0 → 1`. *(Resuelve QA #11)*.
6. **Cumplimiento Estricto del Principio 4 (Contraste Muted ≥ 4.5:1):** Ajuste del token de contraste para textos en itálica y pie de foto (`text-ink-muted`) para asegurar matemáticamente ratio ≥ 4.5:1 sobre `paper-base` y `paper-card`. *(Resuelve QA #12)*.

---

## 1. Inventario del Código Base y Archivos a Intervenir

```
src/
├── types/
│   ├── i18n.ts                  ← CREAR: Tipos del motor i18n, idiomas soportados y esquema de claves
│   └── caseStudy.ts             ← MODIFICAR: Adaptar campos narrativos para utilizar claves de traducción
├── data/
│   ├── locales/
│   │   ├── es.ts                ← CREAR: Diccionario maestro en Español (fuente única de tipos)
│   │   └── en.ts                ← CREAR: Diccionario en Inglés (validado estrictamente contra es.ts)
│   └── caseStudies.ts           ← MODIFICAR: Estructura de proyectos vinculada a claves de traducción
├── context/
│   └── I18nContext.tsx          ← CREAR: Contexto React puro, Provider con useLayoutEffect y useMemo
├── hooks/
│   └── useTranslation.ts        ← CREAR: Hook consumidor tipado con interpolación de tokens básica
├── assets/
│   └── marco-barzola-profile.webp ← EXISTENTE: Fotografía real de Marco Barzola
├── components/
│   ├── FrontPage.tsx            ← MODIFICAR: Reemplazo por datos reales, doble capa de imagen GPU y textos i18n
│   ├── NewspaperMasthead.tsx    ← MODIFICAR: Integración del selector de idioma principal accesible
│   ├── NewspaperNav.tsx         ← MODIFICAR: Integración del selector compacto complementario (aria-hidden)
│   ├── ClassifiedsSection.tsx   ← MODIFICAR: Datos reales de contacto (Villa Mercedes, UNVIME, GitHub, etc.)
│   ├── ProjectsSection.tsx      ← MODIFICAR: Consumo de textos internacionalizados
│   ├── ArticleOverlay.tsx       ← MODIFICAR: Consumo de textos traducidos en el reportaje modal
│   └── TechStackSection.tsx     ← MODIFICAR: Consumo de textos internacionalizados en taxonomía técnica
test/
├── i18n/
│   ├── i18nContext.test.tsx     ← CREAR: Tests de ciclo de vida, persistencia localStorage y fallback a 'es'
│   └── useTranslation.test.ts   ← CREAR: Tests de resolución de claves e interpolación de tokens
├── components/
│   ├── LanguageToggle.test.tsx  ← CREAR: Tests de accesibilidad de controles (aria-current, teclado, foco)
│   ├── FrontPage.test.tsx       ← MODIFICAR: Verificación de presencia de datos reales y atributos de imagen
│   └── ClassifiedsSection.test.tsx ← MODIFICAR: Verificación de enlaces reales y erradicación de placeholders
```

---

## 2. Arquitectura de Internacionalización Ligera (Zero Dependencies)

### 2.1 Modelo de Tipos y Contrato del Diccionario (`src/types/i18n.ts`)

```typescript
// Requisitos Cubiertos: RF-03, QA #1, QA #2

export type SupportedLanguage = 'es' | 'en';

export interface TranslationParams {
  [token: string]: string | number;
}

// Inferencia estricta: El diccionario en español define el contrato de claves maestras
export type TranslationDictionary = typeof import('@/data/locales/es').es;
export type TranslationKey = keyof TranslationDictionary;

export interface I18nContextState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}
```

### 2.2 Diccionarios Planos Estructurados (`src/data/locales/es.ts` y `en.ts`)
Se utiliza una estructura plana de claves con convención de nombres por ámbito (`seccion_campo`), garantizando:
- Autocompletado inmediato y verificación en compilación (`tsc --noEmit`).
- Eliminación de sobrecarga por parsing de objetos anidados o recursividad en tiempo de ejecución.
- Paridad total entre idiomas: `en.ts` se declara como tipo `TranslationDictionary`, produciendo un error estricto de compilación si falta alguna traducción.

```typescript
// src/data/locales/es.ts
export const es = {
  // Metadatos y Masthead
  'masthead.tagline': 'EL PERIÓDICO INDEPENDIENTE DE INGENIERÍA DE SISTEMAS',
  'masthead.edition': 'Edición Especial de Ingeniería',
  'masthead.location': 'Villa Mercedes, San Luis, Argentina',
  'masthead.langToggleAria': 'Idioma actual: Español. Cambiar a Inglés',

  // Portada - Identidad
  'frontpage.badge': 'ÚLTIMA HORA',
  'frontpage.headline': 'MARCO NICOLAS BARZOLA',
  'frontpage.subheadline': 'Full-Stack Developer & Estudiante de Ingeniería en Sistemas (UNVIME)',
  'frontpage.dropcap': 'Especializado en la arquitectura de sistemas distribuidos, automatización de flujos críticos y el diseño de interfaces de alto rendimiento. Con base académica en la Universidad Nacional de Villa Mercedes (UNVIME), su enfoque combina el rigor de la ingeniería tradicional con las tecnologías más demandadas del ecosistema moderno.',
  'frontpage.bioSecond': 'Desde la containerización de microservicios con Docker hasta el desarrollo frontend pixel-perfect con React y TypeScript, cada proyecto refleja el compromiso de convertir requerimientos complejos en arquitecturas escalables, resilientes y orientadas a resultados.',
  'frontpage.photoCaption': 'Marco Barzola — Desarrollador Full-Stack',
  'frontpage.photoAlt': 'Fotografía editorial de Marco Nicolas Barzola, Desarrollador Full-Stack',

  // Tarjetas secundarias de portada
  'frontpage.card1.kicker': 'ENFOQUE',
  'frontpage.card1.title': 'Arquitectura & Sistemas',
  'frontpage.card1.desc': 'Diseño estructurado desde el modelo relacional hasta el cliente, priorizando disponibilidad y eficiencia.',
  'frontpage.card2.kicker': 'STACK',
  'frontpage.card2.title': 'Full-Stack & Cloud Ready',
  'frontpage.card2.desc': 'Dominio en TypeScript, React, Node.js, PostgreSQL y orquestación con Docker.',
  'frontpage.card3.kicker': 'FILOSOFÍA',
  'frontpage.card3.title': 'Automatización & Calidad',
  'frontpage.card3.desc': 'Desarrollo guiado por pruebas, pipelines CI/CD y erradicación de tareas repetitivas mediante código.',

  // Clasificados
  'classifieds.kicker': 'CLASIFICADOS',
  'classifieds.title': 'INFORMACIÓN DE CONTACTO',
  'classifieds.subtitle': 'Oportunidades Profesionales & Consultoría Técnica',
  'classifieds.aboutTitle': 'Sobre el Ingeniero',
  'classifieds.aboutBio': 'Desarrollador Full-Stack y estudiante avanzado de Ingeniería en Sistemas de Información en la Universidad Nacional de Villa Mercedes (UNVIME). Especializado en arquitectura de software, bases de datos relacionales, optimización de rendimiento y soluciones asistidas por IA.',
  'classifieds.location': 'Villa Mercedes, San Luis, Argentina',
  'classifieds.availability': 'Disponible para trabajo Remoto / Híbrido',
  'classifieds.contactBoxTitle': '★ Contacto Directo ★',
  'classifieds.contactBoxSubtitle': 'Hablemos de ingeniería y sistemas',
  'classifieds.downloadCv': 'Descargar Currículum Vitae',
  'classifieds.footerCopy': '© {year} Marco Nicolas Barzola · Construido con React, TypeScript y Estética Editorial',
  'classifieds.footerQuote': '"El código limpio es poesía estructurada; la arquitectura es arte funcional."',
  
  // Document Title & Lang
  'doc.title': 'The Minty Gazette — Marco Nicolas Barzola | Software Engineer',
  
  // Claves de Casos de Estudio (narrativa)
  'project.smartforge.lede': 'Un entrenador altamente cualificado gestionaba la periodización y auditoría de fatiga articular de sus clientes mediante hojas de cálculo estáticas en Excel. El cálculo dinámico de múltiples variables...',
  'project.fitplan.lede': 'Un entrenador necesitaba un sistema local (CRM) combinado con una taxonomía de ejercicios compleja...',
  'project.menu.lede': 'Un restaurante de gastronomía venezolana operaba con menús en formato PDF estático...',
  // ... resto de claves narrativas (restricciones, trade-offs)
} as const;
```

### 2.3 Provider y Hook de Consumo (`src/context/I18nContext.tsx` y `useTranslation.ts`)

- **Persistencia Segura:** Clave `the-minty-gazette-lang`. Lectura protegida con `try/catch` para mitigar fallos en modos privados.
- **Sincronización DOM Pre-Paint:** `useLayoutEffect` sincroniza `document.documentElement.lang` y `document.title` antes del pintado del frame, erradicando parpadeos de accesibilidad *(QA #7)*.
- **Interpolación Eficiente:** Regex `/\{(\w+)\}/g` sin dependencias externas.
- **Memoización del Contexto:** `useMemo` sobre el objeto `{ language, setLanguage, t }` para blindar la aplicación contra re-renderizados innecesarios *(QA #4)*.

---

## 3. Tratamiento Editorial de la Fotografía de Perfil (LCP, GPU & Estética)

### 3.1 Doble Capa GPU: Erradicación de `filter` Animado *(Principio 3, QA #11)*
Para respetar el mandato innegociable de 60 FPS y cero repintados de CPU:
1. **Contenedor:** Con dimensiones explícitas, `overflow: hidden`, y marco vintage con trama de semitono (*halftone*).
2. **Capa 1 (Base - Monocromo Tinta de Periódico):** Elemento `<img>` renderizado con clases de filtro fijas (`grayscale contrast-125`). Esta capa es estática y no se anima jamás.
3. **Capa 2 (Superpuesta - Calidez Vintage):** Elemento superpuesto idéntico (o pseudo-elemento/segunda imagen con `aria-hidden="true"`) renderizado con filtro de calidez analógica suave (`sepia-50 contrast-110`). Su propiedad `opacity` inicial es `0`.
4. **Comportamiento en Hover / Focus:** La transición muta **únicamente `opacity: 0 → 1`** en `300ms cubic-bezier(0.4, 0, 0.2, 1)`. La mutación se ejecuta al 100% en el compositor GPU sin repintado de layout ni cálculos en el hilo principal.

### 3.2 Aislamiento Táctil y Prevención de *Sticky Hover* *(QA #8)*
La transición de opacidad se encapsula dentro de la directiva `@media (hover: hover)`:
- En computadoras de escritorio con ratón: se activa la revelación vintage al hacer `:hover` o `:focus-within`.
- En dispositivos táctiles (móviles/tablets): la imagen permanece estable en su modo monocromo editorial de tinta impresa, eliminando la persistencia accidental del estado activo al desplazarse verticalmente.

### 3.3 Optimización Web Vitals (LCP & CLS) y Fallback CSS *(QA #9, QA #10)*
- **LCP:** La imagen incluye atributos nativos de alta prioridad: `loading="eager"` y `fetchpriority="high"`.
- **CLS:** El contenedor padre define proporciones rígidas mediante clase `aspect-[4/5]` o dimensiones fijas en `rem`, reservando el espacio antes de que comience la descarga del archivo `.webp`.
- **Fallback CSS (Resistencia a Contingencias de Red):** El contenedor de la fotografía incorpora un fondo tipográfico de prensa editorial con textura rayada en CSS puro (`repeating-linear-gradient` simulando columnas de periódico) y la silueta del monograma editorial "MB". Si la imagen no descarga, el usuario observa un marco estructurado de periódico tradicional con su pie de foto intacto en lugar de un hueco roto.

### 3.4 Garantía Matemática de Contraste en Textos Muted *(Principio 4, QA #12)*
El pie de foto y textos secundarios se asociarán a una clase tipográfica que garantice un ratio de contraste ≥ 4.5:1 contra los fondos `paper-base` y `paper-card`:
- En *Morning Edition*: color con luminancia controlada (ej. `oklch(0.38 0.02 60)` con ratio ≥ 5.2:1).
- En *Evening Edition*: color con luminancia controlada (ej. `oklch(0.78 0.02 60)` con ratio ≥ 5.1:1).

---

## 4. Accesibilidad (WCAG 2.1 AA) y Patrón de Controles de Idioma

### 4.1 Selector de Idioma Principal en Masthead (`NewspaperMasthead.tsx`)
- **Estructura Semántica:** Par de botones contiguos dentro de una lista ordenada o contenedor con rol descriptivo.
- **Idioma Activo:** Botón con `aria-current="true"`, clase de estilo activo (borde editorial y fondo acentuado). Al estar ya activo, no dispara acción redundante.
- **Idioma Inactivo:** Botón interactivo accionable, accesible por teclado (`Tab`, `Enter`, `Space`), con `aria-label` descriptivo en el idioma de destino (ej: *"Cambiar idioma a Inglés"*).
- **Anillo de Foco:** Indicador visible `focus-visible:ring-2` con contraste ≥ 3:1 respecto al papel.

### 4.2 Selector Secundario Compacto en Barra de Navegación (`NewspaperNav.tsx`)
- **Aislamiento de Accesibilidad:** El control secundario compacto se marca explícitamente con `aria-hidden="true"` y `tabIndex={-1}`.  
  *Justificación de Accesibilidad:* Evita que un usuario de lector de pantalla o teclado deba recorrer dos controles idénticos dentro de la misma región superior de la página, centralizando la interacción auditiva en el *Masthead* *(QA #6)*.

---

## 5. Matriz de Trazabilidad: Requisitos vs. Arquitectura

| Requisito / QA Item | Componente / Módulo Afectado | Decisión Técnica Aplicada | Criterio de Verificación |
|---|---|---|---|
| **RF-01** (Datos Reales) | `FrontPage.tsx`, `ClassifiedsSection.tsx` | Inyección de datos reales de Marco Barzola desde diccionarios. | Cero cadenas `hello@portfolio.dev`, presencia de UNVIME, Villa Mercedes, GitHub real. |
| **RF-02 / QA #11** (Fotografía GPU) | `FrontPage.tsx`, `index.css` | Doble capa estática con transición de `opacity: 0 → 1`. Prohibido animar `filter`. | Inspección en DevTools: 60 FPS estables, cero eventos `Paint` durante hover. |
| **RF-03 / QA #1-#4** (Motor i18n) | `I18nContext.tsx`, `useTranslation.ts` | Contexto React nativo + diccionarios planos tipados + `useMemo`. Cero dependencias externas. | Bundle size intacto, `tsc --noEmit` valida paridad de claves al 100%. |
| **RF-04** (Cobertura 100%) | Todas las vistas y overlays | 100% de prosa y `aria-labels` internacionalizados. Nombres propios de proyectos y tecnologías universales preservados. | Alternancia completa sin textos residuales. |
| **RF-05 / QA #5** (Selector & Persistencia) | `NewspaperMasthead.tsx`, `NewspaperNav.tsx` | Botones explícitos con `aria-current="true"` y persistencia en `localStorage` con fallback `'es'`. | Persistencia verificada al recargar página. |
| **RA-01 / QA #7** (Sincronización DOM) | `I18nContext.tsx` | `useLayoutEffect` sincroniza `<html lang>` y `<title>` pre-paint. | Inspección de `document.documentElement.lang` en tiempo real. |
| **RA-02 / QA #6** (Semántica ARIA) | `NewspaperNav.tsx` | Selector compacto secundario con `aria-hidden="true"`. | Auditoría de lectores de pantalla sin duplicidad en árbol de accesibilidad. |
| **QA #8** (Aislamiento Táctil) | `index.css` | Media query `@media (hover: hover)` en revelación de foto. | Cero efecto "sticky hover" en simulación móvil. |
| **QA #9, #10** (LCP / CLS) | `FrontPage.tsx` | `loading="eager"`, `fetchpriority="high"`, `aspect-ratio` rígido y fallback CSS halftone. | CLS = 0 en Lighthouse, LCP optimizado. |
| **QA #12** (Contraste Muted) | `FrontPage.tsx`, `index.css` | Token de contraste calibrado para textos en itálica y pie de foto. | Verificación de contraste con `axe-core` ≥ 4.5:1. |

---

## 6. Estrategia de Pruebas Automatizadas

### 6.1 Pruebas Unitarias del Motor i18n (`test/i18n/`)
- **`i18nContext.test.tsx`:**
  - Inicialización con `localStorage` vacío (debe iniciar en `'es'`).
  - Inicialización con `localStorage` conteniendo `'en'` (debe iniciar en `'en'`).
  - Manejo de excepciones si `localStorage.getItem` o `setItem` arrojan error (modo incógnito estricto).
  - Mutación correcta del atributo `document.documentElement.lang` al alternar idioma.
- **`useTranslation.test.ts`:**
  - Retorno de cadenas traducidas según clave.
  - Interpolación de tokens con sintaxis `{token}` (ej: sustitución de `{year}`).
  - Fallback ante claves inexistentes (retorno de la clave sin crashear la aplicación).

### 6.2 Pruebas de Componentes y Accesibilidad (`test/components/`)
- **`LanguageToggle.test.tsx`:**
  - Presencia del atributo `aria-current="true"` en el botón del idioma seleccionado.
  - Activación accesible por teclado (`Enter` y `Space`).
  - Verificación de que el control de `NewspaperNav` posee `aria-hidden="true"`.
  - Auditoría automatizada con `axe-core` arrojando 0 violaciones.
- **`FrontPage.test.tsx`:**
  - Renderizado de la fotografía con `marco-barzola-profile.webp`, `loading="eager"` y `fetchpriority="high"`.
  - Verificación de que el pie de foto coincide con el idioma activo.
  - Presencia del titular real "MARCO NICOLAS BARZOLA" y mención académica de la UNVIME.
- **`ClassifiedsSection.test.tsx`:**
  - Ausencia de datos ficticios (`hello@portfolio.dev`, `San Francisco, CA`).
  - Verificación de enlaces a GitHub (`MarcoBarzola22`) y LinkedIn de Marco con `rel="noopener noreferrer"`.
