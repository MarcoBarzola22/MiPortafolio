# TASKS-004: Identidad, Contenido Real e Internacionalización (i18n)

**Plan:** [plan.md](./plan.md)  
**Spec:** [spec.md](./spec.md)  
**Estado:** Completado  
**Fecha:** 2026-09-24  

---

## Bloque 1 — Tipos e Interfaces de Internacionalización

- [x] **T01 — Definir modelo de tipos de internacionalización en `src/types/i18n.ts`.**  
  **Bloque:** 1 | **Requisitos:** RF-03, Plan §2.1, QA #1, QA #2  
  Crear el archivo `src/types/i18n.ts` y exportar los tipos base para el motor i18n: `SupportedLanguage` (`'es' | 'en'`), `TranslationParams` (`Record<string, string | number>`), `TranslationKey` y la interfaz del contexto `I18nContextState`. Configurar la inferencia de tipos para que el diccionario maestro de español sea la fuente estricta del contrato.  
  **Hecho cuando:** `src/types/i18n.ts` compila limpiamente y exporta `SupportedLanguage`, `TranslationKey` e `I18nContextState`.

- [x] **T02 — Adaptar la interfaz `CaseStudy` para narrativas traducibles en `src/types/caseStudy.ts`.**  
  **Bloque:** 1 | **Requisitos:** RF-04, Plan §1, QA #1  
  Modificar `src/types/caseStudy.ts` para que los campos narrativos extensos (subtitular, lede, restricciones, trade-offs y descripciones de métricas) utilicen claves de traducción fuertemente tipadas (`TranslationKey`) o arrays de claves, manteniendo sin alterar los campos técnicos inmutables (id editorial, titular de proyecto, tags de tecnologías y valores cuantitativos de métricas).  
  **Hecho cuando:** `npx tsc --noEmit` valida que la interfaz `CaseStudy` admite referencias de traducción tipadas sin errores de sintaxis.

---

## Bloque 2 — Infraestructura del Motor i18n (Context & Hooks)

- [x] **T03 — Implementar el contexto y proveedor liviano `src/context/I18nContext.tsx`.**  
  **Bloque:** 2 | **Requisitos:** RF-03, RF-05, RA-01, CL-01, Plan §2.3, QA #4, QA #7  
  Crear `src/context/I18nContext.tsx` con React Context puro (cero librerías externas):  
  - Inicializar el estado de idioma leyendo de forma segura `localStorage.getItem('the-minty-gazette-lang')` envuelto en `try/catch` (fallback automático a `'es'`).  
  - Sincronizar en tiempo real los cambios en `localStorage.setItem`.  
  - Ejecutar `useLayoutEffect` para sincronizar de manera síncrona pre-paint los atributos `document.documentElement.lang` y `document.title` con el título traducido correspondiente.  
  - Memorizar el valor del contexto con `useMemo` para evitar re-renderizados innecesarios del árbol de la SPA.  
  **Hecho cuando:** El componente `I18nProvider` exporta el contexto y actualiza `<html lang>` en el DOM antes del pintado sin lanzar errores si `localStorage` está bloqueado.

- [x] **T04 — Implementar el hook de consumo con interpolación `src/hooks/useTranslation.ts`.**  
  **Bloque:** 2 | **Requisitos:** RF-03, CL-04, Plan §2.3, QA #2, QA #3  
  Crear el hook `useTranslation` que exponga `{ language, setLanguage, t }`:  
  - La función `t(key: TranslationKey, params?: TranslationParams): string` debe resolver el texto correspondiente del diccionario activo.  
  - Implementar reemplazo de tokens dinámicos con expresión regular ligera (`/\{(\w+)\}/g`), permitiendo interpolaciones como `{year}`.  
  - Incluir fallback seguro: si una clave no existe en el idioma activo, retornar su versión en español; si tampoco existe, retornar la propia `key` como texto.  
  **Hecho cuando:** `useTranslation` resuelve claves tipadas con autocompletado y sustituye correctamente parámetros dinámicos (`t('key', { year: 2026 })`).

---

## Bloque 3 — Diccionarios Estáticos y Vinculación de Datos

- [x] **T05 — Crear diccionario maestro en Español `src/data/locales/es.ts`.**  
  **Bloque:** 3 | **Requisitos:** RF-01, RF-04, Plan §2.2  
  Crear `src/data/locales/es.ts` con estructura plana y fuertemente tipada conteniendo el 100% de los textos en español:  
  - Metadatos de cabecera (*Masthead*).  
  - Datos reales de Marco Nicolas Barzola en Portada (titulares, subtitulares, lede, drop-cap, pie de foto y artículos secundarios).  
  - Clasificados completos (sobre el autor, formación en UNVIME, ubicación en Villa Mercedes, San Luis, disponibilidad y enlaces de contacto).  
  - Narrativas traducidas de los 3 casos de estudio (SmartForge, FitPlan Desktop, Interactive Digital Menu).  
  - Etiquetas de navegación, accesibilidad y textos de ayuda para lectores de pantalla (`aria-labels`).  
  **Hecho cuando:** `src/data/locales/es.ts` exporta la constante `es` con todas las claves requeridas y sin ningún texto de prueba ficticio.

- [x] **T06 — Crear diccionario en Inglés con validación estricta de paridad `src/data/locales/en.ts`.**  
  **Bloque:** 3 | **Requisitos:** RF-01, RF-04, Plan §2.2, QA #1  
  Crear `src/data/locales/en.ts` implementando el tipo `TranslationDictionary` derivado de `es.ts`:  
  - Traducir fielmente toda la narrativa editorial al inglés manteniendo la voz periodística y técnica.  
  - Preservar inalterados los nombres de proyectos y terminología técnica universal (`TypeScript`, `Docker`, `CI/CD`, `React`, `trade-offs`).  
  - Garantizar paridad exacta de claves (1:1).  
  **Hecho cuando:** `npx tsc --noEmit` compila sin errores demostrando que `en.ts` satisface estrictamente todas las claves de `es.ts`.

- [x] **T07 — Vincular `src/data/caseStudies.ts` con las claves de traducción.**  
  **Bloque:** 3 | **Requisitos:** RF-04, Plan §1, QA #1  
  Refactorizar el dataset `caseStudies` para que los textos narrativos de cada proyecto apunten a las claves registradas en los diccionarios, manteniendo la estructura inmutable y las métricas numéricas.  
  **Hecho cuando:** `src/data/caseStudies.ts` utiliza claves tipadas de traducción y compila sin advertencias de tipos.

---

## Bloque 4 — Estilos CSS, Transición GPU y Calibración de Contraste

- [x] **T08 — Implementar clases de doble capa de imagen y aislamiento táctil en `src/index.css`.**  
  **Bloque:** 4 | **Requisitos:** RF-02, Principio 3, Plan §3.1, §3.2, §3.3, QA #8, QA #11  
  En `src/index.css`:  
  - Definir las clases para la técnica de doble capa de imagen: capa base fija (`grayscale contrast-125`) y capa superior cálida (`sepia-50 contrast-110`).  
  - Configurar la animación de revelado aplicando la transición exclusivamente sobre `opacity: 0 → 1` en `300ms cubic-bezier(0.4, 0, 0.2, 1)`. Prohibir expresamente animar `filter`.  
  - Aislar la micro-interacción dentro de `@media (hover: hover)` para eliminar el *sticky hover* en pantallas táctiles.  
  - Definir la clase del fallback visual halftone con trama rayada editorial en CSS puro para contingencias de red.  
  **Hecho cuando:** En DevTools se verifica que el hover sobre el contenedor de imagen sólo altera la propiedad `opacity` en el compositor GPU.

- [x] **T09 — Calibrar token de contraste para textos muted en `src/index.css`.**  
  **Bloque:** 4 | **Requisitos:** RA-03, Principio 4, Plan §3.4, QA #12  
  Revisar y ajustar el valor OKLCH del token `ink-muted` (o clase tipográfica de apoyo para `text-caption` e itálicas) para certificar matemáticamente un ratio de contraste ≥ 4.5:1 respecto a los fondos `paper-base` y `paper-card` tanto en *Morning Edition* como en *Evening Edition*.  
  **Hecho cuando:** La medición de contraste en navegador confirma un ratio ≥ 4.5:1 en ambos temas para el pie de foto y textos secundarios.

---

## Bloque 5 — Refactorización de Componentes de la Interfaz

- [x] **T10 — Envolver la aplicación con el `I18nProvider` en `src/App.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-03, Plan §1  
  Importar `I18nProvider` e integrarlo en la raíz de `src/App.tsx` envolviendo toda la jerarquía de componentes para disponibilizar el contexto globalmente.  
  **Hecho cuando:** Cualquier componente hijo puede invocar `useTranslation()` sin lanzar error de contexto no provisto.

- [x] **T11 — Implementar el conmutador de idioma principal accesible en `src/components/NewspaperMasthead.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-05, RA-02, Plan §4.1, QA #5  
  Refactorizar `NewspaperMasthead.tsx`:  
  - Sustituir textos estáticos de cabecera por llamadas a `t()`.  
  - Insertar en la franja de metadatos el par de botones de idioma ("ES" y "EN").  
  - El botón del idioma activo debe tener `aria-current="true"` y estilo activo; el botón inactivo debe ser interactivo, operable por teclado y tener `aria-label` descriptivo traducido (ej. *"Cambiar idioma a Inglés"*).  
  **Hecho cuando:** El usuario puede alternar de idioma con click o con `Tab + Enter`, y el botón activo muestra `aria-current="true"`.

- [x] **T12 — Integrar el conmutador de idioma compacto accesible en `src/components/NewspaperNav.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-05, RA-02, Plan §4.2, QA #6  
  Refactorizar `NewspaperNav.tsx`:  
  - Traducir las etiquetas de navegación mediante `t()`.  
  - Incorporar la variante visual compacta del conmutador de idioma.  
  - Aplicar `aria-hidden="true"` y `tabIndex={-1}` a este control secundario para evitar ruido y redundancia en lectores de pantalla.  
  **Hecho cuando:** El conmutador compacto es visible y funcional con el ratón en la barra de navegación, pero es ignorado por lectores de pantalla y navegación secuencial por teclado.

- [x] **T13 — Integrar fotografía real y datos verificados en `src/components/FrontPage.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-01, RF-02, RA-01, Plan §3, QA #8, QA #9, QA #10, QA #11  
  Refactorizar `FrontPage.tsx`:  
  - Importar `marco-barzola-profile.webp` en lugar del asset ficticio.  
  - Implementar la doble capa de imagen GPU con atributos `loading="eager"`, `fetchpriority="high"`, relación de aspecto explícita y contenedor con fallback halftone.  
  - Reemplazar titulares por el nombre real "MARCO NICOLAS BARZOLA" y rol "Full-Stack Developer & Systems Engineering Student (UNVIME)".  
  - Traducir todos los textos de la portada, entradilla drop-cap, pie de foto y tarjetas secundarias consumiendo `t()`.  
  **Hecho cuando:** La portada muestra la foto real de Marco Barzola con revelación vintage en hover y todos sus textos cambian al alternar de idioma.

- [x] **T14 — Actualizar Clasificados con datos de contacto reales en `src/components/ClassifiedsSection.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-01, Plan §1  
  Refactorizar `ClassifiedsSection.tsx`:  
  - Erradicar placeholders (`hello@portfolio.dev`, `San Francisco, CA`).  
  - Incluir datos reales: Email `marcobarzoladev@gmail.com`, ubicación `Villa Mercedes, San Luis, Argentina`, GitHub `MarcoBarzola22`, LinkedIn de Marco y formación en UNVIME.  
  - Traducir biografía, títulos y notas al pie consumiendo `t()`, aplicando interpolación dinámica para el año actual en el copyright (`{year}`).  
  **Hecho cuando:** La sección de Clasificados muestra la información verídica y los enlaces abren los perfiles oficiales con `rel="noopener noreferrer"`.

- [x] **T15 — Internacionalizar `ProjectsSection.tsx`, `ProjectCard.tsx` y `ArticleOverlay.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-04, CL-03, Plan §1  
  Conectar los componentes de casos de estudio al motor i18n:  
  - Traducir encabezados de sección, etiquetas de botones y categorías editoriales.  
  - En `ProjectCard` y `ArticleOverlay`, resolver las narrativas de los proyectos (ledes, restricciones, trade-offs) mediante `t()`.  
  - Verificar que si el overlay está abierto, la alternancia de idioma traduzca el contenido inmediatamente sin cerrar el modal ni perder el foco.  
  **Hecho cuando:** El artículo modal completo de SmartForge, FitPlan Desktop e Interactive Digital Menu se lee en español o inglés según el idioma activo.

- [x] **T16 — Internacionalizar la sección técnica en `src/components/TechStackSection.tsx`.**  
  **Bloque:** 5 | **Requisitos:** RF-04, Plan §1  
  Sustituir los textos descriptivos de la sección de arquitectura técnica por llamadas a `t()`, conservando los nombres propios de las tecnologías.  
  **Hecho cuando:** Los encabezados y subtítulos de `TechStackSection` se traducen reactivamente sin alterar los nombres de librerías y herramientas.

---

## Bloque 6 — Suite de Pruebas Automatizadas y Verificación de Calidad

- [x] **T17 — Crear pruebas unitarias del motor i18n en `test/i18n/`.**  
  **Bloque:** 6 | **Requisitos:** RF-03, RF-05, RA-01, CL-01, Plan §6.1  
  Crear archivos de test:  
  - `test/i18n/i18nContext.test.tsx`: Validar carga inicial desde `localStorage`, fallback a `'es'`, tolerancia a fallos en `localStorage` y mutación de `<html lang>`.  
  - `test/i18n/useTranslation.test.ts`: Validar resolución de claves, interpolación de variables `{token}` y fallback de claves faltantes.  
  **Hecho cuando:** `npm test test/i18n` ejecuta todas las pruebas unitarias con resultado 100% aprobado.

- [x] **T18 — Crear pruebas de accesibilidad y conmutación de idioma en `test/components/LanguageToggle.test.tsx`.**  
  **Bloque:** 6 | **Requisitos:** RA-01, RA-02, Principio 4, Plan §6.2  
  Crear `test/components/LanguageToggle.test.tsx`:  
  - Comprobar presencia de `aria-current="true"` en la opción activa.  
  - Validar alternancia por click y por teclado (`Enter`).  
  - Confirmar que el control en `NewspaperNav` tiene `aria-hidden="true"`.  
  - Ejecutar auditoría automatizada con `axe-core` arrojando cero violaciones de accesibilidad.  
  **Hecho cuando:** `npm test LanguageToggle.test.tsx` pasa sin fallos y `axe-core` no reporta infracciones.

- [x] **T19 — Crear pruebas de integración para Portada y Clasificados reales.**  
  **Bloque:** 6 | **Requisitos:** RF-01, RF-02, Principio 5, Plan §6.2  
  Crear/actualizar `test/components/FrontPage.test.tsx` y `test/components/ClassifiedsSection.test.tsx`:  
  - Verificar renderizado del titular "MARCO NICOLAS BARZOLA" y foto con `marco-barzola-profile.webp`.  
  - Confirmar ausencia total de cadenas `hello@portfolio.dev` y `San Francisco, CA`.  
  - Verificar presencia de enlaces reales a `MarcoBarzola22` y correo de contacto.  
  **Hecho cuando:** Los tests de integración validan que el 100% de la identidad renderizada corresponde a los datos verídicos de Marco Barzola.

- [x] **T20 — Verificación final de compilación, tests y build estático.**  
  **Bloque:** 6 | **Requisitos:** Principio 1, Principio 6, Verificación de Aceptación  
  Ejecutar la suite completa de control de calidad:  
  1. `npx tsc --noEmit` para verificar tipos sin errores.  
  2. `npm test` para asegurar que ninguna prueba previa sufra regresión.  
  3. `npm run build` para validar el empaquetado de producción estático en `dist/` sin errores ni advertencias de tamaño.  
  **Hecho cuando:** Los tres comandos finalizan con código de salida 0 (exitoso) y la carpeta `dist/` queda lista para despliegue estático en AWS.
