# PLAN-002: Estética Editorial y Tipografía (Design Engineering)

**Spec:** [spec.md](./spec.md)  
**Estado:** Aprobado  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 1, 2, 4, 6  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 2, 3, 4, 5

---

## 0. Resumen Ejecutivo

Este plan descompone la SPEC-002 en 6 bloques secuenciales y atómicos. El propósito es transformar "The Minty Gazette" en un artefacto editorial con tipografía fluida de alta precisión y un sistema de color puramente perceptual en espacio OKLCH. 

La ejecución se divide con rigor: primero instalamos y aislamos las fuentes locales eliminando Google Fonts; luego configuramos la arquitectura matemática de tokens OKLCH ("Morning" y "Evening Edition"); definimos la escala fluida `clamp()` con ratio Perfect Fourth (1.333) y fallbacks Zero CLS; inyectamos la micro-tipografía global en `@layer base`; integramos el conmutador de edición en el Masthead; y finalmente adaptamos los componentes de negocio existentes para erradicar cualquier clase o color legado.

---

## 1. Inventario del Código Base Actual

### 1.1 Archivos a intervenir

```
src/
├── index.css                  ← ELIMINAR @import Google Fonts; DEFINIR variables OKLCH, @font-face overrides, micro-tipografía
├── components/
│   ├── NewspaperMasthead.tsx  ← INTEGRAR switch de edición "Morning / Evening Edition" + tipografía fluida
│   ├── FrontPage.tsx          ← REFACTORIZAR tokens HSL legados a semántica editorial (paper, ink, mint, rule)
│   ├── TechStackSection.tsx   ← ADAPTAR a escala fluida, JetBrains Mono y tokens OKLCH
│   ├── ProjectsSection.tsx    ← ADAPTAR métricas a tabular-nums, fuentes mono y tokens OKLCH
│   └── ClassifiedsSection.tsx ← ADAPTAR micro-tipografía y bordes rule
├── hooks/
│   └── useTheme.ts            ← CREAR hook minimalista para Morning/Evening con prefers-color-scheme y localStorage
index.html                     ← ELIMINAR metadatos Lovable; AÑADIR preloads para fuentes críticas .woff2
package.json                   ← AÑADIR dependencias @fontsource (playfair-display, inter, jetbrains-mono)
tailwind.config.ts             ← RECONFIGURAR familias tipográficas, escala fluida y colores en espacio OKLCH
```

### 1.2 Auditoría del estado actual de estilos y colores

- `index.css`: Contiene `@import url('https://fonts.googleapis.com/css2?...')` en la línea 1 (bloqueante). Variables `:root` usan canales HSL desarticulados (`--background: 43 33% 94%`, `--primary: 142 69% 58%`).
- `tailwind.config.ts`: Define colores `paper`, `mint`, `ink` en formato HSL hardcodeado mezclado con referencias `hsl(var(--...))`. `fontFamily` solo define `headline` e `body` sin fallback métrico ni soporte monoespaciado formal.
- Componentes de negocio: Utilizan combinaciones ad-hoc de Tailwind como `bg-paper`, `text-ink`, `border-ink/20`, `font-headline`, `font-body`.

---

## 2. Decisiones Técnicas y Trade-offs

### DT-01: Auto-hospedaje de fuentes vía `@fontsource` en lugar de CDN o descarga manual
- **Decisión:** Instalar `@fontsource/playfair-display`, `@fontsource/inter` y `@fontsource/jetbrains-mono` como dependencias de build de NPM.
- **Trade-off:** Añade paquetes a `node_modules` (~15 MB en disco durante desarrollo), pero Vite empaqueta únicamente los archivos `.woff2` efectivamente importados hacia `dist/assets/` con hash inmutable de caché.
- **Beneficio:** 
  1. Cero peticiones externas a `fonts.googleapis.com` (cumple Principio 6: build estático autónomo para S3/CloudFront).
  2. Subsets latinos limpios y optimizados (soporte total de caracteres en español: tildes, `ñ`, `¿`, `¡`).
  3. Control total del Critical Rendering Path y de las cabeceras de preload.

### DT-02: Formulación de Tokens Semánticos en Espacio OKLCH
- **Decisión:** Definir colores mediante variables CSS con formato `oklch(L C H)` y variantes con canal alfa `oklch(L C H / <alpha-value>)`.
- **Valores matemáticos calibrados:**
  - **Morning Edition (Papel Claro):**
    - `--paper-base`: `oklch(0.965 0.015 85)` (Tono papel prensa cálido, no blanco clínico).
    - `--paper-elevated`: `oklch(0.985 0.010 85)` (Superficie de tarjeta con contraste sutil).
    - `--paper-muted`: `oklch(0.930 0.020 85)` (Contenedores secundarios).
    - `--ink-headline`: `oklch(0.200 0.020 50)` (Tinta carbón profunda, contraste > 11:1).
    - `--ink-body`: `oklch(0.300 0.015 50)` (Lectura prolongada, contraste > 7.5:1).
    - `--ink-muted`: `oklch(0.520 0.015 50)` (Metadatos, contraste > 4.6:1 WCAG AA).
    - `--mint-base`: `oklch(0.720 0.160 152)` (Verde menta distintivo).
    - `--rule-bold`: `oklch(0.250 0.020 50)` (Línea editorial principal).
    - `--rule-light`: `oklch(0.820 0.015 85)` (Líneas de separación internas).
  - **Evening Edition (Carbón Tintado / Dark Mode):**
    - `--paper-base`: `oklch(0.200 0.015 60)` (Carbón tintado con calidez natural, jamás `#000000`).
    - `--paper-elevated`: `oklch(0.240 0.015 60)` (Superficie elevada).
    - `--paper-muted`: `oklch(0.170 0.015 60)` (Superficie rehundida).
    - `--ink-headline`: `oklch(0.950 0.010 85)` (Tinta pergamino luminosa, contraste > 10:1).
    - `--ink-body`: `oklch(0.850 0.010 85)` (Texto general, contraste > 7.0:1).
    - `--ink-muted`: `oklch(0.680 0.010 85)` (Metadatos nocturnos, contraste > 4.5:1).
    - `--mint-base`: `oklch(0.780 0.150 152)` (Menta ajustado para legibilidad en fondo oscuro).
    - `--rule-bold`: `oklch(0.400 0.015 60)`.
    - `--rule-light`: `oklch(0.280 0.015 60)`.
- **Trade-off:** Requiere soporte de CSS Color Module Level 4 en el navegador (soportado universalmente desde 2023 en Chrome 111+, Safari 15.4+, Firefox 113+).

### DT-03: Escala Tipográfica Fluida Matemática (Ratio 1.333 - Perfect Fourth)
- **Decisión:** Utilizar fórmulas matemáticas con CSS `clamp(min, preferred, max)` en lugar de clases de breakpoint redundantes (`text-2xl md:text-4xl lg:text-6xl`).
- **Rango de viewport base:** $V_{min} = 320\text{px}$ (móvil) a $V_{max} = 1280\text{px}$ (desktop estándar).
- **Progresión geométrica (Base: 16px desktop / 15px móvil):**
  - `display`: $15 \times 1.333^4 \approx 47.4\text{px}$ (móvil) $\rightarrow$ $16 \times 1.333^5 \approx 67.2\text{px}$ (desktop).
  - `h1`: $15 \times 1.333^3 \approx 35.5\text{px}$ (móvil) $\rightarrow$ $16 \times 1.333^4 \approx 50.4\text{px}$ (desktop).
  - `h2`: $15 \times 1.333^2 \approx 26.6\text{px}$ (móvil) $\rightarrow$ $16 \times 1.333^3 \approx 37.8\text{px}$ (desktop).
  - `h3`: $15 \times 1.333^1 \approx 20.0\text{px}$ (móvil) $\rightarrow$ $16 \times 1.333^2 \approx 28.4\text{px}$ (desktop).
  - `body-lg`: $16\text{px}$ (móvil) $\rightarrow$ $20\text{px}$ (desktop).
  - `body`: $15\text{px}$ (móvil) $\rightarrow$ $16\text{px}$ (desktop).
  - `small` / `caption`: $13\text{px}$ (móvil) $\rightarrow$ $13.5\text{px}$ (desktop).
  - `mono-sm`: $12.5\text{px}$ (móvil) $\rightarrow$ $13\text{px}$ (desktop).
- **Fórmula de pendiente fluida:**
  $$\text{preferred} = \text{min} + (\text{max} - \text{min}) \times \frac{100\text{vw} - V_{min}}{V_{max} - V_{min}}$$

### DT-04: Estrategia Zero CLS con Font Metrics Overrides
- **Decisión:** Declarar fuentes de fallback del sistema calibradas mediante `@font-face` con `size-adjust`, `ascent-override`, `descent-override` y `line-gap-override`.
- **Mapeo:**
  - `Playfair Display Fallback`: Basado en `Georgia` del sistema, ajustando la altura de x y el ascent para emparejar la métrica exacta de Playfair Display.
  - `Inter Fallback`: Basado en `Arial` / `system-ui`, neutralizando el desplazamiento vertical al hacer `swap`.
- **Beneficio:** CLS = 0 garantizado incluso en conexiones lentas donde la fuente tarda cientos de milisegundos en renderizar.

### DT-05: Theming Morning/Evening sin re-renders en React
- **Decisión:** La alternancia de tema se gestiona mutando la clase `.dark` en `document.documentElement` y guardando la preferencia en `localStorage`.
- **Beneficio:** Ningún componente React necesita recalcularse ni suscribirse a contextos pesados; los cambios de color ocurren instantáneamente por herencia CSS en el motor del navegador a 60 fps.

---

## 3. Plan de Ejecución (Bloques Secuenciales)

### Bloque 1 — Tríada Tipográfica Local y Dependencias Fontsource
**RF cubiertos:** RF-03, RNF-01, RNF-02  
**Objetivo:** Instalar los paquetes tipográficos, importar exclusivamente los pesos necesarios en `src/index.css` y erradicar todo llamado a Google Fonts.

**Tareas:**
1. Instalar `@fontsource/playfair-display`, `@fontsource/inter` y `@fontsource/jetbrains-mono`.
2. Reemplazar la línea 1 de `src/index.css` (`@import url('https://fonts.googleapis.com/...')`) por las importaciones modulares de Fontsource:
   - Playfair Display: 400, 600, 700, 400-italic.
   - Inter: 400, 500, 600.
   - JetBrains Mono: 400, 500.
3. Actualizar `index.html`:
   - Eliminar metadatos huérfanos de Lovable.
   - Configurar título oficial: `"The Minty Gazette — Marco Barzola | Portafolio Editorial"`.
   - Incorporar directivas de precarga prioritaria `<link rel="preload">` para los `.woff2` críticos de primer render (`playfair-display-latin-700-normal.woff2` e `inter-latin-400-normal.woff2`).
4. Ejecutar `npm run build` y verificar resolución correcta de assets estáticos sin warnings.

---

### Bloque 2 — Sistema de Tokens OKLCH Semánticos y Theming
**RF cubiertos:** RF-01, RF-02  
**Objetivo:** Configurar las variables CSS en formato OKLCH para Morning y Evening Edition y exponerlas en `tailwind.config.ts`.

**Tareas:**
1. Reescribir el bloque `:root` en `src/index.css`:
   - Declarar variables `--paper-base`, `--paper-elevated`, `--paper-muted`.
   - Declarar variables `--ink-headline`, `--ink-body`, `--ink-muted`, `--ink-subtle`.
   - Declarar variables `--mint-base`, `--mint-hover`, `--mint-contrast`.
   - Declarar variables `--rule-bold`, `--rule-light`, `--rule-dashed`.
2. Declarar el bloque `.dark` en `src/index.css` con la paleta Evening Edition (carbón cálido `oklch(0.200 0.015 60)` sin negros puros, tinta clara pergamino).
3. Mantener compatibilidad temporal mapeando las variables de utilidad de shadcn existentes (`--background`, `--foreground`, etc.) a los nuevos tokens OKLCH para evitar roturas visuales imprevistas.
4. Actualizar `tailwind.config.ts`:
   - Configurar la paleta `colors` bajo la estructura semántica `paper`, `ink`, `mint`, `rule`.
   - Habilitar `darkMode: ["class"]`.
5. Ejecutar `npm run build` y verificar compilación limpia.

---

### Bloque 3 — Escala Tipográfica Fluida (Perfect Fourth) y Zero CLS
**RF cubiertos:** RF-04, RF-05, RNF-03  
**Objetivo:** Implementar la escala modular con `clamp()` y los fallbacks métricos calibrados en CSS y Tailwind.

**Tareas:**
1. Crear en `src/index.css` las definiciones `@font-face` para los fallbacks con overrides métricos (`Playfair-Fallback` con `Georgia`, `Inter-Fallback` con `Arial/system-ui`).
2. Configurar `fontFamily` en `tailwind.config.ts`:
   - `headline`: `['Playfair Display', 'Playfair-Fallback', 'Georgia', 'serif']`.
   - `body`: `['Inter', 'Inter-Fallback', 'system-ui', 'sans-serif']`.
   - `mono`: `['JetBrains Mono', 'Courier New', 'monospace']`.
3. Configurar `fontSize` en `tailwind.config.ts` con la escala fluida en `clamp()`:
   - `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `caption`, `mono-sm`.
   - Asociar a cada token su respectivo `lineHeight` y `letterSpacing` calibrado.
4. Ejecutar `npm run build` y verificar que las clases generadas correspondan a los tokens planificados.

---

### Bloque 4 — Micro-tipografía Global y Resets Editoriales
**RF cubiertos:** RF-06  
**Objetivo:** Inyectar en `@layer base` las reglas tipográficas que transforman el texto estándar en composición periodística.

**Tareas:**
1. Configurar en `@layer base` de `src/index.css`:
   - Encabezados `h1`, `h2`, `h3`, `h4`, `h5`, `h6`: `text-wrap: balance`, `text-rendering: optimizeLegibility`, `font-feature-settings: "liga", "kern"`.
   - Párrafos `p`: `text-align: left`, `text-wrap: pretty`.
   - Números y datos `time`, `table`, `code`, `.tabular-nums`: `font-variant-numeric: tabular-nums lining-nums`.
2. Crear clase utilitaria `.editorial-column` con `text-align: justify` y `hyphens: auto` para columnas específicas.
3. Actualizar la textura sutil del papel (`--paper-texture`) para que funcione armónicamente tanto en modo Morning como en Evening.
4. Ejecutar `npm run build` y verificar 0 errores.

---

### Bloque 5 — Switch Conmutador de Edición y Persistencia
**RF cubiertos:** RF-02  
**Objetivo:** Implementar el hook `useTheme` y el interruptor visual en el `NewspaperMasthead`.

**Tareas:**
1. Crear `src/hooks/useTheme.ts`:
   - Leer preferencia inicial de `localStorage` o en su defecto `window.matchMedia('(prefers-color-scheme: dark)')`.
   - Exponer `theme` ('morning' | 'evening'), función `toggleTheme()` y sincronizar la clase `.dark` en `document.documentElement`.
2. Integrar en `src/components/NewspaperMasthead.tsx` un control minimalista con estética de gaceta ("Morning Edition / Evening Edition" o icono sol/luna editorial sutil) con atributos ARIA y navegación por teclado.
3. Ejecutar `npm run build` y verificar funcionamiento sin hydration errors ni parpadeos.

---

### Bloque 6 — Refactorización de Componentes de Negocio y Validación Final
**RF cubiertos:** RF-01, RF-02, RF-04, RF-06, RNF-01, RNF-02  
**Objetivo:** Actualizar el marcado de las secciones para adoptar los nuevos tokens y verificar accesibilidad WCAG AA.

**Tareas:**
1. Revisar y adaptar los componentes de negocio:
   - `FrontPage.tsx`: Actualizar titulares a `text-display` / `text-h1`, aplicar tokens `bg-paper-base`, `text-ink-headline`, `border-rule-bold`.
   - `TechStackSection.tsx`: Usar fuentes `font-mono` para tecnologías, badges y métricas.
   - `ProjectsSection.tsx`: Formatear números y métricas con `font-mono tabular-nums`.
   - `ClassifiedsSection.tsx`: Utilizar separadores `border-rule-dashed` y tokens de tinta.
2. Comprobar manualmente y con analizador de contraste que todas las combinaciones de `paper` e `ink` cumplen ≥ 4.5:1 en Morning y Evening Edition.
3. Ejecutar suite de pruebas `npm run test` y `npm run build`.

---

## 4. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Incompatibilidad de `@fontsource` en el empaquetado de Vite | Baja | Medio | Vite maneja assets de `node_modules` de forma nativa. Importar directamente los archivos `.css` de los pesos específicos evita empaquetar archivos no usados. |
| Incompatibilidad de `oklch()` en navegadores antiguos | Muy Baja | Bajo | Safari 15.4+, Chrome 111+ y Firefox 113+ (todos lanzados en 2022-2023) soportan OKLCH de forma nativa. Nuestro público objetivo son ingenieros de software y reclutadores técnicos con navegadores actualizados. |
| Saltos de línea inesperados con `text-wrap: balance` | Baja | Bajo | `text-wrap: balance` tiene un límite nativo del navegador de hasta 6 líneas; en bloques largos degrada automáticamente a renderizado estándar sin penalización. |
| Parpadeo visual (FOUC) del tema oscuro al recargar | Media | Medio | Inyectar un script bloqueante inline mínimo en el `<head>` de `index.html` que lea `localStorage` y aplique la clase `.dark` antes de que React monte la vista. |

---

## 5. Criterios de Éxito (Definition of Done)

- [ ] Cero dependencias y cero llamadas de red a `fonts.googleapis.com` o `fonts.gstatic.com`.
- [ ] Tres familias tipográficas locales (`Playfair Display`, `Inter`, `JetBrains Mono`) empaquetadas en formato `.woff2`.
- [ ] Variables CSS formuladas exclusivamente en `oklch()` para Morning Edition y Evening Edition.
- [ ] Ninguna superficie en Evening Edition usa negro puro `#000000`.
- [ ] Todos los pares de contraste texto/fondo verificados en ≥ 4.5:1 (WCAG 2.1 AA).
- [ ] Escala tipográfica fluida `clamp()` implementada en `tailwind.config.ts` basada en ratio Perfect Fourth (1.333).
- [ ] Fallbacks métricos calibrados para Zero CLS.
- [ ] Micro-tipografía editorial (`text-wrap: balance`, `pretty`, `tabular-nums`) activa en `@layer base`.
- [ ] Conmutador de edición funcional en `NewspaperMasthead` con persistencia en `localStorage`.
- [ ] Componentes de negocio refactorizados usando tokens semánticos `paper`, `ink`, `mint`, `rule`.
- [ ] `npm run build` y `npm run test` ejecutan con 0 errores y 0 warnings.
