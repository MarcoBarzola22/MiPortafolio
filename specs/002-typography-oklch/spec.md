# SPEC-002: Estética Editorial y Tipografía (Design Engineering)

**Estado:** Aprobada  
**Fase:** 2  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 1, 2, 4, 6  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 2, 4, 5

---

## 1. Contexto y Objetivo

### 1.1 Contexto
Actualmente, "The Minty Gazette" utiliza una configuración heredada de estilos basada en variables de color HSL de shadcn (`hsl(var(--background))`) combinadas con valores ad-hoc en `tailwind.config.ts`. Asimismo, la tipografía depende de un `@import` bloqueante de Google Fonts en `index.css`, introduciendo latencia de red de terceros, penalizaciones críticas en el First Contentful Paint (FCP) y riesgo de Cumulative Layout Shift (CLS) por disparidad métrica entre las fuentes remotas y los fallbacks del sistema operativo.

Visualmente, el proyecto carece de una escala tipográfica matemática estricta y de convenciones micro-tipográficas editoriales automáticas, lo que delega el ritmo y la compostura visual a la memoria del desarrollador mediante clases utilitarias arbitrarias.

### 1.2 Objetivo
Establecer un sistema de diseño editorial de grado de producción ("Design Engineering") que:
1. Emplee exclusivamente el espacio de color uniforme perceptual **OKLCH** a través de tokens semánticos editoriales (`paper`, `ink`, `mint`, `rule`), con soporte dual para **"Morning Edition"** (modo claro) y **"Evening Edition"** (modo oscuro refinado con carbón tintado, sin negros puros).
2. Aloje localmente las familias tipográficas oficiales (**Playfair Display**, **Inter** y **JetBrains Mono**) en formato `.woff2` subseteado, eliminando cualquier dependencia de red externa.
3. Implemente una **escala tipográfica fluida** basada en la proporción matemática **Perfect Fourth (1.333)** mediante funciones CSS `clamp()`.
4. Mitigue el CLS a 0 mediante **fallbacks métricos calibrados** (`size-adjust`, `ascent-override`, `descent-override`).
5. Inyecte reglas automáticas de **micro-tipografía avanzada** (`text-wrap: balance`, `text-wrap: pretty`, ligaduras, `tabular-nums`) a nivel semántico base.

### 1.3 Por qué ahora
La Fase 1 saneó la arquitectura del proyecto (eliminación de dependencias huérfanas y enrutamiento por URL). La construcción de los casos de estudio (Fase 3) y las animaciones de página (Fase 4) requiere que los cimientos visuales (tokens de color, contraste accesible y jerarquía tipográfica) estén normalizados. Construir componentes antes de consolidar este sistema causaría una refactorización masiva y deuda técnica visual.

---

## 2. Historias de Usuario

| ID    | Como…                  | Quiero…                                                                           | Para…                                                                             |
|-------|------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| HU-01 | Lector del portafolio  | experimentar una jerarquía visual clara con titulares contrastados y lectura cómoda | consumir el contenido técnico con la sensación de un periódico impreso de prestigio.|
| HU-02 | Lector nocturno        | alternar a la "Evening Edition" (Dark Mode) sin perder la atmósfera editorial     | leer cómodamente en baja luz sin contrastes agresivos de negros puros (#000000).  |
| HU-03 | Usuario en conexión lenta | que el texto aparezca de inmediato sin saltos de página ni parpadeos (layout shift)| disfrutar de una carga instantánea y lectura estable desde el primer milisegundo. |
| HU-04 | Usuario con baja visión| que todo texto y componente cumpla holgadamente con los ratios de contraste WCAG AA| distinguir títulos, párrafos y estados interactivos sin fatiga visual.           |
| HU-05 | Ingeniero de software  | consumir snippets de código y métricas con números alineados verticalmente        | comparar cifras y leer sintaxis técnica de forma tabular y legible.               |
| HU-06 | Desarrollador UI       | disponer de tokens semánticos (`paper`, `ink`, `mint`, `rule`) y tipografía fluida | maquetar vistas sin inventar colores mágicos ni multiplicar clases de breakpoint. |

---

## 3. Requisitos Funcionales (Verificables)

### RF-01 — Arquitectura de Tokens Semánticos en Espacio OKLCH
El sistema de estilos debe operar exclusivamente con variables CSS en formato `oklch(L C H)` o `oklch(L C H / alpha)`, expuestas a Tailwind CSS bajo una taxonomía editorial estricta:
- **`paper` (Superficies):** 
  - `paper-base`: Fondo principal de la página.
  - `paper-elevated` / `paper-card`: Fondo para tarjetas de proyectos, columnas y clasificados.
  - `paper-muted`: Superficie para contenedores secundarios o etiquetas.
- **`ink` (Tipografía e Iconografía):**
  - `ink-headline`: Máximo contraste para titulares y masthead.
  - `ink-body`: Contraste equilibrado para párrafos y lectura prolongada.
  - `ink-muted`: Contraste medio para metadatos, fechas y pies de foto.
  - `ink-subtle`: Contraste suave para elementos decorativos no esenciales.
- **`mint` (Acentos editoriales e Interactividad):**
  - `mint-base`: Tono insignia para resaltados, focos e indicadores activos.
  - `mint-hover`: Estado reactivo al cursor/teclado.
  - `mint-contrast`: Tinta optimizada para texto renderizado sobre fondos menta.
- **`rule` (Estructura impresa y divisores):**
  - `rule-bold`: Línea divisoria principal del periódico (1px a 2px continua).
  - `rule-light`: Separadores sutiles entre columnas de texto.
  - `rule-dashed` / `rule-dotted`: Bordes de sección secundaria o clasificados.

**Criterios de Aceptación:**
- No debe existir ningún valor hexadecimal (`#...`), RGB ni HSL residual en `tailwind.config.ts` ni en las variables de color de `src/index.css`.
- Todo token de texto (`ink-*`) frente a su respectivo fondo (`paper-*`) debe alcanzar un ratio de contraste mínimo de 4.5:1 (texto regular) y 3.0:1 (texto grande ≥ 24px) según WCAG 2.1 AA.
- El acento `mint` debe contar con variantes que permitan su uso accesible tanto en fondos claros como oscuros.

### RF-02 — Dualidad de Edición ("Morning Edition" y "Evening Edition")
El sistema debe proveer soporte completo para modo claro y modo oscuro cambiando dinámicamente las variables semánticas:
- **Morning Edition (Default / Light):** Papel impreso con tonalidad cálida natural (L ≈ 0.95–0.98, C mínima en tonos tierra/crema), tinta oscura carbón (L ≈ 0.20–0.25).
- **Evening Edition (Dark):** Papel invertido compuesto de tonos carbón profundo con tinte cálido sutil (L ≈ 0.18–0.24, C ≈ 0.015), prohibiendo el negro puro (`oklch(0 0 0)`), y tinta clara con tono pergamino (L ≈ 0.88–0.93).

**Criterios de Aceptación:**
- El cambio de tema se efectúa mediante una clase raíz `.dark` en el elemento `html` o selector `:root`.
- El contraste WCAG 2.1 AA se mantiene verificado en ambos modos sin alteración de las clases utilitarias del JSX.
- Ninguna superficie en modo oscuro tendrá luminosidad `L = 0`.
- Sincronización inicial automática con `prefers-color-scheme` del SO y persistencia en `localStorage`.
- Un conmutador de tema minimalista e integrado en el `NewspaperMasthead` permite la alternancia manual accesible (con `aria-label` y feedback visual).

### RF-03 — Triada Tipográfica y Alojamiento Local Subseteado
El sistema debe configurar y servir tres familias tipográficas alojadas localmente como dependencias de build vía paquetes NPM de Fontsource (`@fontsource/playfair-display`, `@fontsource/inter`, `@fontsource/jetbrains-mono`), importando exclusivamente los pesos requeridos en subconjunto `latin`:
- **Titulares:** `Playfair Display` (Pesos: Regular 400, Semi-Bold 600, Bold 700 e Italic).
- **Cuerpo y lectura:** `Inter` (Pesos: Regular 400, Medium 500, Semi-Bold 600).
- **Datos y código:** `JetBrains Mono` (Pesos: Regular 400, Medium 500) para métricas de proyectos, números de página, snippets y metadatos técnicos.

**Criterios de Aceptación:**
- Se eliminan todas las directivas `@import url('https://fonts.googleapis.com/...')` y etiquetas `<link rel="stylesheet">` externas hacia Google Fonts.
- Los paquetes de Fontsource proveen archivos `.woff2` locales con subsetting latino (incluyendo tildes, signos `¿`, `¡` y la letra `ñ`), empaquetados por Vite en el build estático.
- Las fuentes se declaran en CSS mediante reglas `@font-face` con `font-display: swap`.

### RF-04 — Escala Tipográfica Fluida Matemática (Ratio 1.333 - Perfect Fourth)
El sistema debe definir una jerarquía tipográfica basada en el ratio modular Perfect Fourth (1.333) utilizando la función `clamp(min, preferred, max)` vinculada a un rango de viewport predeterminado (320px móvil a 1280px desktop):
- `text-display` (Titular principal / Masthead de primera plana): Escalado dramático de alto impacto.
- `text-h1` (Títulos de página y grandes historias).
- `text-h2` (Títulos de sección y proyectos principales).
- `text-h3` (Subtitulares y encabezados de columna).
- `text-body-lg` (Lead text / bajada de noticia).
- `text-body` (Texto estándar de lectura, base 16px en desktop).
- `text-caption` / `text-small` (Pies de foto, clasificados, metadatos).
- `text-mono-sm` (Métricas tabulares y etiquetas técnicas).

**Criterios de Aceptación:**
- Cada nivel de la escala se expone en Tailwind como una clase utilitaria personalizada con su respectivo `line-height` y `letter-spacing` (tracking) calibrado ópticamente.
- Las transiciones de tamaño entre viewport móvil y desktop ocurren de forma continua y fluida, sin saltos visibles ni necesidad de añadir modificadores `md:` o `lg:` en el marcado JSX.

### RF-05 — Calibración Métrica de Fallbacks para Cero Desplazamiento (Zero CLS)
Para neutralizar cualquier salto de maquetación durante la carga de las fuentes (`font-display: swap`), se deben implementar fuentes de respaldo del sistema con modificadores de métrica:
- Para `Playfair Display`: Fallback `Georgia` con overrides calibrados (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`).
- Para `Inter`: Fallback `Arial` o `system-ui` con overrides calibrados correspondientes.
- Para `JetBrains Mono`: Fallback `Courier New` o `monospace`.

**Criterios de Aceptación:**
- El cambio entre la fuente de respaldo del sistema y la fuente web descargada no produce desplazamiento visible del bloque de texto ni variación superior a 0.005 en la métrica CLS (Cumulative Layout Shift) en Lighthouse.

### RF-06 — Micro-tipografía Global en `@layer base`
La composición tipográfica de periódicos debe aplicarse de forma declarativa e inherente en `src/index.css` dentro de `@layer base`:
- **Encabezados (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`):**
  - `text-wrap: balance` (para distribuir uniformemente las líneas de los titulares y evitar saltos antiestéticos).
  - Optimización tipográfica: `text-rendering: optimizeLegibility`, `font-feature-settings: "liga", "kern"`.
- **Párrafos (`p`):**
  - Alineación `text-align: left` por defecto para evitar "ríos de espacio en blanco".
  - `text-wrap: pretty` (para eliminar viudas y huérfanas en las últimas líneas de columnas).
- **Columnas Editoriales Especiales (clase utilitaria dedicada `.editorial-column`):**
  - `text-align: justify` con `hyphens: auto` reservado exclusivamente para bloques de maquetación periodística específica.
- **Datos, Fechas y Cifras (`table`, `time`, `.tabular`, snippets de métricas):**
  - `font-variant-numeric: tabular-nums lining-nums` para que los números compartan un ancho idéntico y conserven la alineación vertical.

**Criterios de Aceptación:**
- La maquetación de un artículo con etiquetas estándar HTML (`<h1>`, `<p>`, `<time>`) adopta estas propiedades sin necesidad de agregar manualmente clases como `.text-balance` en cada nodo.
- Los navegadores que no soporten `text-wrap: balance` o `pretty` degradan de forma transparente a las reglas normales de corte de texto sin romper la renderización.

---

## 4. Requisitos No Funcionales (NFR)

### RNF-01 — Estrategia de Carga Crítica de Fuentes (Optimización del FCP)
- **Precarga Prioritaria:** El documento `index.html` debe incluir etiquetas `<link rel="preload" as="font" type="font/woff2" crossorigin>` únicamente para las dos variantes más críticas del primer render: `Playfair Display Bold` (Titular principal) e `Inter Regular` (Texto inicial).
- **Cero Bloqueo de Red:** Eliminación absoluta de peticiones a dominios de terceros (`fonts.googleapis.com` y `fonts.gstatic.com`). Todas las fuentes se sirven desde el mismo origen (o CDN CloudFront en AWS en Fase 6).
- **Métrica Objetivo FCP:** El First Contentful Paint debe mantenerse en < 0.8s en condiciones de red simuladas estándar (Fast 4G / Desktop).

### RNF-02 — Presupuesto de Rendimiento y Assets (Performance Budget)
- El peso acumulado de todas las fuentes `.woff2` transferidas en la carga inicial no superará los **150 KB**.
- Ninguna regla CSS de micro-tipografía debe inducir repintados forzados en el hilo principal durante el scroll o la animación de vuelta de página.

### RNF-03 — Compatibilidad y Degradación Elegante
- Las definiciones en OKLCH deben acompañarse de mecanismos compatibles con navegadores modernos (> 2023). En entornos que no soporten OKLCH, Tailwind o PostCSS deben proveer fallbacks calculados si fuese necesario.
- La función `clamp()` debe tener valores de límite inferior y superior estrictos para evitar desbordamientos en pantallas ultra-pequeñas (320px) o ilegibilidad en pantallas ultra-anchas (> 1920px).

---

## 5. Decisiones de Alcance y Dudas Resueltas

1. **Gestión de Persistencia del Tema (Morning vs Evening Edition):**
   - **Resolución:** Sincronización inicial automática con `prefers-color-scheme` del SO. Se implementará un interruptor editorial minimalista en el masthead superior ("Morning Edition" / "Evening Edition") persistiendo la selección manual del usuario en `localStorage`.
2. **Estrategia de Assets y Subsetting de Caracteres en Woff2:**
   - **Resolución:** Empleo de paquetes NPM `@fontsource/playfair-display`, `@fontsource/inter` y `@fontsource/jetbrains-mono`. Se importarán exclusivamente los pesos indispensables y el subset `latin` optimizado (que ya incluye tildes, letras `ñ`, `¿`, `¡` y puntuación española).
3. **Control de Alineación y Ríos Blancos en Columnas:**
   - **Resolución:** Alineación a la izquierda (`text-align: left`) por defecto a nivel global con `text-wrap: pretty`. La justificación (`text-align: justify` con `hyphens: auto`) se reserva exclusivamente para la clase utilitaria `.editorial-column` en maquetaciones de periódicos que así lo requieran.

