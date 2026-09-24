# TASKS-002: Estética Editorial y Tipografía (Design Engineering)

**Plan:** [plan.md](./plan.md)  
**Spec:** [spec.md](./spec.md)  
**Estado:** Completado  
**Fecha:** 2026-09-24  

---

## Bloque 1 — Tríada Tipográfica Local y Dependencias Fontsource

- [x] **T01 — Registrar baseline de build y dependencias.**  
  **Bloque:** 1 | **RF:** RNF-01, RNF-02  
  Ejecutar `npm run build` para capturar el tamaño actual del bundle (JS + CSS) y verificar que no existan errores previos.  
  **Hecho cuando:** El tamaño actual del bundle está anotado en la sección "Métricas" al final de este documento y el build finaliza con exit code 0.

- [x] **T02 — Instalar paquetes tipográficos de Fontsource.**  
  **Bloque:** 1 | **RF:** RF-03, RNF-01  
  Ejecutar la instalación como dependencias de `@fontsource/playfair-display`, `@fontsource/inter` y `@fontsource/jetbrains-mono`.  
  **Hecho cuando:** Los 3 paquetes figuran en `package.json` bajo `dependencies` y `node_modules/@fontsource/*` existe en disco.

- [x] **T03 — Reemplazar `@import` de Google Fonts por imports locales en `src/index.css`.**  
  **Bloque:** 1 | **RF:** RF-03, RNF-01  
  Eliminar `@import url('https://fonts.googleapis.com/css2?...')` de la línea 1 de `src/index.css` e importar exclusivamente los pesos requeridos:  
  - Playfair Display: 400, 600, 700, 400-italic.  
  - Inter: 400, 500, 600.  
  - JetBrains Mono: 400, 500.  
  **Hecho cuando:** `grep "googleapis" src/index.css` devuelve 0 resultados y los archivos CSS de `@fontsource/*` son importados al inicio del archivo.

- [x] **T04 — Purgar metadatos Lovable y configurar preloads en `index.html`.**  
  **Bloque:** 1 | **RF:** RF-03, RNF-01  
  Actualizar `index.html`: actualizar `<title>` a `"The Minty Gazette — Marco Barzola | Portafolio Editorial"`, eliminar etiquetas meta residuales de Lovable y añadir directivas `<link rel="preload">` para los `.woff2` críticos (`playfair-display-latin-700` e `inter-latin-400`).  
  **Hecho cuando:** `grep -i "lovable" index.html` devuelve 0 resultados y las directivas `preload` están presentes en el `<head>`.

- [x] **T05 — Verificación de compilación del Bloque 1.**  
  **Bloque:** 1 | **RF:** RF-03, RNF-01, RNF-02  
  Ejecutar `npm run build` para asegurar que Vite empaqueta los assets `.woff2` correctamente sin errores de ruta ni advertencias de importación.  
  **Hecho cuando:** `npm run build` termina con código de salida 0 y genera los assets tipográficos en `dist/assets/`.

---

## Bloque 2 — Sistema de Tokens OKLCH Semánticos y Theming

- [x] **T06 — Definir variables CSS OKLCH para "Morning Edition" en `src/index.css`.**  
  **Bloque:** 2 | **RF:** RF-01, RF-02  
  Configurar en `:root` de `src/index.css` los tokens semánticos en formato `oklch(L C H)`:  
  - `paper`: `--paper-base: oklch(0.965 0.015 85)`, `--paper-elevated: oklch(0.985 0.010 85)`, `--paper-muted: oklch(0.930 0.020 85)`.  
  - `ink`: `--ink-headline: oklch(0.200 0.020 50)`, `--ink-body: oklch(0.300 0.015 50)`, `--ink-muted: oklch(0.520 0.015 50)`, `--ink-subtle: oklch(0.680 0.012 50)`.  
  - `mint`: `--mint-base: oklch(0.720 0.160 152)`, `--mint-hover: oklch(0.650 0.170 152)`, `--mint-contrast: oklch(0.150 0.020 50)`.  
  - `rule`: `--rule-bold: oklch(0.250 0.020 50)`, `--rule-light: oklch(0.820 0.015 85)`, `--rule-dashed: oklch(0.750 0.015 85)`.  
  Mantener mapeo puente para variables shadcn legadas (`--background`, etc.) para no romper vistas no refactorizadas aún.  
  **Hecho cuando:** Las variables `--paper-*`, `--ink-*`, `--mint-*` y `--rule-*` existen en `:root` con valores puros en `oklch(...)`.

- [x] **T07 — Definir variables CSS OKLCH para "Evening Edition" en `src/index.css`.**  
  **Bloque:** 2 | **RF:** RF-01, RF-02  
  Configurar bajo el selector `.dark` de `src/index.css` los tokens para modo oscuro: carbón cálido (`--paper-base: oklch(0.200 0.015 60)`, `--paper-elevated: oklch(0.240 0.015 60)`), tinta pergamino (`--ink-headline: oklch(0.950 0.010 85)`, `--ink-body: oklch(0.850 0.010 85)`), menta nocturno (`--mint-base: oklch(0.780 0.150 152)`) y reglas divisoras oscuras, garantizando ausencia de `#000000` puro.  
  **Hecho cuando:** La regla `.dark` contiene los mismos tokens semánticos que `:root` con valores calibrados para contraste WCAG AA.

- [x] **T08 — Exponer paleta semántica editorial en `tailwind.config.ts`.**  
  **Bloque:** 2 | **RF:** RF-01, RF-02  
  Configurar en `theme.extend.colors` los objetos `paper`, `ink`, `mint` y `rule` referenciando las variables CSS correspondientes mediante sintaxis segura (permitiendo opacidades con `/ <alpha-value>`).  
  **Hecho cuando:** `tailwind.config.ts` exporta `colors.paper`, `colors.ink`, `colors.mint` y `colors.rule` y no contiene valores hexadecimales ni HSL estáticos.

- [x] **T09 — Verificación de compilación del Bloque 2.**  
  **Bloque:** 2 | **RF:** RF-01, RF-02  
  Ejecutar `npm run build` y comprobar que Tailwind procesa correctamente los tokens OKLCH sin emitir advertencias de PostCSS.  
  **Hecho cuando:** `npm run build` finaliza con código de salida 0.

---

## Bloque 3 — Escala Tipográfica Fluida (Ratio 1.333 - Perfect Fourth) y Zero CLS

- [x] **T10 — Declarar fallbacks métricos calibrados para Zero CLS en `src/index.css`.**  
  **Bloque:** 3 | **RF:** RF-05, RNF-01  
  Crear en `src/index.css` reglas `@font-face` con `font-family: 'Playfair-Fallback'` (usando `src: local('Georgia')`) y `font-family: 'Inter-Fallback'` (usando `src: local('Arial'), local('system-ui')`), aplicando overrides métricos (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) para igualar las métricas de las fuentes web.  
  **Hecho cuando:** Las definiciones de fallbacks `@font-face` están presentes en `src/index.css`.

- [x] **T11 — Configurar `fontFamily` con fallbacks métricos en `tailwind.config.ts`.**  
  **Bloque:** 3 | **RF:** RF-03, RF-05  
  Definir en `theme.extend.fontFamily`:  
  - `headline`: `['Playfair Display', 'Playfair-Fallback', 'Georgia', 'serif']`.  
  - `body`: `['Inter', 'Inter-Fallback', 'system-ui', 'sans-serif']`.  
  - `mono`: `['JetBrains Mono', 'Courier New', 'monospace']`.  
  **Hecho cuando:** Los 3 stacks tipográficos están configurados en `tailwind.config.ts`.

- [x] **T12 — Configurar escala fluida con `clamp()` (Ratio 1.333) en `tailwind.config.ts`.**  
  **Bloque:** 3 | **RF:** RF-04  
  Configurar en `theme.extend.fontSize` los tokens fluidos: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `caption`, `mono-sm`, cada uno con su tupla de `[clamp(...), { lineHeight, letterSpacing }]`.  
  **Hecho cuando:** `fontSize` contiene los 8 tokens matemáticos con `clamp()` validados para el rango 320px–1280px.

- [x] **T13 — Verificación de compilación del Bloque 3.**  
  **Bloque:** 3 | **RF:** RF-04, RF-05  
  Ejecutar `npm run build` para asegurar que las definiciones de `fontSize` y `fontFamily` son sintácticamente válidas.  
  **Hecho cuando:** `npm run build` finaliza con código de salida 0.

---

## Bloque 4 — Micro-tipografía Global y Resets Editoriales

- [x] **T14 — Inyectar micro-tipografía en `@layer base` de `src/index.css`.**  
  **Bloque:** 4 | **RF:** RF-06  
  Añadir a `@layer base`:  
  - `h1, h2, h3, h4, h5, h6`: `text-wrap: balance; text-rendering: optimizeLegibility; font-feature-settings: "liga", "kern"; font-family: var(--font-headline);`.  
  - `p`: `text-align: left; text-wrap: pretty;`.  
  - `time, table, .tabular-nums`: `font-variant-numeric: tabular-nums lining-nums;`.  
  **Hecho cuando:** Las propiedades están presentes en `@layer base` dentro de `src/index.css`.

- [x] **T15 — Crear clase utilitaria `.editorial-column` y calibrar textura de papel.**  
  **Bloque:** 4 | **RF:** RF-06  
  Definir en `src/index.css` la clase `.editorial-column { text-align: justify; hyphens: auto; }` y ajustar `--paper-texture` para que opere con `mix-blend-mode: multiply` en modo claro y `mix-blend-mode: overlay` en modo oscuro.  
  **Hecho cuando:** La clase `.editorial-column` está disponible y la variable de textura funciona en ambos modos.

- [x] **T16 — Verificación de compilación del Bloque 4.**  
  **Bloque:** 4 | **RF:** RF-06  
  Ejecutar `npm run build` y verificar que el linter y compilador procesen las reglas CSS sin warnings.  
  **Hecho cuando:** `npm run build` finaliza con código de salida 0.

---

## Bloque 5 — Switch Conmutador de Edición y Persistencia

- [x] **T17 — Crear hook `src/hooks/useTheme.ts`.**  
  **Bloque:** 5 | **RF:** RF-02  
  Implementar el hook que:  
  1. Detecte tema inicial (lectura de `localStorage.getItem('gazette-theme')` o `window.matchMedia('(prefers-color-scheme: dark)')`).  
  2. Alterne la clase `.dark` en `document.documentElement`.  
  3. Exponga `{ theme, isDark, toggleTheme }`.  
  **Hecho cuando:** `src/hooks/useTheme.ts` existe, tiene tipado TypeScript estricto y exporta la lógica de conmutación.

- [x] **T18 — Incorporar script anti-parpadeo (FOUC prevent) en `index.html`.**  
  **Bloque:** 5 | **RF:** RF-02  
  Inyectar un `<script>` inline síncrono y mínimo en el `<head>` de `index.html` que lea `localStorage` y añada la clase `dark` al elemento `<html>` antes del primer pintado.  
  **Hecho cuando:** El script está colocado en `index.html` antes de cualquier asset de estilos o React.

- [x] **T19 — Integrar botón de conmutación de edición en `src/components/NewspaperMasthead.tsx`.**  
  **Bloque:** 5 | **RF:** RF-02  
  Añadir al header del masthead un control accesible (con `aria-label`, soporte para teclado y tooltip semántico) que muestre "Morning Edition" o "Evening Edition" e invoque `toggleTheme()`.  
  **Hecho cuando:** El control es visible en el masthead, permite alternar la clase `.dark` y responde a navegación por teclado.

- [x] **T20 — Verificación de compilación y pruebas del Bloque 5.**  
  **Bloque:** 5 | **RF:** RF-02  
  Ejecutar `npm run build` y `npm run test` para verificar que la inclusión del hook y el conmutador no rompen ningún test existente.  
  **Hecho cuando:** Build y tests finalizan con 0 errores.

---

## Bloque 6 — Refactorización de Componentes de Negocio y Validación Final

- [x] **T21 — Refactorizar `src/components/FrontPage.tsx` con tokens OKLCH y escala fluida.**  
  **Bloque:** 6 | **RF:** RF-01, RF-04  
  Actualizar clases en `FrontPage.tsx`: reemplazar `bg-paper` por `bg-paper-base`, `text-ink` por `text-ink-headline` / `text-ink-body`, `border-ink/20` por `border-rule-light`, y adoptar los tokens fluidos `text-display` y `text-h1` en el titular principal.  
  **Hecho cuando:** `FrontPage.tsx` no utiliza clases huérfanas o valores mágicos de color.

- [x] **T22 — Refactorizar `src/components/TechStackSection.tsx` con tokens OKLCH y `font-mono`.**  
  **Bloque:** 6 | **RF:** RF-01, RF-03, RF-04  
  Actualizar `TechStackSection.tsx` para emplear la paleta semántica (`paper`, `ink`, `rule`), tipografía `font-mono` para tecnologías/badges y escala fluida.  
  **Hecho cuando:** Las etiquetas técnicas y badges utilizan `font-mono` y los fondos respetan `bg-paper-elevated`.

- [x] **T23 — Refactorizar `src/components/ProjectsSection.tsx` con tokens OKLCH y números tabulares.**  
  **Bloque:** 6 | **RF:** RF-01, RF-04, RF-06  
  Actualizar `ProjectsSection.tsx`: aplicar `font-mono tabular-nums` a métricas, números de caso de estudio y fechas, e integrar tokens `paper-card` y `rule-bold`.  
  **Hecho cuando:** Todas las métricas numéricas exhiben alineación monoespaciada tabular y los colores provienen del espacio OKLCH.

- [x] **T24 — Refactorizar `src/components/ClassifiedsSection.tsx` y detalles restantes.**  
  **Bloque:** 6 | **RF:** RF-01, RF-06  
  Actualizar `ClassifiedsSection.tsx`: aplicar `border-rule-dashed`, tokens de texto `ink-muted` y badges interactivos con acento `mint-base`.  
  **Hecho cuando:** La sección de clasificados emplea la nueva semántica y no quedan referencias a variables HSL legadas.

- [x] **T25 — Verificación y auditoría de accesibilidad WCAG 2.1 AA (Contraste ≥ 4.5:1).**  
  **Bloque:** 6 | **RF:** RF-01, RF-02, Principio 4  
  Calcular y auditar formalmente los ratios de contraste de todos los pares de color (`ink-headline`/`paper-base`, `ink-body`/`paper-base`, `ink-muted`/`paper-base`, `mint-contrast`/`mint-base`) tanto en Morning Edition como en Evening Edition.  
  **Hecho cuando:** Todos los pares superan 4.5:1 (texto estándar) y 3.0:1 (texto grande), registrando la tabla de contrastes en este documento.

- [x] **T26 — Build final de producción, pruebas y registro de métricas.**  
  **Bloque:** 6 | **RF:** Todos  
  Ejecutar `npm run build` y `npm run test`. Registrar el tamaño final del bundle y verificar que no existan advertencias ni dependencias no resueltas.  
  **Hecho cuando:** `npm run build` completa en 0 errores, la suite de pruebas finaliza en verde y se actualiza la tabla de métricas comparativas.

---

## Métricas de Rendimiento y Contraste

### Tamaño del Bundle
| Métrica | Baseline (Fase 1) | Fase 2 (Tipografía + OKLCH) | Diferencia / Análisis |
|---|---|---|---|
| CSS total | 20.70 kB (5.15 kB gzip) | **29.68 kB** (6.53 kB gzip) | +8.98 kB (+1.38 kB gzip) por tokens OKLCH, escala fluida y font-faces |
| JS total | 416.69 kB (130.06 kB gzip) | **420.47 kB** (130.83 kB gzip) | +3.78 kB (+0.77 kB gzip) por hook useTheme y control de tema |
| Fuentes locales (.woff2) | 0 KB (Google Fonts CDN) | **46.88 KB** precargadas críticas | Cero dependencias externas; FCP y CLS 100% autónomos |

### Auditoría de Contraste WCAG 2.1 AA
| Token Texto | Token Fondo | Modo | Ratio Medido | Estado (≥ 4.5:1) |
|---|---|---|---|---|
| `ink-headline` | `paper-base` | Morning | **16.41:1** | ✅ Pasa WCAG AAA |
| `ink-body` | `paper-base` | Morning | **12.37:1** | ✅ Pasa WCAG AAA |
| `ink-muted` | `paper-base` | Morning | **5.00:1** | ✅ Pasa WCAG AA |
| `mint-contrast` | `mint-base` | Morning | **8.48:1** | ✅ Pasa WCAG AAA |
| `ink-headline` | `paper-base` | Evening | **15.67:1** | ✅ Pasa WCAG AAA |
| `ink-body` | `paper-base` | Evening | **11.47:1** | ✅ Pasa WCAG AAA |
| `ink-muted` | `paper-base` | Evening | **6.29:1** | ✅ Pasa WCAG AAA |
| `mint-contrast` | `mint-base` | Evening | **10.44:1** | ✅ Pasa WCAG AAA |
