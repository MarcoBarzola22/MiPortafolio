# TASKS-001: Limpieza de Código Base y Sistema de Navegación por Páginas

**Plan:** [plan.md](./plan.md)  
**Spec:** [spec.md](./spec.md)  
**Estado:** Pendiente  
**Última actualización:** 2026-09-24  

---

## Bloque 1 — Purga de archivos y dependencias huérfanas (RF-01)

- [ ] **T1 — Registrar baseline del bundle.**
  RF: RF-01 (RNF-02).
  Ejecutar `npm run build` y anotar el tamaño total del bundle (JS + CSS) en este archivo.
  Hecho cuando: el output de `npm run build` está capturado y el tamaño registrado en la sección "Métricas" al final de este documento.

- [ ] **T2 — Eliminar directorio `src/components/ui/` completo.**
  RF: RF-01.
  Borrar los 49 archivos de `src/components/ui/`. No tocar ningún otro archivo aún.
  Hecho cuando: `ls src/components/ui/` devuelve "directorio no encontrado" o equivalente.

- [ ] **T3 — Eliminar archivos huérfanos: `NavLink.tsx`, `NotFound.tsx`, `use-toast.ts`, `App.css`.**
  RF: RF-01, RF-02.
  Eliminar `src/components/NavLink.tsx`, `src/pages/NotFound.tsx`, `src/hooks/use-toast.ts` y `src/App.css`.
  Hecho cuando: `git ls-files src/components/NavLink.tsx src/pages/NotFound.tsx src/hooks/use-toast.ts src/App.css` no devuelve resultados.

- [ ] **T4 — Eliminar `src/lib/utils.ts` y verificar que ningún componente de negocio lo importa.**
  RF: RF-01.
  Borrar `src/lib/utils.ts` (función `cn` con deps `clsx` + `tailwind-merge`).
  Hecho cuando: `grep -r "lib/utils" src/` no devuelve resultados.

- [ ] **T5 — Evaluar y decidir sobre `src/hooks/use-mobile.tsx`.**
  RF: RF-01.
  Verificar si algún componente de negocio lo importa. Si no → eliminar. Si sí → conservar y documentar.
  Hecho cuando: `grep -r "use-mobile" src/` devuelve 0 resultados (si eliminado) o el archivo está documentado como conservado.

- [ ] **T6 — Eliminar archivos de configuración huérfanos en la raíz.**
  RF: RF-01.
  Eliminar `components.json` y `bun.lockb`.
  Hecho cuando: `ls components.json bun.lockb` confirma que no existen.

- [ ] **T7 — Limpiar `vite.config.ts`: eliminar `lovable-tagger`.**
  RF: RF-01.
  Eliminar el import de `lovable-tagger` y su uso en el array de plugins. Mantener el resto de la configuración intacta.
  Hecho cuando: `grep "lovable" vite.config.ts` devuelve 0 resultados.

- [ ] **T8 — Limpiar `tailwind.config.ts`: eliminar tokens y plugins huérfanos.**
  RF: RF-01.
  Eliminar: keyframes `accordion-down`/`accordion-up` y sus `animation` correspondientes, plugin `tailwindcss-animate` (y su `require`), tokens de `sidebar`, tokens de `popover` (verificar que no se usan). Conservar: keyframes de `page-flip-in` y `unfold`, tokens de color del periódico.
  Hecho cuando: `grep -E "accordion|tailwindcss-animate|sidebar" tailwind.config.ts` devuelve 0 resultados.

- [ ] **T9 — Limpiar `index.css`: eliminar variables CSS huérfanas.**
  RF: RF-01.
  Eliminar todas las variables `--sidebar-*`. Evaluar y eliminar variables `--popover` y `.dark` si no se usan en componentes de negocio.
  Hecho cuando: `grep "sidebar" src/index.css` devuelve 0 resultados.

- [ ] **T10 — Desinstalar todas las dependencias a purgar vía npm.**
  RF: RF-01.
  Ejecutar un solo comando `npm uninstall` con la lista completa: `@hookform/resolvers @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @tanstack/react-query class-variance-authority clsx cmdk date-fns embla-carousel-react input-otp next-themes react-day-picker react-hook-form react-resizable-panels react-router-dom recharts tailwind-merge tailwindcss-animate vaul lovable-tagger @tailwindcss/typography`.
  Hecho cuando: `npm ls --depth=0` lista solo `react`, `react-dom`, `lucide-react`, `zod`, `sonner` como dependencias de producción.

- [ ] **T11 — Ejecutar build de verificación post-purga.**
  RF: RF-01.
  Ejecutar `npm run build`. Resolver cualquier error de compilación causado por imports rotos (imports residuales a archivos eliminados).
  Hecho cuando: `npm run build` termina con exit code 0 y 0 warnings de dependencias.

---

## Bloque 2 — Recableado de App.tsx (RF-02)

- [ ] **T12 — Reescribir `App.tsx`: eliminar wrappers de Lovable.**
  RF: RF-02.
  Eliminar `BrowserRouter`, `Routes`, `Route`, `QueryClientProvider`, `TooltipProvider`, `Toaster` (shadcn). Reemplazar por un render directo del componente orquestador (contenido actual de `Index.tsx`). Configurar `Sonner` (de `sonner`) directamente.
  Hecho cuando: `grep -E "BrowserRouter|QueryClient|TooltipProvider|Routes" src/App.tsx` devuelve 0 resultados, y la app renderiza el periódico.

- [ ] **T13 — Consolidar orquestador: mover lógica de `Index.tsx` y eliminar directorio `pages/`.**
  RF: RF-02.
  Mover la lógica del orquestador de `src/pages/Index.tsx` a un componente adecuado (dentro de `src/` o integrarlo en `App.tsx`). Eliminar `src/pages/` si queda vacío.
  Hecho cuando: el directorio `src/pages/` no existe y `npm run build` pasa con exit code 0.

- [ ] **T14 — Build de verificación post-recableado.**
  RF: RF-02.
  Ejecutar `npm run build`. Verificar visualmente que la app carga en el navegador y muestra FrontPage.
  Hecho cuando: `npm run build` exit code 0 y la app renderiza el periódico en `npm run dev`.

---

## Bloque 3 — Sistema de navegación por estado (RF-03, RF-04, RF-05, RF-06, RF-08, RF-09)

- [ ] **T15 — Refactorizar estado del orquestador: reemplazar `useState` por `useReducer`.**
  RF: RF-03, RF-07.
  Crear un reducer con tipo discriminado para `NavigationState`: `{ currentPage, displayedPage, animationPhase, direction }`. Reemplazar los 4 `useState` actuales. Definir acciones: `NAVIGATE_TO`, `FLIP_OUT_COMPLETE`, `FLIP_IN_COMPLETE`, `BOUNCE_COMPLETE`.
  Hecho cuando: `grep "useState" src/` no devuelve hits relacionados con navegación (puede haber otros usos legítimos), y `npm run build` pasa.

- [ ] **T16 — Separar la barra `<nav>` del masthead y hacerla sticky.**
  RF: RF-04.
  Extraer la `<nav>` del `NewspaperMasthead.tsx` como componente separado (o restructurar internamente) para que solo la nav sea `position: sticky; top: 0`. Agregar `scroll-padding-top` al contenido para compensar la altura. Verificar que el header decorativo (título, fecha, volumen) no sea sticky.
  Hecho cuando: al hacer scroll vertical en una sección larga, la barra de nav permanece fija en el top y el título "THE PORTFOLIO TIMES" desaparece al hacer scroll.

- [ ] **T17 — Implementar hook `useKeyboardNavigation`.**
  RF: RF-05.
  Crear hook que escuche `keydown` en `window` para `ArrowLeft`/`ArrowRight`. Debe: respetar `isAnimating` (ignorar durante animación), ignorar cuando `document.activeElement` es un `input`/`textarea`/`[contenteditable]`, y despachar la acción `NAVIGATE_TO` al reducer.
  Hecho cuando: al presionar `→` en FrontPage se navega a Tech Stack, al presionar `←` en Tech Stack se vuelve a FrontPage, y al presionar flechas dentro de un input no pasa nada.

- [ ] **T18 — Implementar hook `useSwipeDetection`.**
  RF: RF-06, RF-09.
  Crear hook con `touchstart`/`touchmove`/`touchend`. Umbral de distancia ≥ 50px. Discriminar ángulo: si `|deltaY| > |deltaX|` → es scroll vertical, ignorar. Excluir elementos con `overflow-x: auto` o `overflow-x: scroll` (carrusel de proyectos). Exponer callbacks `onSwipeLeft`/`onSwipeRight`.
  Hecho cuando: en un dispositivo táctil (o emulador de Chrome DevTools), swipe horizontal cambia de sección, swipe vertical hace scroll de contenido, y swipe dentro del carrusel de proyectos hace scroll horizontal del carrusel.

- [ ] **T19 — Implementar animación de rebote en límites.**
  RF: RF-08.
  Crear `@keyframes bounce-edge` en `index.css` (solo `transform: translateX`, duración ≤ 300ms). Agregar fase `bouncing` al reducer. Cuando se intente navegar más allá de FrontPage (←) o Classifieds (→), disparar la animación de rebote en lugar de la de flip.
  Hecho cuando: al presionar `←` estando en FrontPage se ve un rebote sutil, al presionar `→` estando en Classifieds se ve un rebote sutil, y la animación dura ≤ 300ms.

- [ ] **T20 — Build de verificación post-navegación.**
  RF: RF-03, RF-04, RF-05, RF-06, RF-08, RF-09.
  Ejecutar `npm run build`. Verificar visualmente todos los métodos de navegación.
  Hecho cuando: `npm run build` exit code 0 y los 3 métodos de navegación (click, teclado, swipe) funcionan correctamente.

---

## Bloque 4 — Animación de vuelta de página (RF-07)

- [ ] **T21 — Eliminar keyframes duplicados de `tailwind.config.ts` y consolidar en `index.css`.**
  RF: RF-07.
  Las keyframes `page-flip-in` y `unfold` están definidas tanto en `index.css` como en `tailwind.config.ts`. Eliminar las de `tailwind.config.ts` y sus entradas `animation` correspondientes. La fuente de verdad es `index.css`.
  Hecho cuando: `grep -E "page-flip|unfold" tailwind.config.ts` devuelve 0 resultados y las animaciones siguen funcionando visualmente.

- [ ] **T22 — Refactorizar orquestación de animación: `onAnimationEnd` reemplaza `setTimeout`.**
  RF: RF-07.
  En el componente orquestador, reemplazar los `setTimeout` encadenados por props `onAnimationEnd` en el contenedor animado. La secuencia: 1) dispatch `NAVIGATE_TO` → aplica clase `animate-page-flip-out`, 2) `onAnimationEnd` → dispatch `FLIP_OUT_COMPLETE` → cambia contenido, aplica `animate-page-flip-in`, 3) `onAnimationEnd` → dispatch `FLIP_IN_COMPLETE` → estado idle.
  Hecho cuando: `grep "setTimeout" src/` devuelve 0 resultados relacionados con animaciones de navegación, y la animación de flip funciona visualmente idéntica.

- [ ] **T23 — Implementar soporte para `prefers-reduced-motion`.**
  RF: RF-07 (RNF-03).
  Agregar `@media (prefers-reduced-motion: reduce)` en `index.css` que sobreescriba las keyframes de flip por un cross-fade instantáneo (solo `opacity`, sin `rotateY` ni `scale`). Aplicar lo mismo a la animación `unfold` de entrada.
  Hecho cuando: en Chrome DevTools (Rendering → Emulate CSS media `prefers-reduced-motion: reduce`), el cambio de sección se realiza con un fade instantáneo sin movimiento 3D.

- [ ] **T24 — Evaluar animación `unfold` y su uso de `filter: blur()`.**
  RF: RF-07 (RNF-01).
  La Constitución exige exclusivamente `transform`/`opacity`. La animación `unfold` usa `filter: blur(10px)` en su fase inicial. Medir si causa jank con Performance tab de DevTools. Documentar la decisión: si es imperceptible (ocurre 1 vez), conservar con comentario; si causa frame drops, reemplazar por alternativa sin `filter`.
  Hecho cuando: la decisión está documentada como comentario en `index.css` junto al `@keyframes unfold`, y no hay frame drops visibles en Performance tab.

- [ ] **T25 — Build de verificación post-animación.**
  RF: RF-07.
  Ejecutar `npm run build`. Verificar visualmente la animación en modo normal y con reduced-motion.
  Hecho cuando: `npm run build` exit code 0 y ambos modos de animación funcionan.

---

## Bloque 5 — Migración a React 19 (RF-10)

- [ ] **T26 — Actualizar React y React-DOM a v19.**
  RF: RF-10.
  Ejecutar `npm install react@19 react-dom@19 @types/react@latest @types/react-dom@latest`. Actualizar `@vitejs/plugin-react-swc` si es necesario.
  Hecho cuando: `npm ls react` muestra la versión 19.x.x.

- [ ] **T27 — Resolver conflictos de peer dependencies.**
  RF: RF-10.
  Verificar que `lucide-react`, `sonner` y `zod` funcionan con React 19. Si hay conflictos: actualizar la dependencia a versión compatible, o agregar `overrides` en `package.json` documentando la razón.
  Hecho cuando: `npm install` completa sin errores de peer dependencies (o los overrides están documentados en `package.json`).

- [ ] **T28 — Revisar y adaptar breaking changes de React 19.**
  RF: RF-10.
  Buscar usos de APIs deprecadas: `forwardRef` (ahora ref es prop nativa), cambios en `useEffect` cleanup timing, string refs, default props. Adaptar si aplica.
  Hecho cuando: `grep -r "forwardRef" src/` devuelve 0 resultados (o los usos están actualizados) y `npm run build` pasa sin warnings de deprecation.

- [ ] **T29 — Build final y verificación completa.**
  RF: RF-10 (todos).
  Ejecutar `npm run build`. Verificar 0 errores, 0 warnings. Levantar `npm run dev` y hacer smoke test completo: las 4 secciones cargan, click en nav funciona, teclado funciona, animación de flip funciona, reduced-motion funciona, sticky nav funciona, rebote en límites funciona.
  Hecho cuando: `npm run build` exit code 0 con 0 warnings, y smoke test manual aprueba todos los criterios.

- [ ] **T30 — Registrar tamaño final del bundle y comparar con baseline.**
  RF: RNF-02.
  Ejecutar `npm run build` y registrar el tamaño final en la sección "Métricas" de este documento. Calcular la reducción porcentual respecto al baseline de T1.
  Hecho cuando: los tamaños están registrados abajo y la reducción es significativa.

---

## Métricas

| Medición | JS (gzip) | CSS (gzip) | Total |
|---|---|---|---|
| Baseline (T1) | — | — | — |
| Post-purga (T11) | — | — | — |
| Final (T30) | — | — | — |
| **Reducción** | — | — | **—** |
