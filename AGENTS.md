# AGENTS.md — Cielo Austral (landing de astroturismo)

Este archivo se inyecta automáticamente en el contexto de OpenCode. Contiene
todo lo que un agente (o Max) necesita para retomar el proyecto sin perder
contexto entre sesiones.

## Qué es este proyecto

Landing page de una sola página (`/`) para un negocio de astroturismo en
Chile. El objetivo de diseño es una experiencia **cinematográfica**: cada
sección se revela al hacer scroll como si fueran escenas de una película,
sobre un fondo de campo de estrellas animado en `<canvas>` que reacciona al
scroll y "salta" (efecto warp) al cruzar entre secciones.

Stack: **Astro 4** + **Tailwind CSS v4** (config CSS-first, no hay
`tailwind.config.js`) + **GSAP/ScrollTrigger** para animaciones de scroll +
**Lenis** para scroll suave. Sin framework de UI (React/Vue) — todo es Astro
+ `<script>` vanilla, a propósito, para mantener el sitio liviano y rápido.

## Arquitectura (dónde está cada cosa)

- `src/data/consts.ts` — nombre del sitio, contacto, items de navegación.
- `src/data/content.ts` — copy editable de la landing: Hero, textos de
  secciones, servicios, CTAs y FAQ. Es el primer archivo a tocar para adaptar
  la plantilla a un cliente real sin modificar componentes.
- `src/data/tours.ts` — próximos tours, tours realizados, cifras clave, planes
  de tarifas. **Este es el archivo que más se edita** para actualizar
  contenido sin tocar componentes.
- `src/components/sections/*.astro` — una sección = un archivo = un `<section
  id="...">`. El orden de las secciones se define en `src/pages/index.astro`.
- `src/components/seo/SEO.astro` — meta tags + JSON-LD (schema.org). Editar
  aquí si cambian datos de la empresa (dirección, teléfono, redes).
- `public/api/content.php` — endpoint PHP que entrega contenido desde MySQL.
- `public/admin/` — panel PHP de administración de contenido.
- `public/cms/` — bootstrap PHP, `schema.sql` y `config.example.php`. El
  archivo real `config.php` nunca debe subirse a Git.
- `src/scripts/starfield.js` — clase `Starfield`: dibuja y anima el canvas de
  estrellas de fondo (todas las secciones excepto el Hero). Expone
  `warp(intensity)` para el efecto de salto entre escenas.
- `src/scripts/frameSequencePlayer.js` — clase `FrameSequencePlayer`: precarga
  fotogramas exportados con ffmpeg y los dibuja en el canvas del Hero según el
  scroll (técnica tipo Apple, ver README → "Exportar tu video a fotogramas").
- `src/scripts/scrollAnimations.js` — "director de cámara": inicializa Lenis,
  conecta GSAP ScrollTrigger, pinea el Hero y liga su scroll a los
  fotogramas (`initHeroFrameSequence`), revela elementos `[data-reveal]` del
  resto de secciones, marca el link de nav activo y dispara `starfield.warp()`
  al cruzar cada `<section>`.
- `public/frames/hero/` — carpeta con la secuencia demo del Hero
  (`ezgif-frame-001.jpg` ... `ezgif-frame-288.jpg`). Si se reemplaza por otra
  secuencia, ajustar `basePath`, `frameCount`, `padLength` y `extension` en
  `src/scripts/scrollAnimations.js`.
- `src/styles/global.css` — tokens de diseño Tailwind v4 dentro de `@theme`
  (colores, tipografías). Cambiar la paleta o fuentes se hace **solo aquí**.

## Convenciones del proyecto

- Todo el copy está en español (es-CL), tono cercano pero profesional.
- Cualquier elemento que deba "revelarse" al hacer scroll lleva
  `data-reveal` (y opcionalmente `data-reveal-delay="0.1"` para stagger).
- Los colores nunca se hardcodean en componentes: se usan las utilidades de
  Tailwind generadas desde `@theme` en `global.css` (`bg-space-950`,
  `text-nova-400`, `text-mist-400`, etc).
- El copy de secciones vive en `src/data/content.ts` y los datos de
  tours/tarifas viven en `src/data/tours.ts`, nunca inline en el componente —
  así se pueden editar sin tocar markup.
- El formulario de contacto (`Contacto.astro`) es solo de interfaz por ahora
  (`onsubmit="return false;"`). Ver README para conectarlo a un servicio real.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Para despliegue o validación limpia usar `npm ci && npm run build`. La
plantilla usa npm, `package-lock.json` y `.npmrc` con `save-exact=true` para
evitar actualizaciones implícitas o dependencias innecesarias.

## Backend / CMS

La plantilla está preparada para cPanel con PHP + MySQL. Astro genera un sitio
estático, pero el navegador consulta `/api/content.php` y reemplaza textos,
listas, tours, tarifas, FAQ y contacto desde la base de datos. Si la API falla,
queda el contenido estático como respaldo.

Nunca crear ni commitear `public/cms/config.php`. Para producción, copiar
`config.example.php`, completar credenciales MySQL y generar `ADMIN_PASSWORD_HASH`
con `password_hash()`.

## Backlog / próximos pasos sugeridos

- [ ] Para cada cliente real, decidir si se usa la secuencia demo del Hero o si
      se reemplaza por fotogramas propios. Si se reemplaza, ajustar
      `basePath`, `frameCount`, `padLength` y `extension` en
      `scrollAnimations.js` para que coincidan.
- [ ] Reemplazar imágenes placeholder de "Tours realizados" por fotos reales
      (ver README, sección "Reemplazar imágenes por fotos reales").
- [ ] Conectar el formulario de contacto a un servicio real de envío de
      email (Formspree, Resend, o un endpoint propio).
- [ ] Cargar `og-cover.jpg` real en `/public` (1200×630px) para que el
      preview de redes sociales no use el placeholder.
- [ ] Revisar y ajustar textos de `src/data/tours.ts` con datos reales del
      negocio (precios, fechas, cupos).
- [ ] Configurar dominio real en `astro.config.mjs` (`SITE_URL`) y en
      `src/data/consts.ts` (`SITE.url`) antes de desplegar a producción.

## Notas de decisiones de diseño

- Tailwind v4 con config CSS-first (`@theme` en `global.css`) en vez de
  `tailwind.config.js`: menos archivos, y los tokens de color quedan al lado
  de donde se usan.
- Lenis + GSAP ScrollTrigger en vez de CSS `scroll-timeline` nativo: mejor
  soporte cross-browser (Safari/iOS) y control fino del efecto warp.
- Híbrido fotogramas + procedural: el Hero usa secuencia de fotogramas reales
  (video de Max exportado con ffmpeg) porque es el momento de mayor impacto
  visual y vale la pena el peso del asset. El resto del sitio (fondo de
  todas las demás secciones y las transiciones "warp" entre ellas) usa el
  canvas procedural de `starfield.js`, que no depende de ningún asset y
  responde a cualquier tamaño de pantalla sin exportar nada extra. Al final
  del recorrido del Hero, el canvas de fotogramas hace fade-out y revela el
  starfield procedural que ya está animando debajo — ahí ocurre el empalme
  entre "video real" y "espacio procedural".
