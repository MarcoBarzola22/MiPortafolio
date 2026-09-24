# SPEC-004: Identidad, Contenido Real e Internacionalización (i18n)

**Estado:** Borrador  
**Fase:** 4  
**Fecha:** 2026-09-24  
**Constitución aplicable:** [docs/constitution.md](../../docs/constitution.md) — Principios 1, 2, 4, 5, 6  
**Reglas operativas:** [AGENTS.md](../../AGENTS.MD) — Reglas 1, 2, 4, 5  

---

## 1. Contexto y Objetivo

### 1.1 Contexto
Tras completar la infraestructura visual (Fase 2) y la arquitectura de casos de estudio con reportajes técnicos reales (Fase 3), el portafolio aún conserva contenido genérico, marcadores de posición (*placeholders*) y textos heredados en la Portada (`FrontPage`) y en los Clasificados (`ClassifiedsSection`):
- Se utilizan datos de contacto ficticios (`hello@portfolio.dev`, `@developer`, ubicación `San Francisco, CA`).
- La portada utiliza una fotografía genérica (`profile-photo.jpg`) y una narrativa impersonal desvinculada del autor real.
- Todo el sitio se encuentra codificado exclusivamente en un solo idioma con textos fijos en los componentes, impidiendo que reclutadores internacionales y de habla hispana accedan a la propuesta técnica en su idioma de preferencia.

Esto contraviene el **Principio 5 de la Constitución** (*"Casos de estudio con datos reales... Cero lorem ipsum, cero capturas placeholder"*) y limita el alcance profesional de la plataforma como carta de presentación para oportunidades de ingeniería locales y globales.

### 1.2 Objetivo
1. **Identidad Real:** Reemplazar el 100% del contenido ficticio por los datos profesionales verídicos de **Marco Nicolas Barzola** (estudiante de Ingeniería en Sistemas de Información en la UNVIME y Desarrollador Full-Stack), integrando su fotografía de perfil real (`src/assets/marco-barzola-profile.webp`) con un tratamiento estético editorial riguroso (tinta sobre papel y calidez analógica controlada).
2. **Internacionalización Ligera (i18n):** Implementar un sistema bilingüe completo (Español por defecto / Inglés) de cero dependencias externas, sustentado en un Contexto de React puro y diccionarios estructurados estáticos, que garantice cobertura textual total, cero impacto adverso en el bundle size (respetando el Principio 1 y 6) y cambio de idioma instantáneo.
3. **Persistencia y Accesibilidad Editorial:** Gestionar la preferencia idiomática en almacenamiento local (`localStorage`), sincronizar dinámicamente los metadatos del documento (`html lang` y `document.title`) y proveer controles de cambio de idioma ergonómicos y accesibles tanto en la cabecera principal (*Masthead*) como en la barra de navegación compacta (*NewspaperNav*).

### 1.3 Por qué ahora
Habiendo consolidado la presentación profunda de proyectos de ingeniería en la Fase 3, la identidad real es el ancla que une el perfil del desarrollador con los reportajes técnicos. La internacionalización debe integrarse antes de abordar micro-interacciones complejas o despliegues finales (Fase 5 y 6), asegurando que todas las vistas, overlays, tarjetas y etiquetas semánticas nazcan internacionalizadas desde su estructura base.

---

## 2. Historias de Usuario

| ID    | Como…                                | Quiero…                                                                                                  | Para…                                                                                               |
|-------|--------------------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| HU-01 | Reclutador o cliente internacional   | alternar el idioma del periódico a Inglés con un solo click o interacción de teclado                     | evaluar la experiencia, stack y proyectos de Marco en mi idioma de trabajo nativo.                 |
| HU-02 | Visitante de habla hispana           | consumir el portafolio en Español por defecto con narrativa técnica clara y natural                     | comprender el trasfondo académico, trayectoria y contexto local sin traducciones automáticas torpes.|
| HU-03 | Reclutador técnico                   | consultar la información de contacto verídica (GitHub, LinkedIn, Email, Ubicación)                      | comunicarme directamente con el candidato sin intermediarios ni enlaces rotos.                     |
| HU-04 | Visitante que navega páginas internas| cambiar el idioma desde la barra de navegación secundaria sin tener que regresar al inicio de la portada | mantener mi flujo de lectura sin interrupciones ni recargas de página.                              |
| HU-05 | Lector recurrente                    | que el portafolio recuerde mi elección de idioma entre sesiones y recargas del navegador                  | no tener que reconfigurar mi preferencia cada vez que visito el sitio.                              |
| HU-06 | Usuario con lector de pantalla       | que el cambio de idioma actualice los atributos del documento (`html lang`) y los `aria-labels`           | que mi sintetizador de voz pronuncie el contenido con la fonética y reglas gramaticales adecuadas.  |
| HU-07 | Entusiasta del diseño editorial      | ver la fotografía de Marco integrada con tratamiento de tinta impresa y revelación cromática vintage     | experimentar una coherencia visual inmersiva de diario tradicional de alta calidad.                |

---

## 3. Requisitos Funcionales (RF-x)

### RF-01 — Reemplazo Integral por Datos Reales de Identidad
Todo texto ficticio de la Portada (`FrontPage`) y Clasificados (`ClassifiedsSection`) debe ser erradicado y sustituido por los datos verificados del autor:
- **Nombre:** Marco Nicolas Barzola
- **Rol / Titular Profesional:** Full-Stack Developer & Systems Engineering Student (UNVIME)
- **Ubicación:** Villa Mercedes, San Luis, Argentina
- **Correo Electrónico:** marcobarzoladev@gmail.com
- **Perfil de LinkedIn:** linkedin.com/in/Marco Barzola
- **Perfil de GitHub:** github.com/MarcoBarzola22
- **Biografía Contextual:** Desarrollador Full-Stack enfocado en arquitectura de sistemas, automatización de flujos operativos y aplicaciones web con asistencia de modelos de IA. Su narrativa de portada debe reflejar su rigor técnico y formación en ingeniería de sistemas.

*Criterios de Aceptación:*
- Ningún componente renderiza cadenas como `hello@portfolio.dev`, `@developer`, `San Francisco, CA` o `5+ Years of Building at Scale`.
- Los enlaces de contacto en Clasificados conducen a las URLs legítimas de los perfiles de Marco con atributos de seguridad `rel="noopener noreferrer"`.
- Los titulares y bloques informativos de portada reflejan su identidad real en ambos idiomas.

---

### RF-02 — Integración Editorial de la Fotografía de Perfil
La imagen de perfil ubicada en `src/assets/marco-barzola-profile.webp` debe reemplazar la imagen genérica previa en la historia principal de `FrontPage`:
- **Estética de Tinta Impresa:** La imagen debe mostrarse de manera predeterminada con filtro monocromático y modo de contraste/fusión que evoque tinta negra absorbida sobre papel de prensa periódico.
- **Micro-interacción de Revelación Analógica:** Al pasar el cursor (`:hover`) o situar el foco en el contenedor (`:focus-within`), la imagen debe transicionar suavemente hacia una sutil recuperación de calidez cromática (tono cálido / sepia suave vintage), evitando expresamente saturaciones digitales modernas o colores RGB fluorescentes.
- **Respeto a Sensibilidad de Movimiento:** La transición de revelado debe desactivarse o ser instantánea si el usuario tiene activa la preferencia de sistema `prefers-reduced-motion: reduce`.
- **Pie de Foto Editorial Bilingüe:** 
  - Español: *"Marco Barzola — Desarrollador Full-Stack"*
  - Inglés: *"Marco Barzola — Full-Stack Developer"*

*Criterios de Aceptación:*
- La fotografía renderizada corresponde al asset `marco-barzola-profile.webp`.
- La imagen no presenta artefactos de deformación de relación de aspecto (`aspect-ratio` respetado).
- En reposo se percibe monocromática/editorial; en interacción adopta calidez vintage controlada.

---

### RF-03 — Arquitectura Ligera de Internacionalización (Zero Dependencies)
El sistema i18n debe operar bajo una arquitectura limpia y sin librerías externas de terceros (rechazando dependencias de alto peso como `react-i18next` o `formatjs` en estricto apego al Principio 1):
- **Gestor de Estado Centralizado:** Implementado mediante un `I18nContext` y un hook tipado de consumo (ej. `useTranslation` o `useI18n`).
- **Diccionarios Estáticos Estructurados:** Los textos deben organizarse en archivos de traducción estáticos (un módulo por idioma: `es` y `en`) con tipado estricto en TypeScript para asegurar que ambos diccionarios compartan idénticas claves sin discrepancias estructurales.
- **Rendimiento y Reactividad:** El cambio de idioma debe ser sincrónico e instantáneo en memoria, provocando una re-renderización limpia sin saltos de maquetación (*Layout Shifts*) ni recarga de página.

*Criterios de Aceptación:*
- Cero librerías i18n añadidas a `package.json`.
- Validación en tiempo de compilación (`tsc --noEmit`): la ausencia de una clave en cualquiera de los diccionarios debe producir un error de tipo.
- La conmutación entre Español e Inglés toma menos de 16ms (un frame a 60 FPS) en el hilo principal.

---

### RF-04 — Cobertura Textual y Regla de Excepciones Técnicas
La internacionalización debe abarcar la totalidad de las superficies textuales del portafolio:
- **Secciones Abarcadas (100%):**
  - Cabecera y metadatos del *Masthead* (lema, edición, fecha, volumen, barra de estado).
  - Barra de navegación *NewspaperNav* (etiquetas de secciones, accesos directos).
  - Portada *FrontPage* (titular principal, bajada, entradilla drop-cap, artículos secundarios, pie de foto).
  - Sección de Casos de Estudio *ProjectsSection* y *ArticleOverlay* (categorías, ledes, narrativa de problemas, limitaciones, trade-offs arquitectónicos, explicaciones de métricas, etiquetas de botones).
  - Sección *TechStackSection* (títulos de categorías, descripciones de arquitectura).
  - Sección *ClassifiedsSection* (encabezados, biografía del autor, etiquetas de contacto, botón de descarga de CV, pie de imprenta / colofón).
  - Todas las etiquetas de asistencia técnica y lectores de pantalla (`aria-label`, descripciones de modales y tooltips).
- **Regla Estricta de Excepciones Técnicas:**
  - Nombres propios de proyectos (`SmartForge`, `FitPlan Desktop`, `Interactive Digital Menu`) se conservan sin alterar.
  - Términos universales y tecnologías de la industria (`TypeScript`, `React`, `Docker`, `PostgreSQL`, `CI/CD`, `Offline-First`, `PWA`, `trade-offs`, `Full-Stack`, `ORM`) se mantienen en su nomenclatura técnica estándar en ambos idiomas. Solo se traduce la prosa y narrativa explicativa que los rodea.

*Criterios de Aceptación:*
- No queda ningún texto en español residual visible al seleccionar inglés, ni viceversa (a excepción de los términos técnicos universales).
- Los overlays de los tres proyectos muestran su narrativa completamente en el idioma activo.

---

### RF-05 — Mecanismo de Selección, Disposición y Persistencia
- **Ubicación Principal (Portada):** El selector de idioma debe ubicarse en la banda horizontal de metadatos del *Masthead*, integrado armónicamente entre la fecha periodística, el lema editorial y la edición actual.
- **Ubicación Secundaria (Páginas / Secciones Interiores):** Un control de idioma con variante visual compacta debe integrarse en la barra de navegación *NewspaperNav*, visible y operativo mientras el usuario interactúa con secciones internas o navega en la vista interior.
- **Persistencia Exclusiva:**
  1. Al iniciar la aplicación, se consulta la clave de persistencia en `localStorage`.
  2. Si existe un valor válido (`'es'` o `'en'`), se inicializa el estado con dicho valor.
  3. Si no existe registro en `localStorage`, la aplicación se inicializa **siempre en Español (`'es'`) por defecto** (no se utiliza detección automática de cabeceras de navegador ni parámetros de consulta en URL).
  4. Toda selección manual por parte del usuario actualiza de inmediato el registro en `localStorage`.

*Criterios de Aceptación:*
- Al recargar la página tras alternar a inglés, la aplicación inicia directamente en inglés sin parpadeos de texto.
- Ambos controles (Masthead y NewspaperNav) se mantienen sincronizados mostrando el estado del idioma activo.

---

## 4. Requisitos de Accesibilidad (WCAG 2.1 AA)

### RA-01 — Sincronización Dinámica del Documento HTML
- **Atributo `lang`:** El elemento raíz `<html lang="...">` debe actualizarse de manera reactiva e inmediata a `"es"` o `"en"` según el idioma activo en el contexto.
- **Título del Documento (`<title>`):** La etiqueta `<title>` de la pestaña del navegador debe actualizarse para reflejar el título editorial en el idioma en curso (ej. *"The Minty Gazette — Marco Barzola | Portafolio Editorial"* en español vs. *"The Minty Gazette — Marco Barzola | Editorial Portfolio"* en inglés).

*Criterios de Aceptación:*
- Al alternar el idioma, el inspector DOM refleja el cambio instantáneo de `<html lang="es">` a `<html lang="en">` y viceversa.
- El lector de pantalla conmuta su sintetizador de pronunciación al idioma correspondiente sin requerir reinicio de sesión.

---

### RA-02 — Semántica y Operabilidad de los Controles de Idioma
- **Tipo de Elemento:** Los conmutadores de idioma deben ser elementos `<button>` nativos (o conjunto de botones accesibles agrupados).
- **Atributos de Estado:**
  - Deben proveer un `aria-label` descriptivo y traducido que comunique la acción (ej. en español: *"Cambiar idioma a Inglés"*; en inglés: *"Switch language to Spanish"*).
  - Si se implementa como grupo de opciones, debe utilizar `aria-pressed="true"` en la opción activa, o indicar `aria-current="true"`.
- **Navegación por Teclado:** Operable completamente mediante las teclas `Enter` y `Space`, con un anillo de foco visible (`focus-visible`) que cumpla con contraste ≥ 3:1 respecto al papel editorial de fondo.

*Criterios de Aceptación:*
- La auditoría automatizada con `axe-core` no genera ninguna advertencia sobre los controles de idioma.
- El usuario puede alternar el idioma navegando exclusivamente con la tecla `Tab` y accionando `Enter`.

---

### RA-03 — Contraste Editorial en Ambos Idiomas
- Todos los textos traducidos deben mantener los ratios mínimos de contraste WCAG 2.1 AA sobre los fondos `paper-base`, `paper-card` y `paper-muted`:
  - Texto normal (< 18pt / 24px): ratio de contraste ≥ 4.5:1.
  - Texto grande (≥ 18pt o ≥ 14pt en negrita) y componentes gráficos: ratio ≥ 3.0:1.
- Se debe verificar la legibilidad tanto en la edición matutina (*Morning Edition* / modo claro) como en la edición nocturna (*Evening Edition* / modo oscuro).

---

## 5. Casos Límite y Robustez

### CL-01 — Disponibilidad Restringida de `localStorage`
En situaciones donde el acceso a almacenamiento local se encuentre bloqueado (ej. ventanas de navegación privada con restricciones estrictas de cookies/storage, o políticas de seguridad corporativas):
- El sistema debe capturar la excepción (`try/catch`) al intentar leer o escribir en `localStorage`.
- La aplicación debe degradar graciosamente manteniendo el estado del idioma en memoria durante la sesión activa sin lanzar errores no controlados en la consola ni interrumpir el renderizado.

### CL-02 — Variación en la Longitud del Texto (Text Expansion / Contraction)
Los textos en español suelen ser entre un 15% y un 25% más largos que sus equivalentes en inglés:
- Los contenedores de los titulares de portada, las tarjetas de proyectos (`ProjectCard`) y los botones de navegación deben utilizar layouts elásticos (Flexbox/Grid con `min-width: 0` y manejo de desbordamientos) que eviten solapamientos, saltos de línea indeseados o rotura del grid editorial.
- El diseño debe asegurar que ningún texto quede truncado de manera abrupta sin indicación visual, preservando la tipografía fluida establecida en la Fase 2.

### CL-03 — Conmutación de Idioma con Modales/Overlays Abiertos
Si el usuario abre un caso de estudio en el `ArticleOverlay` y cambia de idioma (o si se produce una actualización del estado contextual):
- El contenido del artículo debe actualizar su texto en pantalla de forma instantánea al nuevo idioma sin cerrar el overlay, sin desplazar la posición de lectura (*scroll position*) y sin perder la trampa de foco accesible.

### CL-04 — Clave Inexistente o Faltante en Diccionario (Fallback Seguro)
En caso de que una clave de traducción no se encuentre temporalmente en uno de los diccionarios durante el desarrollo:
- El hook de traducción debe contar con un mecanismo de fallback seguro que devuelva la clave textual solicitada o su equivalente en el idioma por defecto (`es`), evitando arrojar valores `undefined` o renderizar pantallas en blanco.

---

## 6. Verificación y Criterios de Aprobación

1. **Compilación Limpia:** `npm run build` y `npx tsc --noEmit` completan con 0 errores y 0 advertencias.
2. **Cobertura de Pruebas Automatizadas:** Pruebas unitarias y de integración que verifiquen:
   - Inicialización correcta desde `localStorage` y fallback a `'es'`.
   - Conmutación exitosa entre diccionarios al accionar el botón.
   - Presencia de datos reales de Marco Barzola en las vistas renderizadas.
   - Comportamiento ante fallos simulados de `localStorage`.
3. **Validación de Accesibilidad:** Cero violaciones detectadas por `axe-core` en ejecuciones de prueba sobre la portada y los componentes actualizados.
4. **Verificación Estética:** Comprobación visual del tratamiento de tinta y calidez analógica en la fotografía `marco-barzola-profile.webp`.
