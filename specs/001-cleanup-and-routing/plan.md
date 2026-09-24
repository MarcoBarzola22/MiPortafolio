# PLAN-001: Limpieza de Código Base y Sistema de Navegación por Páginas

**Spec:** [spec.md](./spec.md)  
**Estado:** Borrador  
**Fecha:** 2026-09-24  

---

## 0. Resumen Ejecutivo

Este plan descompone la SPEC-001 en 5 bloques secuenciales y atómicos. El orden es deliberado: primero auditamos para no romper nada, luego purgamos lo muerto, después recableamos la aplicación sin router, implementamos la navegación con animaciones y, por último, migramos a React 19 sobre una base limpia.

---

## 1. Inventario del Código Base Actual

### 1.1 Estructura de archivos relevante

```
src/
├── App.tsx              ← Punto de entrada con boilerplate Lovable
├── App.css              ← Boilerplate de Vite (sin uso real)
├── main.tsx             ← Entry point (limpio)
├── index.css            ← Tokens CSS + animaciones + variables sidebar huérfanas
├── vite-env.d.ts        ← Types de Vite
├── assets/              ← 4 imágenes (profile + 3 proyectos) → CONSERVAR
├── lib/
│   └── utils.ts         ← Función cn() que depende de clsx + tailwind-merge
├── hooks/
│   ├── use-toast.ts     ← Importa de ui/toast → EVALUAR en auditoría
│   └── use-mobile.tsx   ← EVALUAR uso
├── components/
│   ├── FrontPage.tsx       ← Negocio. Imports: assets. Sin deps de ui/.
│   ├── NewspaperMasthead.tsx ← Negocio. Imports: react (useState). Sin deps de ui/.
│   ├── TechStackSection.tsx ← Negocio. Imports: lucide-react. Sin deps de ui/.
│   ├── ProjectsSection.tsx  ← Negocio. Imports: react, lucide-react, assets. Sin deps de ui/.
│   ├── ClassifiedsSection.tsx ← Negocio. Imports: lucide-react. Sin deps de ui/.
│   ├── NavLink.tsx          ← ELIMINAR: depende de react-router-dom + cn()
│   └── ui/                  ← 49 componentes shadcn/ui → AUDITADOS: 0 usados por negocio
├── pages/
│   ├── Index.tsx         ← Orquestador de secciones + animación
│   └── NotFound.tsx      ← Depende de react-router-dom → ELIMINAR
└── test/                 ← EVALUAR contenido
```

### 1.2 Resultado de la auditoría de dependencias

**Auditoría ejecutada manualmente vía `grep` en todo `src/`:**

| Componente de negocio | Importa de `ui/`? | Importa `@radix-ui/*`? |
|---|---|---|
| FrontPage.tsx | ❌ | ❌ |
| NewspaperMasthead.tsx | ❌ | ❌ |
| TechStackSection.tsx | ❌ | ❌ |
| ProjectsSection.tsx | ❌ | ❌ |
| ClassifiedsSection.tsx | ❌ | ❌ |
| Index.tsx (orquestador) | ❌ | ❌ |

**Únicos consumidores de `ui/`:** `App.tsx` (Toaster, Sonner, TooltipProvider) — estos wrappers serán eliminados/reemplazados al recablear App.tsx.

**Conclusión de la auditoría:** Los 49 componentes de `ui/` y la función `cn()` de `lib/utils.ts` son **100% huérfanos** respecto a los componentes de negocio. `NavLink.tsx` es un wrapper de `react-router-dom` que no se usa en el periódico. `App.css` es boilerplate de Vite sin uso.

### 1.3 Mapa de dependencias a purgar vs. conservar

| Dependencia | Veredicto | Justificación |
|---|---|---|
| `lovable-tagger` (dev) | 🔴 PURGAR | Plugin propietario de Lovable en `vite.config.ts` |
| `tailwindcss-animate` (dev) | 🔴 PURGAR | Solo alimenta keyframes de accordion (Radix). Nuestras animaciones ya están en `index.css` |
| `@tailwindcss/typography` (dev) | 🟡 EVALUAR | ¿Se usa la clase `prose` en algún componente? Si no → purgar |
| `react-router-dom` | 🔴 PURGAR | Solo usado en `NavLink.tsx` (a eliminar) y `App.tsx` (a recablear) |
| `@tanstack/react-query` | 🔴 PURGAR | Solo usado en `App.tsx` wrapper. Datos son estáticos |
| `class-variance-authority` | 🔴 PURGAR | Solo usado en componentes `ui/` huérfanos |
| `clsx` | 🔴 PURGAR | Solo usado en `lib/utils.ts` (función `cn` a eliminar) |
| `tailwind-merge` | 🔴 PURGAR | Solo usado en `lib/utils.ts` (función `cn` a eliminar) |
| `cmdk` | 🔴 PURGAR | Solo usado en `ui/command.tsx` (huérfano) |
| `date-fns` | 🔴 PURGAR | Solo usado en `ui/calendar.tsx` (huérfano) |
| `embla-carousel-react` | 🔴 PURGAR | Solo usado en `ui/carousel.tsx` (huérfano) |
| `input-otp` | 🔴 PURGAR | Solo usado en `ui/input-otp.tsx` (huérfano) |
| `next-themes` | 🔴 PURGAR | No se usa en ningún componente de negocio |
| `react-day-picker` | 🔴 PURGAR | Solo usado en `ui/calendar.tsx` (huérfano) |
| `react-hook-form` | 🔴 PURGAR | Solo usado en `ui/form.tsx` (huérfano) |
| `@hookform/resolvers` | 🔴 PURGAR | Dependencia de `react-hook-form` |
| `react-resizable-panels` | 🔴 PURGAR | Solo usado en `ui/resizable.tsx` (huérfano) |
| `recharts` | 🔴 PURGAR | Solo usado en `ui/chart.tsx` (huérfano) |
| `vaul` | 🔴 PURGAR | Solo usado en `ui/drawer.tsx` (huérfano) |
| Todos los `@radix-ui/*` (20 paquetes) | 🔴 PURGAR del manifiesto | Ninguno importado por componentes de negocio. `sonner` los trae como transitivas propias |
| `lucide-react` | 🟢 CONSERVAR | Usado en TechStack, Projects, Classifieds (iconos vectoriales) |
| `zod` | 🟢 CONSERVAR | Necesario para validación de formulario de contacto (fase futura) |
| `sonner` | 🟢 CONSERVAR | Feedback accesible. Trae Radix como dependencia transitiva (aceptado) |

### 1.4 Archivos raíz a purgar

| Archivo | Razón |
|---|---|
| `components.json` | Configuración de shadcn/ui CLI |
| `bun.lockb` | Lockfile de Bun (usaremos npm) |
| `App.css` | Boilerplate de Vite sin uso en el periódico |
| `postcss.config.js` | Evaluar: si Tailwind 3 lo requiere, conservar; si no, purgar |

---

## 2. Decisiones Técnicas y Trade-offs

### DT-01: ¿Por qué no eliminamos Tailwind CSS?

**Decisión:** Conservar Tailwind CSS v3 + PostCSS.  
**Trade-off:** Tailwind añade una dependencia de build y un layer de abstracción sobre CSS. Sin embargo, los 6 componentes de negocio están escritos enteramente con clases utilitarias de Tailwind (`className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12"`). Reescribirlos en CSS Vanilla ahora sería trabajo innecesario sin valor funcional. La Constitución (Principio 2) dice "el diseño base en Tailwind se adaptará", no "se reescribirá".  
**Riesgo mitigado:** Limpiaremos la configuración de Tailwind eliminando tokens de sidebar, keyframes de accordion, y el plugin `tailwindcss-animate`. Consolidaremos las animaciones en `index.css` como fuente de verdad.

### DT-02: Gestión de estado para navegación (sin librería)

**Decisión:** Estado local con `useState` + `useReducer` en el componente orquestador.  
**Trade-off:** No usamos una librería de estado global (Zustand, Jotai) porque el estado de navegación es simple: un índice de página activa (0-3), un flag de animación en curso, y la dirección de la transición. `useReducer` da más seguridad que múltiples `useState` para transiciones de estado complejas (evita estados intermedios inválidos).  
**Alternativa descartada:** Context API — innecesario para estado que no cruza más de 2 niveles de profundidad.

### DT-03: Orquestación de animación con `onAnimationEnd` (no `setTimeout`)

**Decisión:** Reemplazar los `setTimeout` encadenados por el evento nativo `onAnimationEnd` del DOM.  
**Trade-off:** `onAnimationEnd` sincroniza la lógica con el ciclo real de animación del navegador, eliminando el riesgo de desfase entre la duración CSS y el delay JS. Es más robusto ante throttling de tabs inactivos (donde `setTimeout` pierde precisión). La desventaja es que requiere más cuidado con la limpieza de listeners, pero en React esto se maneja declarativamente con props `onAnimationEnd`.  
**Efecto visual:** Idéntico al actual. La secuencia sigue siendo: flip-out → cambio de contenido → flip-in. Solo cambia la orquestación interna.

### DT-04: Detección de swipe sin librería

**Decisión:** Implementación propia con `touchstart`/`touchmove`/`touchend` via un hook personalizado.  
**Trade-off:** Evitamos agregar una dependencia (~5-15KB) para un caso de uso simple: detectar dirección horizontal + umbral mínimo. El hook encapsulará la lógica de detección (distancia mínima: ~50px, velocidad mínima) y expondrá callbacks `onSwipeLeft`/`onSwipeRight`. La discriminación entre scroll vertical y swipe horizontal se hará comparando el ángulo del desplazamiento.  
**Riesgo:** Dispositivos con gestos de navegación del sistema (back swipe en iOS/Android). Mitigación: el umbral de distancia debe ser suficientemente alto para no interferir, y el swipe solo se registra dentro del área de contenido.

### DT-05: `prefers-reduced-motion`

**Decisión:** Cross-fade instantáneo (opacity 1→0→1) sin movimiento físico (sin `rotateY`, sin `scale`).  
**Trade-off:** Cumple WCAG 2.1 AA (criterio 2.3.3) sin degradar la experiencia. Los usuarios que optan por reducir movimiento siguen viendo un cambio de contenido claro, solo sin el efecto 3D.  
**Implementación:** Media query `@media (prefers-reduced-motion: reduce)` que sobreescribe las keyframes a solo opacidad, o una clase condicional basada en el hook `useMediaQuery`.

### DT-06: Sticky masthead

**Decisión:** CSS `position: sticky` con `top: 0` y `z-index` controlado.  
**Trade-off:** `position: sticky` es nativo del navegador, no requiere JS, y tiene soporte universal en los browsers target. La altura del masthead debe compensarse con `scroll-padding-top` o `padding-top` en el contenido para que no quede oculto detrás.  
**Riesgo:** El masthead actual incluye el título "THE PORTFOLIO TIMES" + la barra de fecha + la nav. Si todo es sticky, ocupa mucho viewport vertical en móvil. **Propuesta:** Solo la barra de navegación (`<nav>`) será sticky, no el masthead completo. Esto requiere separar el header decorativo del nav funcional.

---

## 3. Plan de Ejecución (Bloques Secuenciales)

> Cada bloque produce un build limpio (`npm run build` sin errores) antes de avanzar al siguiente.

### Bloque 1 — Purga de archivos y dependencias huérfanas
**RF cubiertos:** RF-01  
**Objetivo:** Eliminar todo código muerto y reducir el árbol de dependencias al mínimo viable.

**Tareas:**
1. Eliminar `src/components/ui/` (49 archivos, 0 usados por negocio).
2. Eliminar `src/components/NavLink.tsx` (depende de `react-router-dom`, no se usa).
3. Eliminar `src/pages/NotFound.tsx` (depende de `react-router-dom`).
4. Eliminar `src/hooks/use-toast.ts` (importa de `ui/toast`, huérfano).
5. Evaluar y decidir sobre `src/hooks/use-mobile.tsx`.
6. Eliminar `src/lib/utils.ts` (función `cn` con deps de `clsx` + `tailwind-merge`).
7. Eliminar `src/App.css` (boilerplate de Vite sin uso).
8. Eliminar `components.json` (configuración shadcn CLI).
9. Eliminar `bun.lockb` (lockfile de Bun; usamos npm).
10. Limpiar `vite.config.ts`: eliminar import y uso de `lovable-tagger`.
11. Limpiar `tailwind.config.ts`: eliminar keyframes de `accordion-down`/`accordion-up`, eliminar plugin `tailwindcss-animate`, eliminar tokens de `sidebar`, eliminar token `popover` si no se usa.
12. Limpiar `index.css`: eliminar variables CSS `--sidebar-*` y tokens no utilizados por componentes de negocio.
13. Ejecutar `npm uninstall` para todas las dependencias a purgar (ver tabla §1.3).
14. Ejecutar `npm run build` y verificar 0 errores, 0 warnings.
15. Registrar el tamaño del bundle antes y después para RNF-02.

### Bloque 2 — Recableado de App.tsx (eliminación de router y wrappers)
**RF cubiertos:** RF-02  
**Objetivo:** Reducir App.tsx a su mínima expresión: un render directo del orquestador de páginas.

**Tareas:**
1. Reescribir `App.tsx`: eliminar `BrowserRouter`, `Routes`, `Route`, `QueryClientProvider`, `TooltipProvider`, `Toaster`, `Sonner`. Renderizar directamente el componente orquestador (actualmente `Index.tsx`).
2. Mover la lógica de `src/pages/Index.tsx` a un componente raíz adecuado (ej. renombrar o integrar en App). Eliminar el directorio `pages/` si queda vacío.
3. Configurar `sonner` directamente en el nuevo App.tsx sin los wrappers de shadcn.
4. Ejecutar `npm run build` y verificar 0 errores.

### Bloque 3 — Sistema de navegación por estado
**RF cubiertos:** RF-03, RF-04, RF-05, RF-06, RF-08, RF-09  
**Objetivo:** Implementar toda la lógica de navegación entre secciones usando estado de React, sin router.

**Tareas:**
1. Refactorizar el estado del orquestador: reemplazar los múltiples `useState` por un `useReducer` con tipo discriminado que maneje `currentPage`, `isAnimating`, `direction` (forward/backward), y `animationPhase` (idle/flipping-out/flipping-in/bouncing).
2. Implementar la separación del masthead: extraer la barra `<nav>` como componente independiente que soporte `position: sticky`. El header decorativo (título, fecha, volumen) queda por encima, no sticky.
3. Implementar navegación por teclado: hook `useKeyboardNavigation` que escuche `ArrowLeft`/`ArrowRight` a nivel de `window`, respete el bloqueo durante animación, e ignore eventos cuando el foco está en un `<input>`, `<textarea>` o `[contenteditable]`.
4. Implementar detección de swipe táctil: hook `useSwipeDetection` con `touchstart`/`touchmove`/`touchend`, umbral de distancia (~50px), discriminación de ángulo (horizontal vs. vertical), y callbacks `onSwipeLeft`/`onSwipeRight`.
5. Implementar feedback de rebote en límites: animación CSS de sacudida/rebote (`@keyframes bounce-edge`) activada cuando se intenta navegar más allá de la primera o última sección. Duración ≤ 300ms, solo `transform`.
6. Garantizar que el scroll vertical no dispara cambios de página (RF-09): el swipe detection hook debe ignorar gestos que sean predominantemente verticales.
7. Ejecutar `npm run build` y verificar 0 errores.

### Bloque 4 — Animación de vuelta de página (refactorización)
**RF cubiertos:** RF-07  
**Objetivo:** Reemplazar la orquestación por `setTimeout` con sincronización nativa vía `onAnimationEnd`.

**Tareas:**
1. Mantener los `@keyframes page-flip-out` y `page-flip-in` actuales de `index.css` (el efecto visual no cambia).
2. Eliminar los keyframes duplicados de `tailwind.config.ts` (fuente de verdad: `index.css`).
3. Refactorizar el orquestador para usar `onAnimationEnd`: al disparar una transición, aplicar la clase `animate-page-flip-out`. Cuando el evento `animationend` se dispare, cambiar el contenido y aplicar `animate-page-flip-in`. Cuando el segundo `animationend` se dispare, volver al estado idle.
4. Implementar soporte para `prefers-reduced-motion`: media query que reemplace las keyframes de flip por un cross-fade instantáneo (solo opacidad, sin rotación 3D). Alternativamente, hook `useReducedMotion` que cambie la clase de animación aplicada.
5. Verificar que todas las animaciones usen exclusivamente `transform` y `opacity` (compositor GPU). La animación `unfold` actual usa `filter: blur()` — evaluar si viola esta regla y proponer alternativa.
6. Ejecutar `npm run build` y verificar 0 errores.

### Bloque 5 — Migración a React 19
**RF cubiertos:** RF-10  
**Objetivo:** Actualizar React y React-DOM a v19, resolver conflictos de peer dependencies.

**Tareas:**
1. Actualizar `react` y `react-dom` a la última versión estable de React 19.
2. Actualizar `@types/react` y `@types/react-dom` a las versiones compatibles con React 19.
3. Actualizar `@vitejs/plugin-react-swc` a la versión compatible con React 19.
4. Verificar compatibilidad de `lucide-react`, `sonner` y `zod` con React 19. Si hay conflictos de peer dependencies:
   - **Estrategia preferida:** Actualizar la dependencia a una versión compatible.
   - **Estrategia fallback:** Usar `overrides` en `package.json` para forzar la versión de React, documentando la razón en un comentario.
   - **Último recurso:** `--legacy-peer-deps` (documentar el riesgo).
5. Revisar breaking changes de React 19 que afecten nuestro código:
   - `forwardRef` deprecated → verificar que no se use en componentes conservados.
   - Nuevo comportamiento de `ref` como prop → adaptar si aplica.
   - Cambios en `useEffect` cleanup timing → verificar hooks personalizados.
6. Ejecutar `npm run build` y verificar 0 errores, 0 warnings.
7. Ejecutar la aplicación en dev y verificar que las 4 secciones, la animación de flip, el teclado y el swipe funcionan idéntico a antes de la migración.

---

## 4. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| `sonner` no es compatible con React 19 | Media | Alto | Verificar changelog de sonner antes de migrar. Si falla, implementar toast accesible propio (~50 líneas con `role="alert"` + `aria-live`) |
| `lucide-react` tiene peer dep de React 18 | Media | Bajo | Los icon components son puros SVG, suelen funcionar sin cambios. Usar `overrides` si hay warnings |
| La animación `unfold` usa `filter: blur()` (no es propiedad de compositor) | Confirmado | Medio | Evaluar si causa jank medible. Si sí, reemplazar por una alternativa con solo `transform`/`opacity`. Si el impacto es imperceptible (solo ocurre 1 vez al cargar), conservar con comentario documentando la excepción |
| Separar la nav del masthead rompe el layout visual | Baja | Medio | La separación es solo estructural (DOM), no visual. Usar CSS para mantener la apariencia idéntica cuando no hay scroll |
| Swipe interfiere con scroll horizontal de proyectos | Alta | Alto | El hook de swipe solo se activa en el contenedor principal. El carrusel horizontal de `ProjectsSection.tsx` usa su propio `scrollRef`, y el swipe detection debe excluir elementos con `overflow-x: auto/scroll` |

---

## 5. Criterios de Éxito (Definition of Done)

- [ ] `npm run build` produce 0 errores y 0 warnings.
- [ ] `package.json` contiene exactamente: `react@19`, `react-dom@19`, `lucide-react`, `zod`, `sonner` como dependencias de producción, más Tailwind/Vite/TypeScript como dev.
- [ ] No existe ningún archivo en `src/components/ui/`.
- [ ] No existe `components.json`, `bun.lockb`, ni `App.css`.
- [ ] `vite.config.ts` no contiene referencias a `lovable-tagger`.
- [ ] La navegación funciona por click en nav, flechas de teclado y swipe táctil.
- [ ] La animación de flip se orquesta con `onAnimationEnd`, no con `setTimeout`.
- [ ] `prefers-reduced-motion: reduce` produce un cross-fade instantáneo sin movimiento 3D.
- [ ] El scroll vertical no dispara cambios de página.
- [ ] La barra de navegación es sticky al hacer scroll.
- [ ] Intentar navegar más allá de los límites produce un micro-feedback de rebote.
- [ ] El tamaño del bundle se ha reducido respecto al baseline (registrar ambos valores).
