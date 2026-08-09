# PROGRESS.md

Bitácora append-only de sesiones de trabajo en el proyecto. Agregar una
entrada nueva al final de cada sesión, nunca editar entradas anteriores.

---

## Sesión 1 — Andamiaje inicial (Claude)

**Fecha:** 2026-08-08

**Contexto:** Primera versión del proyecto, creada a partir del brief de Max:
landing de una página para negocio de astroturismo, experiencia inmersiva
tipo "película" donde el scroll revela escenas, sobre Astro + Tailwind, con
SEO y GEO.

**Qué se hizo:**
- Andamiaje completo del proyecto Astro + Tailwind v4 + GSAP + Lenis.
- Sistema de campo de estrellas en canvas (`starfield.js`) con 3 capas de
  paralaje y efecto "warp" al cruzar secciones.
- Orquestación de scroll cinematográfico (`scrollAnimations.js`): Lenis +
  ScrollTrigger, revelado de contenido, nav activo, barra de progreso.
- 7 secciones: Inicio, Quiénes somos, Qué hacemos, Próximos tours, Tours
  realizados, Tarifas, Contacto (con FAQ para GEO).
- SEO: meta tags, Open Graph, Twitter Card, JSON-LD (`TravelAgency`).
- GEO: `/public/llms.txt`, contenido semántico claro, FAQ estructurada.
- Contenido de ejemplo (placeholder) en `src/data/tours.ts` — pendiente de
  reemplazar con datos reales del negocio.
- Documentación: `README.md`, `AGENTS.md`, este `PROGRESS.md`.

**Pendiente para la próxima sesión:**
- Validar `npm install && npm run dev` en el equipo de Max (no se pudo
  probar en el entorno donde se generó el proyecto, sin acceso a red).
- Revisar en pantalla real el timing del efecto warp entre secciones y
  ajustar `warpIntensity` / duración si se siente muy sutil o muy brusco.
- Reemplazar textos placeholder y precios con datos reales del negocio.

---

## Sesión 2 — Hero con secuencia de fotogramas (Claude)

**Fecha:** 2026-08-08

**Contexto:** Max confirmó que tiene/generará video real para el Hero.
Se discutió video-con-scroll vs. secuencia de fotogramas — se optó por
fotogramas (misma técnica que usa Apple: `video.currentTime` no es
frame-accurate y genera tirones, especialmente en Safari/iOS).

**Qué se hizo:**
- `src/scripts/frameSequencePlayer.js` — nueva clase `FrameSequencePlayer`:
  precarga fotogramas y los dibuja en canvas con object-fit:cover manual.
- `Hero.astro` reescrito: ahora es `#hero-scrubber` pineado por scroll, con
  `#hero-frame-canvas`, overlay de legibilidad, texto que se desvanece a
  mitad de recorrido, y pantalla de carga con barra de progreso.
- `scrollAnimations.js`: nueva función `initHeroFrameSequence()` que pinea
  el Hero con GSAP ScrollTrigger, liga el scroll al índice de fotograma, y
  hace fade-out del canvas al final para revelar el starfield procedural
  debajo (empalme entre video real y espacio procedural).
- `public/frames/hero/` creada (vacía, con instrucciones) — ahí van los
  fotogramas reales de Max.
- README: nueva sección "Exportar tu video a fotogramas (Hero
  cinematográfico)" con comando ffmpeg exacto, guía de resolución/calidad/
  cantidad de fotogramas, y cómo ajustar `frameCount` y `HERO_SCROLL_VH`.
- Decisión de arquitectura documentada en AGENTS.md: híbrido — fotogramas
  reales solo en el Hero (momento de mayor impacto), procedural en el resto
  del sitio (sin peso de assets, responsive por definición).

**Pendiente para la próxima sesión:**
- Max exporta su video con ffmpeg siguiendo la guía del README y coloca los
  fotogramas en `public/frames/hero/`.
- Ajustar `frameCount` en `scrollAnimations.js` para que coincida con la
  cantidad real de fotogramas exportados.
- Probar el peso total de los fotogramas en una conexión móvil real; si pesa
  demasiado, reducir resolución/calidad/cantidad según la guía del README.
- Revisar en pantalla real el timing del fade del texto y del crossfade
  final hacia el starfield — puede necesitar ajuste fino de los offsets
  (0.45, 0.8) en la timeline de `initHeroFrameSequence()`.

---

## Sesión 3 — Preparación como plantilla reusable (OpenCode)

**Fecha:** 2026-08-08

**Contexto:** Max indicó que esta landing usa datos ficticios, pero se usará
como base para crear sitios reales conservando estructura y diseño.

**Qué se hizo:**
- Se revisó el proyecto completo y se detectó que el Hero estaba configurado
  para `frame_0001.webp` a `frame_0120.webp`, pero los assets existentes son
  `ezgif-frame-001.jpg` a `ezgif-frame-288.jpg`.
- Se ajustó `src/scripts/scrollAnimations.js` para usar la secuencia JPG demo
  incluida: `basePath`, `frameCount`, `padLength` y `extension` ahora coinciden
  con los archivos reales.
- Se creó `src/data/content.ts` para centralizar el copy editable de Hero,
  Quiénes somos, Qué hacemos, Próximos tours, Tours realizados, Tarifas,
  Contacto y FAQ.
- Se refactorizaron las secciones para leer ese copy desde datos, sin cambiar
  el diseño visual.
- Se actualizó documentación en README, AGENTS y `public/frames/hero/LEEME.md`
  para reflejar la secuencia demo real y el flujo de reemplazo por cliente.

**Pendiente:**
- Instalar dependencias y ejecutar `npm run build` para validar la integración.
- Conectar formulario real cuando exista el proveedor elegido.
- Definir si `llms.txt` queda manual por cliente o se genera desde una ruta
  Astro a partir de los datos centralizados.

---

## Sesión 4 — Backend MySQL, CMS y publicación GitHub (OpenCode)

**Fecha:** 2026-08-08

**Contexto:** Max pidió conectar la landing a MySQL de hosting cPanel, agregar
backend, panel de administración y preparar publicación en GitHub.

**Qué se hizo:**
- Se agregó backend PHP compatible con cPanel en `public/api`, `public/admin`
  y `public/cms`.
- Se creó `public/cms/schema.sql` con tabla `cms_content` y payload inicial del
  sitio.
- Se creó `public/cms/config.example.php`; el `config.php` real queda ignorado
  por Git.
- Se agregó panel `/admin/` con login, CSRF, sesiones seguras y editor JSON del
  contenido.
- Se agregó `/api/content.php` para exponer el contenido publicado desde MySQL.
- Se conectó el frontend con `src/scripts/cmsContent.js` para reemplazar copy,
  listas, tours, tarifas, FAQ y contacto desde la API, manteniendo contenido
  estático como respaldo.
- Se documentó instalación cPanel, seguridad y flujo de despliegue.

**Validado:**
- `npm run build` sin errores, warnings ni hints.
- `php -l` sin errores en archivos PHP agregados.
- JSON inicial embebido en `schema.sql` validado correctamente.

**Pendiente:**
- Configurar credenciales reales MySQL en el hosting.
- Importar `schema.sql` en phpMyAdmin.
- Generar hash real de contraseña admin.
- Desplegar `dist/` en el hosting cPanel cuando el dominio esté definido.

**Cierre de sesión:**
- Repositorio Git inicializado, commit creado y publicado en GitHub:
  `https://github.com/morpheomax/landing_2`.
- Rama principal local y remota: `main`.
- Último commit publicado: `66aa4e2 Initial landing template with CMS`.
- Build validado con `npm run build`.
- Sintaxis PHP validada con `php -l` en backend y panel admin.
- Se limpiaron artefactos locales innecesarios (`.DS_Store` y ZIP duplicado de
  frames). `node_modules`, `.astro` y `dist` permanecen locales e ignorados.

---

## Sesión 5 — Cierre operativo final (OpenCode)

**Fecha:** 2026-08-08

**Contexto:** Max pidió actualizar registros, limpiar y cerrar para continuar
en otro momento.

**Estado final:**
- Repositorio local en rama `main`, conectado a
  `https://github.com/morpheomax/landing_2`.
- Últimos commits publicados:
  - `fc313be Document session handoff`
  - `66aa4e2 Initial landing template with CMS`
- Worktree limpio antes del cierre, salvo artefactos ignorados locales.
- Se eliminó un `.DS_Store` reaparecido en `public/frames/hero/`.
- `node_modules/`, `.astro/` y `dist/` quedan locales e ignorados por Git.

**Para retomar:**
- Revisar primero `README.md`, `AGENTS.md` y este `PROGRESS.md`.
- Si se trabajará en hosting real, configurar `public/cms/config.php` solo en
  el servidor, importar `public/cms/schema.sql` y generar hash admin real.
- Validar con `npm run build` antes de cualquier nuevo push.

---
