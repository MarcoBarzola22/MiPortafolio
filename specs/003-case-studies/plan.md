# PLAN-003: Casos de Estudio — Reportajes Editoriales con Datos Reales

**Spec:** [specs/003-case-studies/spec.md](./spec.md)  
**Estado:** Propuesto (Pendiente de Aprobación)  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 1, 2, 3, 4, 5, 6  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 2, 3, 4, 5

---

## 0. Resumen Ejecutivo

Este plan descompone la especificación **SPEC-003** en cinco bloques de ejecución técnica secuenciales y estrictamente atómicos. El objetivo es reemplazar el contenido ficticio de `ProjectsSection` por tres reportajes editoriales basados en proyectos reales (SmartForge, FitPlan Desktop, Interactive Digital Menu), respetando los tokens de color OKLCH y la escala tipográfica de la Fase 2, e implementando un overlay modal de lectura a pantalla completa con navegación por teclado accesible (WCAG 2.1 AA) y animaciones fluidas a 60 FPS gobernadas por el compositor GPU.

---

## 1. Inventario del Código Base y Archivos a Intervenir

```
src/
├── types/
│   └── caseStudy.ts             ← CREAR: Interfaz TypeScript estricta para proyectos y casos de estudio
├── data/
│   └── caseStudies.ts           ← CREAR: Datos reales de los 3 proyectos (fuente única de verdad)
├── hooks/
│   ├── useFocusTrap.ts          ← CREAR: Hook custom para contención y restauración del foco en diálogos modales
│   └── useScrollLock.ts         ← CREAR: Hook para bloqueo robusto del scroll de fondo (cross-browser / iOS)
├── components/
│   ├── ProjectCard.tsx          ← CREAR: Componente modular de tarjeta de portada (extraído de ProjectsSection)
│   ├── ArticleOverlay.tsx       ← CREAR: Componente de reportaje editorial a pantalla completa
│   └── ProjectsSection.tsx      ← MODIFICAR: Orquestador que consume los datos y gestiona el estado del overlay
test/
└── components/
    ├── ArticleOverlay.test.tsx  ← CREAR: Tests de accesibilidad (axe-core), focus trap y ciclo de vida
    └── ProjectCard.test.tsx     ← CREAR: Tests de activación accesible (click/Enter/Space)
```

---

## 2. Estructura y Jerarquía de Componentes de React

### 2.1 Diagrama de Componentes y Flujo de Datos

```
[ App.tsx ] (Página principal / Scroll o navegación de páginas)
     │
     ▼
[ ProjectsSection.tsx ] (Contenedor de sección editorial)
  │  State: selectedProject: CaseStudy | null
  │  Data: caseStudies[] (importado de src/data/caseStudies.ts)
  │
  ├──► Grid Header ("THE DAILY REPORTS", Vol. III, etc.)
  │
  ├──► Grid de Tarjetas (div.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3)
  │     │
  │     ├──► [ ProjectCard.tsx ] (para caseStudies[0])
  │     │      Props: { project, onSelect, isSelected }
  │     │
  │     ├──► [ ProjectCard.tsx ] (para caseStudies[1])
  │     │
  │     └──► [ ProjectCard.tsx ] (para caseStudies[2])
  │
  └──► AnimatePresence
        │
        └──► [ ArticleOverlay.tsx ] (condicional: selectedProject !== null)
               Props: { project: CaseStudy, onClose: () => void }
               Internal Hooks: useFocusTrap, useScrollLock
```

### 2.2 Separación Lógica de Responsabilidades

| Componente | Rol y Responsabilidad | Requisitos Cubiertos |
|---|---|---|
| **`ProjectsSection.tsx`** | Orquestador de la sección. Importa `caseStudies`, mantiene el estado `selectedProject` (`useState<CaseStudy \| null>`), expone callbacks `onSelect` y `onClose`, y gestiona el renderizado de la cabecera editorial y el grid. No contiene estilos internos de artículos ni lógica de foco. | **RF-01, RF-05** |
| **`ProjectCard.tsx`** | Componente presentacional e interactivo de portada. Renderiza el gancho editorial de un proyecto: ID editorial (`REP-2024.XX`), métrica héroe destacada, categoría, titular Playfair Display, subtitular en itálica, extracto resumido y tags del stack. Implementa el patrón accesible de activación por click, `Enter` y `Space`. | **RF-01, RA-05, RNF-02, RNF-03** |
| **`ArticleOverlay.tsx`** | Componente modal a pantalla completa (o casi completa) con estética de página interior de periódico. Orquesta la animación GPU vía Framer Motion, bloquea el scroll de fondo (`useScrollLock`), atrapa el foco del teclado (`useFocusTrap`), escucha la tecla `Escape`, y maqueta los 6 bloques del reportaje (Cabecera, Lede, Restricciones, Pull-quotes de Trade-offs, Stack, Métricas finales). | **RF-02, RF-03, RA-01, RA-02, RA-03, RA-04, RNF-01, RNF-02, RNF-03** |

---

## 3. Modelo de Datos TypeScript (`CaseStudy`)

El modelo se aloja en `src/types/caseStudy.ts` y desacopla por completo el contenido de la capa de renderizado.

```typescript
// Requisitos Cubiertos: RF-01, RF-04, RNF-03, Principio 5

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
```

---

## 4. Decisiones Técnicas Justificadas

### DT-01: Animación de Entrada y Salida a 60 FPS con Framer Motion
- **Contexto:** RF-03, RNF-01, Principio 3 de la Constitución.
- **Herramienta:** `framer-motion` (ya presente en `package.json` v13.4.3).
- **Justificación:** 
  1. `framer-motion` permite transiciones de desmontaje declarativas mediante `<AnimatePresence>` sin introducir dependencias adicionales.
  2. Las animaciones se restringen rígidamente a `transform` y `opacity` (`translateY` y `opacity`), las cuales se procesan en el compositor de la GPU sin recalcular layout ni repintado del hilo principal.
  3. Reutilizamos la misma curva cúbica de aceleración editorial definida para la Fase 2 (`ease: [0.16, 1, 0.3, 1]`).
- **Respeto a Preferencias del Usuario:** Se aplica la variante `prefers-reduced-motion`: si el usuario tiene activada la reducción de movimiento, la animación conmuta a un desvanecimiento instantáneo (`duration: 0.01s`).

```typescript
export const overlayAnimationVariants = {
  initial: { opacity: 0, y: "30px", scale: 0.99 },
  animate: {
    opacity: 1,
    y: "0px",
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: "20px",
    scale: 0.99,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  }
};
```

---

### DT-02: Gestión de Estado Local y Ciclo de Vida del Overlay con `useState`
- **Contexto:** RF-05, RA-01.
- **Herramienta:** `useState<CaseStudy | null>(null)` en `ProjectsSection.tsx`.
- **Justificación:**
  1. No se requiere enrutador. En la Fase 1 se purgó `react-router-dom` para mantener el bundle ligero y autónomo (Principio 1 y 6).
  2. El estado es estrictamente binario y unívoco: o hay un proyecto seleccionado (`CaseStudy`), o no lo hay (`null`).
  3. Previene cualquier posibilidad de estados inconsistentes o múltiples overlays abiertos simultáneamente.

---

### DT-03: Implementación de Focus Trap Nativo / Custom sin Librerías Externas
- **Contexto:** RA-02, RA-03, Principio 1 (Cero dependencias innecesarias), Principio 4 (WCAG AA).
- **Herramienta:** Hook propio `useFocusTrap(isActive: boolean, triggerRef: RefObject<HTMLElement>)`.
- **Justificación:**
  1. Librerías como `focus-trap-react` introducen dependencias redundantes para una tarea que en React 19 y DOM moderno se resuelve en ~45 líneas con `keydown` listener y consulta de selectores enfocables estándar (`a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])`).
  2. **Ciclo de captura:**
     - Al abrirse el overlay, busca todos los elementos interactivos dentro del contenedor referenciado.
     - Enfoca inmediatamente el botón de cierre (o el primer elemento interactivo).
     - Si el usuario presiona `Tab` en el último elemento, el foco cicla al primero.
     - Si el usuario presiona `Shift + Tab` en el primer elemento, el foco cicla al último.
  3. **Restauración de foco:** Guarda una referencia al elemento disparador (`triggerRef` de la tarjeta que activó el modal) y, al desmontarse el overlay, devuelve el foco exactamente a dicho elemento.
  4. **Escape listener:** Si se presiona la tecla `Escape`, invoca `onClose()` de forma limpia e inmediata.

---

### DT-04: Bloqueo Robusto de Scroll del Body (`useScrollLock`)
- **Contexto:** Decisión de Alcance 5, RNF-01.
- **Herramienta:** Hook propio `useScrollLock(isLocked: boolean)`.
- **Justificación:**
  1. Un simple `document.body.style.overflow = 'hidden'` falla en iOS Safari (donde el rubber-banding ignora el overflow hidden) y genera un molesto salto de ancho de página (layout shift) al desaparecer la barra de desplazamiento en navegadores de escritorio Windows/Linux.
  2. **Estrategia técnica implementada:**
     - Calcular el ancho de la barra de desplazamiento: `window.innerWidth - document.documentElement.clientWidth`.
     - Aplicar `paddingRight` compensatorio a `document.body` igual a dicho ancho para mantener el layout inmóvil.
     - Fijar `overflow: hidden` en `document.documentElement` y `document.body`.
     - Guardar la posición de scroll previa (`window.scrollY`) para restaurarla fielmente al cerrar.

---

### DT-05: Patrón de Tarjeta Accesible: `<article>` con Botón de Superposición Transparente
- **Contexto:** RF-01, RA-05.
- **Herramienta:** Semántica HTML `<article>` que contiene un `<button>` de acción expandida vía CSS (`absolute inset-0`).
- **Justificación:**
  1. Anidar enlaces, etiquetas y titulares interactivos dentro de un único `<button>` crea un árbol de accesibilidad inválido o confuso para lectores de pantalla.
  2. Al utilizar un contenedor `<article>` relativo con un botón interactivo posicionado absolutamente sobre la tarjeta (`aria-label={`Leer reportaje completo: ${project.headline}`}`), se preserva la semántica de documento de periódico y se garantiza que `Enter`, `Space` y el click abran el caso de estudio sin hackeos de eventos.

---

### DT-06: Maquetación Editorial Multi-Columna con CSS Grid y Named Areas
- **Contexto:** RF-02, RNF-02, RNF-03, Principio 2 (Estética Editorial).
- **Herramienta:** Tailwind CSS con clases semánticas y CSS Grid.
- **Justificación:**
  1. Usar la propiedad CSS `columns-3` (multi-column) provoca que los bloques de trade-offs o pull-quotes se partan visualmente entre columnas de forma antiestética e impredecible.
  2. Se emplea **CSS Grid** en desktop (`grid-cols-12 gap-8`):
     - **Columna izquierda (cols 1-8):** Cabecera principal, Lede, Restricciones y Pull-quotes de Trade-offs con borde `border-l-4 border-mint-base`.
     - **Columna derecha (cols 9-12):** Ficha técnica lateral (Sidebar de Prensa) con ID editorial, Métrica Héroe destacada, lista de tecnologías del Stack, y tabla de Métricas de Impacto con `tabular-nums lining-nums font-mono`.
  3. En móvil (`< 1024px`), el layout colapsa a una única columna vertical con divisores editoriales `border-b border-rule-light`.

---

## 5. Bloques Secuenciales de Ejecución

### Bloque 1: Modelo de Datos e Infraestructura de Casos de Estudio
- **Requisitos cubiertos:** RF-04, Principio 5 de la Constitución.
- **Acciones:**
  1. Crear `src/types/caseStudy.ts` con las interfaces estrictas `CaseStudy`, `HeroMetric`, `ArchitecturalTradeOff`, `CaseStudyMetric`.
  2. Crear `src/data/caseStudies.ts` e instanciar los 3 proyectos con el contenido exacto redactado en la Sección 3 de la especificación:
     - SmartForge (`REP-2024.01`)
     - FitPlan Desktop (`REP-2024.02`)
     - Interactive Digital Menu (`REP-2024.03`)
  3. Exportar `caseStudies: CaseStudy[]`.
  4. Validar compilación de tipos (`tsc --noEmit`).

---

### Bloque 2: Hooks de Accesibilidad e Interacción
- **Requisitos cubiertos:** RA-01, RA-02, RA-03, Decisión de Alcance 5.
- **Acciones:**
  1. Crear `src/hooks/useFocusTrap.ts`:
     - Parámetros: `containerRef: RefObject<HTMLElement | null>`, `isActive: boolean`, `triggerRef?: RefObject<HTMLElement | null>`.
     - Gestión del listener de teclado `Tab`, `Shift+Tab` y `Escape`.
     - Guardado y restauración del foco en el elemento activo disparador.
  2. Crear `src/hooks/useScrollLock.ts`:
     - Bloqueo de scroll con compensación de scrollbar width.
     - Limpieza rigurosa en el efecto de desmontaje.
  3. Escribir tests unitarios para ambos hooks.

---

### Bloque 3: Refactorización de `ProjectCard.tsx` y Tarjetas de Portada
- **Requisitos cubiertos:** RF-01, RA-05, RNF-02, RNF-03.
- **Acciones:**
  1. Extraer la lógica de tarjeta actual hacia `src/components/ProjectCard.tsx`.
  2. Adaptar `ProjectCard` para consumir la interfaz `CaseStudy`.
  3. Implementar estructura semántica:
     - ID editorial con `font-mono tabular-nums`.
     - Métrica héroe visual con `font-mono` y color `mint-base`.
     - Categoría con tracking ancho en `text-ink-muted`.
     - Titular con `font-headline` (Playfair Display).
     - Subtitular en cursiva `font-body italic`.
     - Extracto breve del problema.
     - Pills del stack con tokens `paper-muted` e `ink-body`.
     - Botón transparente accesible de click total (`aria-label`, `onKeyDown` para `Enter`/`Space`).

---

### Bloque 4: Construcción del `ArticleOverlay.tsx` Editorial
- **Requisitos cubiertos:** RF-02, RF-03, RA-01, RA-02, RA-03, RA-04, RNF-01, RNF-02, RNF-03.
- **Acciones:**
  1. Crear `src/components/ArticleOverlay.tsx` utilizando `framer-motion`:
     - Contenedor con `role="dialog"`, `aria-modal="true"`, `aria-labelledby={`article-title-${project.id}`}`.
     - Backdrop con `bg-paper-base/90 backdrop-blur-sm`.
     - Caja del artículo con bordes de periódico, `bg-paper-base`, `text-ink-body`.
     - Botón visible y accesible de cierre: `aria-label="Cerrar reportaje y volver a portada"` con icono X (Lucide) y texto "RETURN TO FRONT PAGE".
  2. Maquetar los 6 bloques editoriales:
     - **Cabecera:** Masthead interno del artículo, fecha, ID editorial, titular display, subtitular.
     - **Lede / Problema:** Párrafo inicial de gran calibre tipográfico (`text-body-lg font-body leading-relaxed`).
     - **Restricciones:** Bloque demarcado con línea divisoria `rule-light`.
     - **Trade-offs (Pull-quotes):** Elementos destacados con comillas tipográficas, tipografía ampliada, `border-l-4 border-mint-base bg-paper-muted/30 p-6 my-6`.
     - **Columna Lateral / Ficha Técnica:** Stack estructurado y bloque de Métricas de Impacto con `tabular-nums lining-nums font-mono`.
  3. Conectar `useFocusTrap` y `useScrollLock` dentro de `ArticleOverlay`.

---

### Bloque 5: Integración en `ProjectsSection.tsx`, Testing y Validación
- **Requisitos cubiertos:** RF-05, RA-01 a RA-05, RNF-01 a RNF-03, Principios 4 y 6.
- **Acciones:**
  1. Modificar `src/components/ProjectsSection.tsx`:
     - Reemplazar el array hardcodeado local por el `caseStudies` importado.
     - Añadir estado `selectedProject` con `useState<CaseStudy | null>(null)`.
     - Renderizar el grid dinámico de `ProjectCard`.
     - Envolver `ArticleOverlay` en `<AnimatePresence>` de Framer Motion.
     - Marcar el contenedor de las tarjetas con `inert={selectedProject !== null}` o `aria-hidden={selectedProject !== null}` para garantizar accesibilidad total de landmarks.
  2. Implementar suite de tests en `test/components/ArticleOverlay.test.tsx` y `test/components/ProjectCard.test.tsx`.
  3. Ejecutar suite de validación completa:
     - `npx vitest run` (0 errores).
     - `npx tsc --noEmit` (0 errores).
     - `npm run build` (build estático limpio).

---

## 6. Estrategia de Testing y Validación de Accesibilidad

### 6.1 Tests Automatizados (Vitest + Testing Library + axe-core)

| Archivo de Test | Casos de Prueba Críticos | Requisitos Verificados |
|---|---|---|
| `ProjectCard.test.tsx` | - Renderiza todos los campos obligatorios del proyecto real.<br>- Contiene el ID editorial con clase tipográfica `tabular-nums`.<br>- Ejecuta el callback `onSelect` al hacer click.<br>- Ejecuta el callback `onSelect` al presionar tecla `Enter` y `Space`.<br>- Posee un `aria-label` descriptivo para tecnología de asistencia. | **RF-01, RA-05** |
| `ArticleOverlay.test.tsx` | - Posee atributos `role="dialog"`, `aria-modal="true"` y `aria-labelledby`.<br>- Enfoca automáticamente el botón de cierre al montarse.<br>- La tecla `Escape` dispara el callback `onClose`.<br>- El foco cicla de fin a inicio con `Tab`, y de inicio a fin con `Shift+Tab` (Focus Trap).<br>- Bloquea y restaura el scroll del body al montar y desmontar.<br>- Restaura el foco en el botón de la tarjeta disparadora al cerrarse.<br>- **Auditoría axe-core:** `expect(await axe(container)).toHaveNoViolations()`. | **RF-02, RA-01, RA-02, RA-03, RA-04, Principio 4** |

### 6.2 Protocolo de Verificación Manual (Checklist de Aceptación)

1. **Navegación Exclusiva por Teclado:**
   - [ ] Navegar con `Tab` hasta una tarjeta de proyecto.
   - [ ] Presionar `Enter` o `Space`: el overlay se abre inmediatamente.
   - [ ] Verificar que el foco se ubica en el botón de cierre del overlay.
   - [ ] Presionar `Tab` sucesivamente por todo el contenido del artículo: el foco no se escapa al fondo de la página.
   - [ ] Presionar `Shift + Tab` desde el primer elemento: el foco cicla al último enlace/botón del modal.
   - [ ] Presionar `Escape`: el overlay se cierra suavemente y el foco regresa a la tarjeta correspondiente.
2. **Auditoría de Rendimiento a 60 FPS:**
   - [ ] Abrir Chrome DevTools > Performance.
   - [ ] Grabar perfil de interacción al abrir y cerrar el overlay con 4x CPU Throttling.
   - [ ] Constatar que no existen "Forced Reflows" y que los frames se computan en `< 16.6ms`.
3. **Contraste de Color OKLCH (Morning y Evening Edition):**
   - [ ] Verificar con Color Picker / DevTools que los textos de los pull-quotes y métricas cumplen con ratio ≥ 4.5:1 en ambos temas.

---

## 7. Matriz de Trazabilidad de Requisitos

| Requisito Spec | Descripción Resumida | Bloque de Ejecución | Archivos Involucrados |
|---|---|---|---|
| **RF-01** | Tarjetas de portada con datos reales | Bloque 1, 3 | `src/types/caseStudy.ts`, `src/data/caseStudies.ts`, `src/components/ProjectCard.tsx` |
| **RF-02** | Overlay editorial a pantalla completa (6 bloques) | Bloque 4 | `src/components/ArticleOverlay.tsx` |
| **RF-03** | Animación GPU a 60 FPS (`transform`/`opacity`) | Bloque 4 | `src/components/ArticleOverlay.tsx` |
| **RF-04** | Arquitectura de datos desacoplada y tipada | Bloque 1 | `src/types/caseStudy.ts`, `src/data/caseStudies.ts` |
| **RF-05** | Gestión de estado local (`useState`) sin router | Bloque 5 | `src/components/ProjectsSection.tsx` |
| **RA-01** | Semántica dialog y landmarks ARIA | Bloque 4, 5 | `src/components/ArticleOverlay.tsx`, `src/components/ProjectsSection.tsx` |
| **RA-02** | Trampa de foco (Focus Trap) y ciclado | Bloque 2, 4 | `src/hooks/useFocusTrap.ts`, `src/components/ArticleOverlay.tsx` |
| **RA-03** | Cierre accesible por Escape y botón visible | Bloque 2, 4 | `src/hooks/useFocusTrap.ts`, `src/components/ArticleOverlay.tsx` |
| **RA-04** | Contraste WCAG AA en pull-quotes y métricas | Bloque 4 | `src/components/ArticleOverlay.tsx` |
| **RA-05** | Activación accesible de tarjetas (Enter/Space) | Bloque 3 | `src/components/ProjectCard.tsx` |
| **RNF-01** | Rendimiento y cero layout shifts (CLS = 0) | Bloque 4 | `src/components/ArticleOverlay.tsx`, `src/hooks/useScrollLock.ts` |
| **RNF-02** | Responsive design editorial (Grid desktop / móvil) | Bloque 3, 4 | `src/components/ProjectCard.tsx`, `src/components/ArticleOverlay.tsx` |
| **RNF-03** | Tokens OKLCH y triada tipográfica estricta | Bloque 3, 4 | `src/components/ProjectCard.tsx`, `src/components/ArticleOverlay.tsx` |

---

## 8. Gestión de Riesgos y Mitigaciones

| Riesgo Técnico Identificado | Probabilidad / Impacto | Estrategia de Mitigación |
|---|---|---|
| Salto de layout horizontal al aplicar `overflow: hidden` al body al abrir el modal | Alta / Media | El hook `useScrollLock` mide dinámicamente `window.innerWidth - clientWidth` e inyecta el `paddingRight` compensatorio exacto al `body` antes de fijar el overflow. |
| Fuga de foco a elementos interactivos del fondo | Media / Alta | Aplicar atributo HTML `inert` al contenedor principal del portafolio cuando `selectedProject !== null`, garantizando soporte nativo además del hook `useFocusTrap`. |
| Degradación de rendimiento de animación en dispositivos móviles | Baja / Alta | Limitar rígidamente la animación de Framer Motion a `transform: translateY(...)` y `opacity`, utilizando aceleración por hardware (`will-change: transform`). |
| Conflictos con la navegación de teclado existente de la SPA (`App.tsx`) | Media / Media | Desactivar o pausar los listeners globales de cambio de página en `App.tsx` mientras el overlay esté abierto, o asegurar que `event.stopPropagation()` en el overlay prevenga navegación lateral no deseada. |

---

## 9. Criterios de Aceptación (Definition of Done)

- [ ] `specs/003-case-studies/plan.md` aprobado formalmente por el usuario.
- [ ] Cero líneas de texto ficticio o lorem ipsum en `ProjectsSection`.
- [ ] Los 3 proyectos reales renderizan exactamente la información técnica definida en la especificación.
- [ ] Interfaz `CaseStudy` estricta y datos aislados en `src/data/caseStudies.ts`.
- [ ] Overlay a pantalla completa con estética de reportaje periodístico en desktop y móvil.
- [ ] Animación de entrada y salida fluida a 60 FPS gobernada por `transform` y `opacity`.
- [ ] Trampa de foco (Focus Trap) completamente funcional con teclado (`Tab`, `Shift+Tab`, `Escape`).
- [ ] Restauración del foco en la tarjeta disparadora al cerrar el overlay.
- [ ] Bloqueo de scroll de fondo sin saltos de layout shift.
- [ ] Tests unitarios y de accesibilidad pasando con 100% de éxito (`npm test`).
- [ ] `npm run build` genera bundle estático limpio sin errores de TypeScript ni warnings.
