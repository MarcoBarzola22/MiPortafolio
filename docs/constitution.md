# Constitución — The Minty Gazette

> 6 principios innegociables. Todo PR que viole uno se rechaza.

1. **Soberanía y Limpieza del Código.** Conservar la estructura visual y el diseño base de periódico, pero purgar absolutamente todo rastro propietario de la plataforma generadora (eliminar dependencias inútiles, scripts de seguimiento y `lovable-tagger`). Mantenemos Tailwind CSS y los componentes base, refactorizándolos para que sean modulares y limpios.
2. **Estética Editorial y Refinamiento.** El diseño base en Tailwind se adaptará para priorizar la tipografía editorial y el espacio en blanco. Ajustaremos la configuración para usar el espacio de color OKLCH y una escala tipográfica estricta, eliminando valores mágicos de CSS.
3. **Animaciones a 60 fps o nada.** La navegación entre secciones requerirá una animación de "vuelta de página". Toda animación debe usar `transform`/`opacity` exclusivamente, ejecutarse en compositor GPU y mantener 60 FPS (Lighthouse Performance ≥ 90).
4. **Accesibilidad WCAG 2.1 AA verificable.** Contraste ≥ 4.5:1 en texto, navegación completa por teclado y landmarks ARIA semánticos. Validar con axe-core en CI antes de merge.
5. **Casos de estudio con datos reales.** Cada proyecto validará empíricamente la experiencia técnica, mostrando el problema, trade-offs y métricas cuantificables. Cero lorem ipsum, cero capturas placeholder.
6. **SPA desplegable en AWS.** Arquitectura en React 19 y Vite orientada a un build estático limpio, listo para ser desplegado eficientemente en la nube (S3 + CloudFront). `npm run build` sin warnings ni errores.