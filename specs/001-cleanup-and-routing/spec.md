# SPEC-001: Limpieza de Código Base y Sistema de Navegación por Páginas

**Estado:** Aprobada  
**Fase:** 1  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../docs/constitution.md) — Principios 1, 3, 4, 6

---

## 1. Contexto y Objetivo

El portafolio "The Minty Gazette" fue generado inicialmente con Lovable, una plataforma No-Code que inyecta dependencias propietarias, componentes genéricos (shadcn/ui) y patrones de orquestación frágiles. El código base actual contiene **~50 dependencias** (de las cuales ~40 son innecesarias) y **49 componentes UI huérfanos** que ningún componente de negocio utiliza.

**Objetivo de la Fase 1:** Establecer una base de código soberana, mínima y estable que conserve el diseño editorial actual del periódico, implemente un sistema de navegación robusto con animación de "vuelta de página" accesible, y migre la aplicación a React 19.

**Por qué ahora:** Refactorizar sobre una base contaminada genera deuda técnica compuesta. Cada componente nuevo escrito hoy sobre dependencias huérfanas costará doble cuando las eliminemos mañana. La purga primero, la construcción después.

---

## 2. Historias de Usuario

| ID    | Como…                   | Quiero…                                                              | Para…                                                                  |
|-------|-------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------|
| HU-01 | Visitante (desktop)     | navegar entre secciones del periódico con clicks en la barra superior | explorar el contenido de forma intuitiva y editorial                   |
| HU-02 | Visitante (desktop)     | usar las flechas ← / → del teclado para pasar de sección            | navegar sin depender del ratón (accesibilidad)                         |
| HU-03 | Visitante (móvil)       | deslizar horizontalmente para cambiar de sección                     | navegar de forma natural y táctil en mi dispositivo                    |
| HU-04 | Visitante (cualquiera)  | ver una animación fluida de "vuelta de página" al cambiar de sección | sentir que estoy hojeando un periódico real                            |
| HU-05 | Visitante (cualquiera)  | hacer scroll vertical para leer el contenido extenso de una sección  | consumir toda la información sin que el scroll me cambie de página     |
| HU-06 | Visitante (cualquiera)  | que la barra de navegación permanezca visible al hacer scroll        | poder cambiar de sección en cualquier momento sin volver al inicio     |
| HU-07 | Desarrollador           | que el proyecto compile sin warnings, sin dependencias huérfanas     | tener confianza en que el build es limpio y desplegable                |

---

## 3. Requisitos Funcionales

### RF-01 — Auditoría y purga de dependencias propietarias
**Cuando** se ejecute `npm install && npm run build`, **el sistema debe** completar sin referencias a paquetes eliminados, sin warnings de dependencias faltantes y sin errores de compilación.

**Criterios de aceptación:**
- **Paso previo obligatorio:** Antes de eliminar cualquier archivo o dependencia, se ejecutará una auditoría automatizada que identifique qué componentes de `ui/` y qué paquetes `@radix-ui/*` son realmente importados (directa o transitivamente) por los componentes de negocio. Los que la auditoría detecte como utilizados se conservan; los huérfanos se eliminan.
- Toda dependencia propietaria de Lovable está eliminada del manifiesto (incluyendo `lovable-tagger`, `components.json` y scripts asociados).
- Las siguientes dependencias se eliminan por no tener justificación funcional: `@hookform/resolvers`, `@tanstack/react-query`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `react-router-dom`, `recharts`, `tailwind-merge`, `tailwindcss-animate`, `vaul`. Los paquetes `@radix-ui/*` se eliminan **solo si la auditoría confirma que no son importados** por componentes conservados o por `sonner`.
- Las siguientes dependencias se conservan con justificación documentada: `lucide-react` (iconos vectoriales en componentes de negocio), `zod` (validación de formulario de contacto), `sonner` (feedback accesible al usuario; sus dependencias transitivas de Radix son aceptables).
- Los componentes de `ui/` que la auditoría detecte como huérfanos se eliminan. Los que sean utilizados por componentes de negocio se conservan y refactorizan para ser modulares y limpios.

### RF-02 — Eliminación del enrutamiento por URL
**Cuando** la aplicación se cargue en el navegador, **el sistema debe** renderizar todas las secciones bajo una única URL raíz (`/`) sin depender de un router de URLs.

**Criterios de aceptación:**
- La navegación entre secciones se gestiona exclusivamente mediante estado interno de la aplicación (índice de página activa).
- No existe ninguna dependencia de enrutamiento por URLs en el código fuente.
- La recarga del navegador en `/` siempre muestra la primera sección (FrontPage).

### RF-03 — Navegación por click en barra superior (masthead)
**Cuando** el usuario haga click en un enlace de navegación del masthead, **el sistema debe** disparar la animación de vuelta de página y mostrar la sección correspondiente.

**Criterios de aceptación:**
- El masthead contiene enlaces a las 4 secciones: FrontPage, Tech Stack, Projects, Classifieds.
- El enlace de la sección activa tiene un indicador visual distinguible.
- Un click en la sección ya activa no dispara animación (no-op).

### RF-04 — Barra de navegación sticky
**Mientras** el usuario hace scroll vertical dentro de una sección, **el sistema debe** mantener la barra de navegación (masthead) fija en la parte superior del viewport.

**Criterios de aceptación:**
- El masthead permanece visible y accesible en todo momento durante el scroll vertical.
- El contenido de la sección no queda oculto detrás del masthead (compensación de altura).
- El comportamiento sticky no interfiere con la animación de vuelta de página.

### RF-05 — Navegación por teclado
**Cuando** el usuario presione la tecla `→` (ArrowRight), **el sistema debe** navegar a la siguiente sección con animación de vuelta de página. **Cuando** presione `←` (ArrowLeft), **el sistema debe** navegar a la sección anterior.

**Criterios de aceptación:**
- Las flechas de teclado funcionan independientemente de qué elemento tenga el foco, salvo cuando el foco esté en un campo de texto editable.
- La navegación por teclado respeta el bloqueo durante la animación (no se acumulan transiciones).
- El orden de navegación es secuencial: FrontPage → Tech Stack → Projects → Classifieds.

### RF-06 — Navegación por swipe táctil
**Cuando** el usuario realice un gesto de swipe horizontal en un dispositivo táctil, **el sistema debe** navegar a la sección adyacente en la dirección del gesto con animación de vuelta de página.

**Criterios de aceptación:**
- Swipe hacia la izquierda → avanza a la siguiente sección.
- Swipe hacia la derecha → retrocede a la sección anterior.
- Existe un umbral mínimo de distancia y velocidad del gesto para distinguirlo de un scroll vertical o un toque accidental.
- El swipe horizontal no interfiere con el scroll vertical del contenido.

### RF-07 — Animación de vuelta de página
**Cuando** se dispare un cambio de sección (por cualquier método de navegación), **el sistema debe** ejecutar una transición animada que simule el efecto visual de pasar la página de un periódico.

**Criterios de aceptación:**
- El efecto visual es consistente con el comportamiento actual (secuencia flip-out / cambio de contenido / flip-in).
- La orquestación de la animación no depende de temporizadores arbitrarios (`setTimeout`); se sincroniza con los eventos del ciclo de animación del navegador.
- Durante la animación, todos los métodos de navegación se bloquean para evitar estados intermedios inválidos.
- La animación se ejecuta exclusivamente mediante propiedades `transform` y `opacity` (compositor GPU).

### RF-08 — Feedback visual en límites de navegación
**Cuando** el usuario intente navegar más allá de la primera o la última sección (por teclado o swipe), **el sistema debe** reproducir un micro-feedback visual sutil (rebote o sacudida) que comunique que se ha alcanzado el límite, sin cambiar de página.

**Criterios de aceptación:**
- El feedback se ejecuta en la primera sección al intentar retroceder y en la última al intentar avanzar.
- La animación de rebote usa exclusivamente `transform`/`opacity` (GPU).
- El feedback es perceptible pero no intrusivo (duración ≤ 300ms).

### RF-09 — Scroll vertical reservado al contenido
**Mientras** el usuario esté dentro de una sección, **el sistema debe** permitir scroll vertical libre para leer el contenido, sin que este gesto dispare cambios de sección.

**Criterios de aceptación:**
- El scroll con rueda de ratón, trackpad vertical o gesto vertical táctil desplaza exclusivamente el contenido de la sección activa.
- En ningún caso el scroll vertical produce un cambio de página.

### RF-10 — Migración a React 19
**Cuando** se complete la purga de dependencias y se estabilice la navegación, **el sistema debe** actualizarse a React 19 manteniendo toda la funcionalidad existente.

**Criterios de aceptación:**
- Las dependencias `react` y `react-dom` se actualizan a la versión 19 estable.
- Si alguna dependencia conservada (`lucide-react`, `sonner`, `zod`) presenta conflictos de peer dependencies, se resuelve de forma documentada (estrategia a definir en el Plan).
- `npm run build` produce un bundle limpio sin warnings ni errores tras la migración.
- Todas las animaciones y la navegación funcionan de forma idéntica tras la migración.

---

## 4. Requisitos No Funcionales

### RNF-01 — Rendimiento de animaciones
- Toda animación de vuelta de página y micro-feedback debe mantener **60 fps** constantes.
- Solo se animan propiedades que el navegador puede ejecutar en el **compositor GPU** (`transform`, `opacity`).
- El hilo principal (main thread) no debe bloquearse durante las animaciones.

### RNF-02 — Peso del bundle
- El bundle final tras la purga debe ser **significativamente menor** que el actual. La reducción se medirá comparando el output de `npm run build` antes y después.

### RNF-03 — Accesibilidad (WCAG 2.1 AA)
- Los elementos de navegación del masthead deben tener roles ARIA y labels descriptivos.
- La sección activa debe ser anunciada a lectores de pantalla al cambiar de página.
- El contraste de los indicadores de navegación activa/inactiva cumple ratio ≥ 4.5:1.
- La navegación por teclado es completa: el usuario puede acceder a todo el contenido sin ratón ni pantalla táctil.

### RNF-04 — Compatibilidad
- Navegadores: última versión estable de Chrome, Firefox, Safari y Edge.
- Dispositivos: viewport desde 320px (móvil) hasta 1920px (desktop).

---

## 5. Casos Límite

| Caso | Comportamiento esperado |
|------|------------------------|
| Click rápido múltiple en distintas secciones del nav | La animación en curso se completa antes de aceptar nueva entrada. No se acumulan transiciones. |
| Swipe horizontal durante una animación en curso | El gesto se ignora hasta que la animación actual finalice. |
| Flechas ← en FrontPage / → en Classifieds | Micro-feedback de rebote (RF-08). No cambia de sección. |
| Usuario con `prefers-reduced-motion: reduce` | Se omite la animación de vuelta de página y se aplica un cambio instantáneo mediante opacidad cruzada (cross-fade rápido), sin movimiento físico. |
| Pérdida de foco en la ventana durante una animación | La animación se completa normalmente. Al regresar el foco, el estado es consistente. |
| Teclado: usuario escribiendo en un hipotético campo de búsqueda o contacto | Las flechas ←/→ no disparan navegación cuando el foco está en un input de texto. |
| Rotación de dispositivo durante una animación | La animación se completa y el layout se recalcula al tamaño del nuevo viewport. |

---

## 6. Dudas Abiertas

- ~~`prefers-reduced-motion`~~ **RESUELTA:** Cross-fade instantáneo, sin movimiento físico.
- ~~`sonner` y Radix transitivo~~ **RESUELTA:** Aceptable. `sonner` conserva sus dependencias transitivas de Radix; no reinventamos toasts accesibles.

---

## 7. Fuera de Alcance (Fase 1)

Los siguientes ítems quedan explícitamente fuera de esta fase:

- Contenido real de los casos de estudio (se conserva el contenido actual tal como está).
- Formulario de contacto funcional (la sección Classifieds se conserva visualmente, la funcionalidad de envío se implementará en una fase posterior).
- Configuración OKLCH y escala tipográfica (corresponde a la Fase de Estética Editorial, posterior a esta limpieza).
- Despliegue en AWS (S3 + CloudFront).
- Integración de axe-core en CI.
- SEO y meta tags.
- Dots indicadores en el footer (descartados; si se desean en el futuro, se especifican aparte).
