# TASKS-003: Casos de Estudio — Reportajes Editoriales con Datos Reales

**Plan:** [plan.md](./plan.md)  
**Spec:** [spec.md](./spec.md)  
**Estado:** Completado  
**Fecha:** 2026-09-24  

---

## Bloque 1 — Modelo de Datos e Infraestructura de Casos de Estudio

- [x] **T01 — Definir interfaces TypeScript estrictas en `src/types/caseStudy.ts`.**  
  **Bloque:** 1 | **Requisitos:** RF-04, RNF-03, Principio 5  
  Crear el archivo `src/types/caseStudy.ts` y exportar las interfaces `HeroMetric`, `ArchitecturalTradeOff`, `CaseStudyMetric` y `CaseStudy` según lo definido en el §3 del plan. Asegurar tipado riguroso de cada campo editorial (ID editorial, titular, subtitular, lede, restricciones, trade-offs, stack, métricas de impacto).  
  **Hecho cuando:** `npx tsc --noEmit` compila sin errores y `src/types/caseStudy.ts` exporta todas las interfaces requeridas con documentación JSDoc explicativa.

- [x] **T02 — Crear dataset de casos de estudio con datos reales en `src/data/caseStudies.ts`.**  
  **Bloque:** 1 | **Requisitos:** RF-01, RF-04, Principio 5  
  Crear el archivo `src/data/caseStudies.ts` e instanciar el array tipado `caseStudies: CaseStudy[]` con el contenido real íntegro de los tres proyectos redactados en el §3 del `spec.md`:  
  1. SmartForge (`REP-2024.01` — Motor Biomecánico de Periodización Inteligente).  
  2. FitPlan Desktop (`REP-2024.02` — CRM Offline-First con Taxonomía de Ejercicios).  
  3. Interactive Digital Menu (`REP-2024.03` — Conversational Commerce con Stock en Tiempo Real).  
  Reutilizar temporalmente las rutas de imágenes existentes sin placeholders.  
  **Hecho cuando:** `src/data/caseStudies.ts` exporta `caseStudies` con longitud exacta de 3 elementos que satisfacen la interfaz `CaseStudy` y no contienen texto ficticio ni lorem ipsum.

---

## Bloque 2 — Hooks de Accesibilidad e Interacción

- [x] **T03 — Implementar hook de captura y ciclado de foco `src/hooks/useFocusTrap.ts`.**  
  **Bloque:** 2 | **Requisitos:** RA-02, RA-03, Principio 1, Principio 4  
  Crear `src/hooks/useFocusTrap.ts` para gestionar la contención del foco dentro de elementos modales:  
  - Al activarse (`isActive: true`), consultar elementos interactivos enfocables (`a[href]`, `button:not([disabled])`, `[tabindex]:not([tabindex="-1"])`).  
  - Enfocar automáticamente el botón de cierre o primer elemento interactivo.  
  - Capturar `Tab` (cicla al primer elemento si está en el último) y `Shift+Tab` (cicla al último si está en el primero).  
  - Escuchar la tecla `Escape` para invocar el callback de cierre.  
  - Al desactivarse, restaurar el foco en el elemento disparador previo.  
  **Hecho cuando:** El hook permite atrapar el foco dentro del contenedor referenciado, maneja ciclado con teclado y restaura el foco al cerrarse.

- [x] **T04 — Implementar hook de bloqueo de scroll sin layout shifts `src/hooks/useScrollLock.ts`.**  
  **Bloque:** 2 | **Requisitos:** RNF-01, Decisión de Alcance 5  
  Crear `src/hooks/useScrollLock.ts` para bloquear el scroll del documento de fondo mientras el overlay esté abierto:  
  - Calcular el ancho de la barra de desplazamiento (`window.innerWidth - document.documentElement.clientWidth`).  
  - Aplicar `paddingRight` compensatorio en `document.body` para prevenir desplazamientos bruscos de ancho (CLS = 0).  
  - Establecer `overflow: hidden` en `document.body` y `document.documentElement`.  
  - Limpiar el padding y el overflow al desmontarse o cuando `isLocked` sea `false`.  
  **Hecho cuando:** Al activar el bloqueo, la página no hace scroll y el ancho del viewport se mantiene exactamente igual sin brincos visuales.

---

## Bloque 3 — Tarjeta de Portada Accesible (`ProjectCard.tsx`)

- [x] **T05 — Extraer y modularizar el componente `src/components/ProjectCard.tsx`.**  
  **Bloque:** 3 | **Requisitos:** RF-01, RA-05, RNF-02, RNF-03  
  Extraer la lógica de tarjeta embebida de `ProjectsSection.tsx` hacia un componente independiente `src/components/ProjectCard.tsx`. Definir sus props: `{ project: CaseStudy; onSelect: (project: CaseStudy) => void; isSelected?: boolean }`.  
  **Hecho cuando:** `src/components/ProjectCard.tsx` existe, importa la interfaz `CaseStudy` y compila limpiamente sin dependencias circulares.

- [x] **T06 — Implementar diseño editorial y métricas tabulares en `ProjectCard.tsx`.**  
  **Bloque:** 3 | **Requisitos:** RF-01, RNF-03, Principio 2  
  Maquetar la tarjeta de portada con la semántica editorial de periódico y los tokens OKLCH de la Fase 2:  
  - ID editorial (`REP-2024.XX`) con `font-mono tabular-nums text-ink-muted text-mono-sm`.  
  - Métrica héroe destacada con `font-mono tabular-nums text-mint-base text-h3 font-bold`.  
  - Categoría editorial en mayúsculas con `tracking-widest`.  
  - Titular con `font-headline font-bold text-h2 text-ink-headline`.  
  - Subtitular con `font-body italic text-ink-body`.  
  - Extracto resumido con `text-body text-ink-muted`.  
  - Badges del stack con fondo `paper-muted` y texto `ink-body`.  
  **Hecho cuando:** La tarjeta renderiza fielmente todos los campos del caso de estudio aplicando la escala tipográfica fluida y los tokens OKLCH.

- [x] **T07 — Implementar patrón interactivo accesible por click y teclado en `ProjectCard.tsx`.**  
  **Bloque:** 3 | **Requisitos:** RA-05, Principio 4  
  Estructurar el contenedor de la tarjeta como `<article className="relative ...">` y superponer un botón de activación accesible con posición absoluta (`absolute inset-0 w-full h-full opacity-0` o con clase `sr-only` extendida) que tenga `aria-label={`Leer reportaje completo: ${project.headline}`}`, manejando el click y los eventos de teclado `Enter` y `Space`. Añadir anillo de foco visible (`focus-visible:ring-2 focus-visible:ring-mint-base`).  
  **Hecho cuando:** La tarjeta es completamente accionable tanto con ratón como con teclado (`Enter`/`Space`) y un lector de pantalla anuncia adecuadamente la acción.

---

## Bloque 4 — Reportaje Editorial a Pantalla Completa (`ArticleOverlay.tsx`)

- [x] **T08 — Crear estructura base, landmarks ARIA y botón de cierre en `ArticleOverlay.tsx`.**  
  **Bloque:** 4 | **Requisitos:** RF-02, RA-01, RA-02, RA-03  
  Crear `src/components/ArticleOverlay.tsx` aceptando las props `{ project: CaseStudy; onClose: () => void }`.  
  - Envolver el contenedor con `role="dialog"`, `aria-modal="true"` y `aria-labelledby={`article-title-${project.id}`}`.  
  - Incorporar backdrop con `bg-paper-base/80 backdrop-blur-sm` y click para cerrar.  
  - Integrar los hooks `useFocusTrap` y `useScrollLock`.  
  - Implementar botón visible de cierre superior con `aria-label="Cerrar reportaje y volver a portada"`, icono X y texto accesible "RETURN TO FRONT PAGE".  
  **Hecho cuando:** El overlay se monta con los atributos ARIA correctos, enfoca el botón de cierre automáticamente y se cierra limpiamente al presionar `Escape` o hacer click en el botón de retorno.

- [x] **T09 — Implementar animación GPU a 60 FPS con Framer Motion en `ArticleOverlay.tsx`.**  
  **Bloque:** 4 | **Requisitos:** RF-03, RNF-01, Principio 3  
  Configurar la animación del contenedor modal con componentes `motion.div` de Framer Motion:  
  - Transición de entrada: `y: "30px" → "0px"`, `opacity: 0 → 1`, con aceleración cúbica `[0.16, 1, 0.3, 1]` en 0.35s.  
  - Transición de salida: `y: "20px"`, `opacity: 0` en 0.2s.  
  - Respetar `prefers-reduced-motion` reduciendo la duración a desvanecimiento instantáneo si la preferencia está activa.  
  - Asegurar uso estricto de `transform` y `opacity` sin afectar propiedades de layout.  
  **Hecho cuando:** La animación de apertura y cierre se ejecuta en el compositor GPU sin producir layouts forzados ni saltos de frame.

- [x] **T10 — Maquetar bloques editoriales principales (Cabecera, Lede, Restricciones y Trade-offs).**  
  **Bloque:** 4 | **Requisitos:** RF-02, RA-04, RNF-02, RNF-03, Principio 2  
  Desarrollar el cuerpo editorial del artículo dentro del overlay:  
  - Cabecera: ID editorial monoespaciado, categoría, titular principal con `font-headline text-display` y subtitular en itálica.  
  - Lede: Párrafo de apertura con estilo periodístico denso y tipografía fluida de lectura cómoda.  
  - Restricciones: Sección encuadrada con divisores editoriales `rule-light`.  
  - Pull-quotes de Trade-offs: Citas destacadas con comillas tipográficas, formato *"Sacrificamos X para ganar Y"*, borde lateral `border-l-4 border-mint-base`, fondo `paper-muted/30` y contraste superior a 4.5:1.  
  **Hecho cuando:** Los 4 bloques editoriales se renderizan con alta jerarquía visual y cumplen los requisitos de contraste WCAG AA en ambos modos (Morning y Evening).

- [x] **T11 — Maquetar columna técnica lateral con Stack y Métricas de Impacto.**  
  **Bloque:** 4 | **Requisitos:** RF-02, RNF-02, RNF-03  
  Organizar el artículo en desktop mediante CSS Grid (`grid-cols-12 gap-8`) y una sola columna en móvil:  
  - Columna de contenido principal (8 columnas en desktop).  
  - Sidebar técnico lateral (4 columnas en desktop):  
    - Métrica héroe de gran impacto con etiqueta descriptiva.  
    - Lista visual compacta de badges de tecnologías.  
    - Tabla/lista de Métricas de Impacto con números tabulares (`font-mono tabular-nums lining-nums`).  
  **Hecho cuando:** En pantallas ≥ 1024px el artículo se distribuye en layout de dos columnas sin solapamientos, y en móviles colapsa a una columna fluida y legible.

---

## Bloque 5 — Integración, Orquestación y Validación de Calidad

- [x] **T12 — Integrar `ArticleOverlay` y gestión de estado en `src/components/ProjectsSection.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-01, RF-05, RA-01  
  Refactorizar `src/components/ProjectsSection.tsx`:  
  - Importar `caseStudies` desde `src/data/caseStudies.ts`.  
  - Declarar estado `selectedProject` con `useState<CaseStudy | null>(null)`.  
  - Renderizar el grid dinámico utilizando el nuevo componente `ProjectCard`.  
  - Envolver `ArticleOverlay` en `<AnimatePresence>` de Framer Motion condicionado a `selectedProject !== null`.  
  - Agregar atributo `inert={selectedProject !== null ? '' : undefined}` al contenedor del grid mientras el modal esté visible para aislar la accesibilidad.  
  **Hecho cuando:** Al clickear cualquier tarjeta de la sección se abre el artículo correspondiente, y al cerrarlo el usuario vuelve a la portada en la misma posición de scroll.

- [x] **T13 — Escribir suite de tests unitarios y de accesibilidad con Vitest.**  
  **Bloque:** 5 | **Requisitos:** RA-01, RA-02, RA-03, RA-04, RA-05, Principio 4  
  Crear los archivos de prueba `test/components/ProjectCard.test.tsx` y `test/components/ArticleOverlay.test.tsx`:  
  - Test de renderizado de los datos de los 3 proyectos reales sin placeholders.  
  - Test de activación de tarjeta por teclado (`Enter`, `Space`).  
  - Test de Focus Trap: foco inicial en botón de cierre, ciclado de `Tab` y `Shift+Tab`.  
  - Test de cierre con tecla `Escape`.  
  - Test de auditoría automatizada con `axe-core`: `expect(await axe(container)).toHaveNoViolations()`.  
  **Hecho cuando:** Todos los tests pasan exitosamente al ejecutar `npx vitest run`.

- [x] **T14 — Verificación manual integral y validación de build estático.**  
  **Bloque:** 5 | **Requisitos:** RNF-01, RNF-03, Principio 3, Principio 4, Principio 6  
  Ejecutar el protocolo de control de calidad final:  
  1. Comprobación manual de navegación por teclado completa sin ratón.  
  2. Verificación de animación fluida a 60 FPS en Chrome DevTools (Performance tab con 4x CPU Throttling).  
  3. Verificación de contraste en modo claro ("Morning Edition") y modo oscuro ("Evening Edition").  
  4. Ejecución de `npx tsc --noEmit` para validar consistencia de tipos.  
  5. Ejecución de `npm run build` para comprobar que el bundle de producción para AWS S3/CloudFront se genera sin advertencias ni errores.  
  **Hecho cuando:** El checklist manual está verificado y `npm run build` finaliza con código de salida 0.
