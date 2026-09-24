# SPEC-003: Casos de Estudio — Reportajes Editoriales con Datos Reales

**Estado:** Borrador  
**Fase:** 3  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 2, 3, 4, 5  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 2, 4, 5

---

## 1. Contexto y Objetivo

### 1.1 Contexto
Actualmente, la sección `ProjectsSection` ("THE DAILY REPORTS") muestra tres tarjetas con contenido genérico y ficticio: un sistema veterinario inexistente ("LaikaVet"), un motor de workflows ("Enterprise Workflow Engine") y una migración cloud ("Cloud Migration Initiative"). Esto viola directamente el Principio 5 de la Constitución: *"Casos de estudio con datos reales. Cada proyecto validará empíricamente la experiencia técnica, mostrando el problema, trade-offs y métricas cuantificables. Cero lorem ipsum, cero capturas placeholder."*

Además, las tarjetas actuales carecen de profundidad editorial. El botón "Read Full Story" no tiene funcionalidad asignada y los textos son extractos superficiales sin narración del problema, restricciones del contexto, ni decisiones arquitectónicas fundamentadas.

### 1.2 Objetivo
Reemplazar íntegramente el contenido ficticio de `ProjectsSection` por tres casos de estudio reales, presentados como reportajes editoriales de periódico con la siguiente estructura:

1. **Tarjetas de portada** (grid de la sección principal) que funcionan como "gancho" periodístico con titular, bajada, categoría, métrica héroe y stack resumido.
2. **Overlay editorial a pantalla completa** que se activa al hacer click en una tarjeta, presentando el artículo completo con layout de columnas, pull-quotes para trade-offs, y métricas tipográficas de alto impacto.
3. **Arquitectura de datos aislada y extensible** donde el contenido de cada caso de estudio se define mediante una interfaz TypeScript estricta y un array de objetos, permitiendo agregar proyectos futuros sin modificar la maquetación.

### 1.3 Por qué ahora
La Fase 2 consolidó los cimientos visuales del portafolio: tokens semánticos OKLCH, escala tipográfica fluida (Perfect Fourth), micro-tipografía editorial y fuentes locales subseteadas. Los casos de estudio son la capa de contenido que justifica toda esa infraestructura de diseño. Construirlos ahora permite validar empíricamente que los tokens (`ink-headline`, `paper-card`, `mint-base`, `rule-bold`), la triada tipográfica (Playfair Display, Inter, JetBrains Mono) y las reglas de `tabular-nums` funcionan correctamente en un contexto editorial denso antes de abordar las animaciones de vuelta de página (Fase 4).

---

## 2. Historias de Usuario

| ID    | Como…                        | Quiero…                                                                                                  | Para…                                                                                               |
|-------|------------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| HU-01 | Reclutador técnico           | leer un resumen visual rápido de cada proyecto (titular, métrica héroe, stack)                            | evaluar en segundos si el perfil técnico del candidato se alinea con las necesidades de mi equipo.   |
| HU-02 | Reclutador técnico           | abrir un artículo editorial completo con el problema, restricciones, trade-offs y métricas de un proyecto | validar la profundidad de razonamiento ingenieril del candidato más allá de un listado de tecnologías.|
| HU-03 | Ingeniero de software senior | ver las decisiones arquitectónicas presentadas como trade-offs explícitos ("sacrificamos X para ganar Y") | entender el criterio técnico del autor y su capacidad de evaluar compromisos de ingeniería.          |
| HU-04 | Lector en dispositivo móvil  | que el overlay del artículo sea legible y navegable en pantalla pequeña                                   | consumir los casos de estudio desde cualquier dispositivo sin degradación de experiencia.            |
| HU-05 | Usuario de teclado / lector de pantalla | navegar, abrir y cerrar los artículos completamente por teclado con foco atrapado               | acceder al contenido sin depender del ratón ni perder el contexto de navegación.                    |
| HU-06 | Marco (autor del portafolio) | agregar proyectos futuros editando únicamente un array de datos                                          | escalar la sección sin tocar la maquetación ni duplicar componentes.                                |

---

## 3. Contenido Exacto de los Casos de Estudio

### 3.1 Proyecto 1 — SmartForge

| Campo              | Contenido                                                                                                                                                                                                                                                                                                               |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID editorial**   | `REP-2024.01`                                                                                                                                                                                                                                                                                                           |
| **Titular**        | SmartForge                                                                                                                                                                                                                                                                                                              |
| **Subtitular**     | Motor Biomecánico de Periodización Inteligente                                                                                                                                                                                                                                                                          |
| **Categoría**      | FULL-STACK · PWA                                                                                                                                                                                                                                                                                                        |
| **Métrica héroe**  | `O(N) → O(1)` — Generación algorítmica en milisegundos                                                                                                                                                                                                                                                                 |
| **Lede (Problema)**| Un entrenador altamente cualificado gestionaba la periodización y auditoría de fatiga articular de sus clientes mediante hojas de cálculo estáticas en Excel. El cálculo dinámico de múltiples variables —equipo disponible en el gimnasio, restricciones horarias del cliente, esfuerzo percibido (RPE) y progresión de cargas cruzada con peso corporal— era imposible de escalar manualmente. |
| **Restricciones**  | Proyecto bootstrapped (uso personal + fase beta para un gimnasio local). Requería una arquitectura de muy bajo coste de mantenimiento, pero estrictamente replicable para migrar de un entorno local de desarrollo a la infraestructura del gimnasio sin fricción ni discrepancias. |
| **Trade-off 1**    | *"Asumí mayor complejidad DevOps inicial con Docker (PostgreSQL + Node/Express) en lugar de un BaaS rápido como Supabase, a cambio de control absoluto sobre el motor relacional para consultas biomecánicas y cero discrepancias entre desarrollo y producción."* |
| **Trade-off 2**    | *"Opté por React Query en lugar de un store global masivo (Redux/Zustand), delegando la gestión del estado asíncrono y el caché al servidor para mantener la PWA ligera en dispositivos móviles dentro del gimnasio."* |
| **Stack**          | React · TypeScript · React Query · Node.js · Express · PostgreSQL · Docker · PWA                                                                                                                                                                                                                                        |
| **Métricas**       | Digitalización del 100% de la lógica biomecánica en un esquema relacional estricto · Generación algorítmica de rutinas en milisegundos (vs. proceso manual O(N) en Excel) · Contenedorización cross-environment lista para despliegue · Proyecto en fase de prelanzamiento (beta) |

### 3.2 Proyecto 2 — FitPlan Desktop

| Campo              | Contenido                                                                                                                                                                                                                                                                                                               |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID editorial**   | `REP-2024.02`                                                                                                                                                                                                                                                                                                           |
| **Titular**        | FitPlan Desktop                                                                                                                                                                                                                                                                                                         |
| **Subtitular**     | CRM Offline-First con Taxonomía de Ejercicios                                                                                                                                                                                                                                                                           |
| **Categoría**      | DESKTOP · OFFLINE-FIRST                                                                                                                                                                                                                                                                                                 |
| **Métrica héroe**  | `100% Offline` — Tolerancia total a fallos de red                                                                                                                                                                                                                                                                       |
| **Lede (Problema)**| Un entrenador necesitaba un sistema local (CRM) combinado con una taxonomía de ejercicios compleja (videos, grupos musculares, rangos de movimiento) para ensamblar plantillas de entrenamiento comercializables y exportarlas a Excel. Las soluciones web estándar fallaban por la fricción operativa: cortes de internet constantes e imposibilidad de operar sin conexión. |
| **Restricciones**  | Hardware y conectividad severamente limitados. El usuario final operaba desde una netbook de baja gama en un entorno con red hostil (intermitente). El sistema requería disponibilidad 100% offline y capacidad para generar entregables interoperables (Excels enriquecidos). |
| **Trade-off 1**    | *"Asumí un mayor peso de empaquetado y despliegue nativo con Electron + SQLite (Prisma) en lugar de una web app estándar, a cambio de tolerancia total a fallos de red y latencia cero en lectura/escritura."* |
| **Trade-off 2**    | *"Sacrifiqué el precargado agresivo de datos implementando evaluación perezosa (lazy evaluation) y estado reactivo para contener la huella de RAM de V8/Electron en una netbook de gama baja. La memoria solo retiene las entidades estrictamente en uso."* |
| **Stack**          | Electron · React 19 · TypeScript · Prisma ORM · SQLite · Lazy Evaluation                                                                                                                                                                                                                                               |
| **Métricas**       | Latencia de lectura/escritura reducida a milisegundos (operación local pura) · Huella de RAM contenida para hardware de gama baja · Generación automatizada de plantillas Excel reducida de horas a clics · Disponibilidad 100% sin conexión a internet |

### 3.3 Proyecto 3 — Interactive Digital Menu

| Campo              | Contenido                                                                                                                                                                                                                                                                                                               |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID editorial**   | `REP-2024.03`                                                                                                                                                                                                                                                                                                           |
| **Titular**        | Interactive Digital Menu                                                                                                                                                                                                                                                                                                |
| **Subtitular**     | Conversational Commerce con Stock en Tiempo Real                                                                                                                                                                                                                                                                        |
| **Categoría**      | FULL-STACK · E-COMMERCE                                                                                                                                                                                                                                                                                                 |
| **Métrica héroe**  | `0 PDFs` — Erradicación total de menús estáticos                                                                                                                                                                                                                                                                        |
| **Lede (Problema)**| Un restaurante de gastronomía venezolana operaba con menús en formato PDF estático. Esto generaba un cuello de botella crítico: imposibilidad de actualizar precios o inhabilitar platos agotados en tiempo real, mala experiencia de usuario en móviles (descargar/hacer zoom) y una toma de pedidos manual muy propensa a errores comunicacionales en el delivery. |
| **Restricciones**  | El negocio carecía de personal técnico; el panel de administración debía tener una curva de aprendizaje nula (fricción cero). La solución debía acoplarse orgánicamente a sus canales de adquisición actuales (QR en mesas y enlace en Instagram) sin obligar al cliente a descargar apps de terceros. |
| **Trade-off 1**    | *"Sacrifiqué el control nativo del checkout final, delegándolo a WhatsApp mediante webhooks y formateo automatizado ('Conversational Commerce'), en lugar de construir una plataforma e-commerce pesada con pasarela de pago in-app. Esto maximizó la tasa de conversión al alinearse con el comportamiento natural del usuario local."* |
| **Trade-off 2**    | *"Utilicé Node.js y PostgreSQL (Prisma ORM) para mantener el panel de administración extremadamente ligero, enfocado exclusivamente en la lógica de categorías y control de stock real, sin complejidad innecesaria de CMS genérico."* |
| **Stack**          | React · TypeScript · Node.js · PostgreSQL · Prisma ORM · WhatsApp Webhooks                                                                                                                                                                                                                                             |
| **Métricas**       | Erradicación del 100% de la gestión de PDFs estáticos · Eliminación de fricción por "platos agotados" gracias a sincronización de inventario en tiempo real · Órdenes estructuradas y pre-formateadas directamente en WhatsApp para cocina y delivery · Reducción drástica de tiempos de atención y errores humanos |

---

## 4. Requisitos Funcionales (Verificables)

### RF-01 — Tarjetas de Portada (ProjectCard) con Datos Reales
Las tres tarjetas actuales del grid de `ProjectsSection` deben reemplazar íntegramente su contenido ficticio por los datos especificados en la Sección 3. Cada tarjeta debe mostrar, como mínimo:
- ID editorial (`REP-2024.XX`) en tipografía monoespaciada con `tabular-nums`.
- Métrica héroe destacada visualmente (ej. `O(N) → O(1)`, `100% Offline`, `0 PDFs`).
- Categoría editorial en mayúsculas y tracking ancho.
- Titular del proyecto en tipografía de encabezado (Playfair Display).
- Subtitular en itálica como bajada de noticia.
- Extracto breve (resumen del Lede).
- Tags del stack técnico.

**Criterios de Aceptación:**
- No existe ningún texto ficticio, lorem ipsum ni nombre de proyecto inventado en la sección.
- Cada tarjeta es interactiva (cursor pointer, estado hover visible) e indica claramente que puede abrirse para leer más.
- Los datos se consumen desde una estructura de datos aislada (ver RF-04), no están hardcodeados en el JSX de la tarjeta.

### RF-02 — Overlay Editorial a Pantalla Completa (ArticleOverlay)
Al hacer click en cualquier tarjeta o activarla con teclado (`Enter`/`Space`), se abre un overlay a pantalla completa (o casi completa) que presenta el artículo editorial del proyecto seleccionado. El overlay debe cumplir con las siguientes reglas de diseño:

**Estructura del Artículo (anatomía editorial):**
1. **Cabecera:** Titular del proyecto (tipografía display/h1), subtitular (bajada en itálica), categoría editorial y métrica héroe con alto impacto tipográfico.
2. **Lede / Problema:** Párrafo de entrada denso que narra el problema real en lenguaje directo y periodístico.
3. **Restricciones:** Bloque breve con las limitaciones contextuales que condicionaron las decisiones técnicas.
4. **Trade-offs (como Pull-Quotes):** Cada decisión arquitectónica presentada como un pull-quote editorial destacado con tipografía de alto impacto y estilo visual diferenciado del cuerpo del texto. Formato narrativo: *"Sacrificamos X para ganar Y"*.
5. **Stack Técnico:** Lista visual compacta de las tecnologías utilizadas.
6. **Métricas de Impacto:** Bloque final con los KPIs del proyecto en tipografía monoespaciada (`JetBrains Mono`) con `tabular-nums`.

**Reglas de Diseño Visual:**
- El overlay NO debe verse como un popup web genérico. Debe emular una página interior de un periódico de prestigio con layout de múltiples columnas (en desktop), divisores editoriales (`rule-bold`, `rule-light`), y uso riguroso de la triada tipográfica y los tokens OKLCH de la Fase 2.
- La cabecera del artículo debe incluir un botón claro de cierre ("Close" / "Return to Front Page") visible y accesible.

**Criterios de Aceptación:**
- El overlay renderiza correctamente los 6 bloques de contenido para cada proyecto sin necesidad de código condicional por proyecto.
- El layout se adapta de múltiples columnas (desktop) a una sola columna (móvil) manteniendo la legibilidad y la jerarquía editorial.
- Los pull-quotes de trade-offs se diferencian visualmente del cuerpo del texto mediante tipografía, tamaño, indentación o bordes editoriales.
- La métrica héroe y el bloque de métricas finales utilizan tipografía monoespaciada con `font-variant-numeric: tabular-nums lining-nums`.

### RF-03 — Animación del Overlay (60 FPS Garantizados)
La transición de entrada y salida del overlay debe animarse exclusivamente con propiedades que se ejecutan en el compositor GPU:

- **Propiedades permitidas:** `transform` y `opacity` únicamente.
- **Propiedades prohibidas:** `height`, `width`, `top`, `left`, `margin`, `padding` o cualquier otra propiedad que fuerce un recálculo de layout en el hilo principal.
- **Patrón sugerido:** Slide-up suave (`translateY(100%) → translateY(0)`) combinado con fade-in (`opacity: 0 → 1`) para la entrada; reversa para la salida.

**Criterios de Aceptación:**
- La animación de entrada y salida del overlay mantiene 60 FPS estables en un dispositivo de gama media (simulación Lighthouse con CPU throttling 4x).
- No se producen repintados forzados (forced reflows) durante la animación, verificable mediante las herramientas de rendimiento del navegador (Performance tab → sin layouts síncronos forzados).

### RF-04 — Arquitectura de Datos Extensible (Data-Driven)
Todo el contenido de los casos de estudio debe aislarse en una estructura de datos tipada, separada de los componentes de presentación:

- Se definirá una **interfaz TypeScript estricta** (`CaseStudy` o nombre equivalente) que modele todos los campos del artículo: ID editorial, titular, subtitular, categoría, métrica héroe (valor + etiqueta), lede, restricciones, trade-offs (array), stack (array), métricas de impacto (array) e imagen.
- Los tres proyectos iniciales se declararán como un **array de objetos** que implementen dicha interfaz.
- La ubicación de estos datos será un archivo dedicado (ej. `src/data/caseStudies.ts`) o constante exportada, nunca inline en un componente.

**Criterios de Aceptación:**
- Agregar un cuarto proyecto al portafolio requiere únicamente añadir un nuevo objeto al array de datos, sin modificar el componente `ProjectCard`, el componente `ArticleOverlay`, ni ninguna maquetación.
- La interfaz TypeScript hace que omitir un campo obligatorio produzca un error de compilación (`tsc --noEmit`).
- El componente del overlay itera dinámicamente sobre los campos del objeto para renderizar la estructura del artículo.

### RF-05 — Gestión de Estado del Overlay (Sin Router)
La apertura y cierre del overlay se gestionará exclusivamente mediante estado local de React (`useState` o equivalente), sin dependencia de un enrutador:

- Un estado controlará qué proyecto está actualmente seleccionado (o `null` si ninguno).
- La apertura establece el proyecto seleccionado; el cierre lo resetea a `null`.
- El fondo (la sección de tarjetas) permanece montado en el DOM mientras el overlay está activo, pero debe ser inerte visualmente y para la navegación (ver Sección 5).

**Criterios de Aceptación:**
- No se introduce ninguna dependencia de enrutamiento (`react-router-dom` o similar) para esta funcionalidad.
- El estado de overlay abierto/cerrado es binario y predecible: un solo proyecto visible a la vez, sin estados intermedios ni race conditions.

---

## 5. Requisitos de Accesibilidad (WCAG 2.1 AA — Innegociables)

### RA-01 — Semántica y Landmarks del Overlay
- El overlay debe utilizar un elemento `<dialog>` nativo o un `<div>` con `role="dialog"` y `aria-modal="true"`.
- Debe incluir un `aria-labelledby` que apunte al `id` del titular del proyecto dentro del overlay.
- El contenido del fondo debe marcarse como `aria-hidden="true"` y/o `inert` mientras el overlay esté activo.

### RA-02 — Trampa de Foco (Focus Trap)
- Mientras el overlay esté abierto, el foco del teclado debe permanecer atrapado exclusivamente dentro del overlay.
- La tabulación cíclica debe funcionar: `Tab` desde el último elemento enfocable vuelve al primero, y `Shift+Tab` desde el primero vuelve al último.
- Al abrir el overlay, el foco debe moverse automáticamente al primer elemento interactivo dentro de él (el botón de cierre o el primer enlace).
- Al cerrar el overlay, el foco debe restaurarse al elemento que lo abrió (la tarjeta que fue clickeada).

### RA-03 — Cierre por Teclado
- La tecla `Escape` debe cerrar el overlay desde cualquier posición de foco dentro de él.
- Debe existir un botón de cierre visible con `aria-label` descriptivo (ej. "Cerrar artículo y volver a portada").

### RA-04 — Contraste y Legibilidad
- Todo el texto dentro del overlay debe cumplir con los ratios de contraste WCAG 2.1 AA: ≥ 4.5:1 para texto regular y ≥ 3.0:1 para texto grande (≥ 24px / 18.66px bold).
- Los pull-quotes y métricas destacadas, al usar tipografías de mayor tamaño, deben verificar el ratio de 3.0:1 como mínimo contra su fondo inmediato.
- Los estados interactivos (hover, focus) del botón de cierre y de las tarjetas deben ser visualmente distinguibles y cumplir con el contraste mínimo.

### RA-05 — Tarjetas Interactivas Accesibles
- Cada `ProjectCard` debe ser activable tanto por click como por teclado (`Enter` y `Space`).
- Debe comunicar su rol interactivo mediante `role="button"` y `tabindex="0"` (si no es un `<button>` nativo), o preferiblemente ser un `<button>` o `<a>` semántico.
- Debe tener un `aria-label` o texto accesible que comunique la acción (ej. "Abrir caso de estudio: SmartForge").

---

## 6. Requisitos No Funcionales (NFR)

### RNF-01 — Rendimiento del Overlay
- La apertura del overlay no debe bloquear el hilo principal más de 16ms (un frame a 60 FPS).
- El contenido del artículo dentro del overlay debe renderizarse en un solo ciclo de pintado, sin layout shifts visibles (CLS = 0 dentro del overlay).

### RNF-02 — Responsive Design
- Las tarjetas del grid deben mantener el patrón actual: 1 columna en móvil, 2 en tablet (`md`), 3 en desktop (`lg`).
- El artículo del overlay debe usar layout multi-columna en desktop (≥ 1024px) y degradar a una sola columna en móvil/tablet, manteniendo la jerarquía editorial.
- Los pull-quotes deben ocupar el ancho completo en móvil y destacarse como elementos flotantes o de columna independiente en desktop.

### RNF-03 — Consistencia con el Sistema de Diseño (Fase 2)
- Todos los colores del overlay y las tarjetas deben usar exclusivamente tokens semánticos OKLCH definidos en la Fase 2 (`paper-*`, `ink-*`, `mint-*`, `rule-*`).
- Toda la tipografía debe usar la triada editorial (Playfair Display, Inter, JetBrains Mono) y la escala fluida Perfect Fourth definida en la Fase 2.
- Los divisores editoriales deben usar los tokens `rule-bold`, `rule-light` y `rule-dashed` existentes.
- El overlay debe respetar ambos modos de edición (Morning Edition / Evening Edition) sin clases CSS adicionales — los tokens semánticos deben ser suficientes.

---

## 7. Decisiones de Alcance Resueltas

1. **Patrón de interacción para profundización del caso de estudio:**
   - **Resolución:** Overlay editorial a pantalla completa gestionado por estado React (`useState`). Descartadas: expansión in-place (rompe el grid), ruta dedicada (requiere router eliminado en Fase 1), híbrido (complejidad innecesaria en esta fase).

2. **Naturaleza heterogénea de las métricas héroe:**
   - **Resolución:** Cada proyecto puede tener una métrica héroe de naturaleza distinta (arquitectónica, operativa o de negocio) según la etapa y el dominio del proyecto. SmartForge (beta) usa una métrica arquitectónica (`O(N) → O(1)`); FitPlan Desktop usa una métrica de disponibilidad (`100% Offline`); Interactive Digital Menu usa una métrica de eliminación de fricción (`0 PDFs`). No se fuerza homogeneidad artificial.

3. **Escalabilidad futura de proyectos:**
   - **Resolución:** La interfaz TypeScript estricta y el array de datos aislado garantizan que agregar proyectos futuros sea una operación exclusivamente de datos, sin tocar componentes de presentación. El grid CSS adaptativo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) acomodará dinámicamente más tarjetas.

4. **Imágenes de los proyectos:**
   - **Pendiente de resolución:** Los assets de imagen actuales (`project-laikavet.jpg`, `project-automation.jpg`, `project-infrastructure.jpg`) corresponden a los proyectos ficticios y deberán ser reemplazados. La estrategia de reemplazo de imágenes (capturas reales, ilustraciones generadas o composiciones editoriales) se definirá durante la fase de implementación, garantizando el principio constitucional de "cero capturas placeholder".

5. **Scroll del body mientras el overlay está abierto:**
   - **Resolución:** El scroll del `body` debe bloquearse mientras el overlay esté activo (`overflow: hidden` en el `html`/`body`) para evitar que el usuario desplace inadvertidamente el contenido de fondo. Al cerrar el overlay, se restaura el scroll a la posición original.
