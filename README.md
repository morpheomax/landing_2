# Cielo Austral — Landing de Astroturismo

Landing de una página construida con **Astro 4 + Tailwind CSS v4 + GSAP +
Lenis**. Experiencia cinematográfica: un campo de estrellas animado en
`<canvas>` de fondo, que reacciona al scroll y "salta" (efecto warp) cada vez
que cruzas de una sección a otra, como cortes de escena de una película.

> Esta base funciona como plantilla para crear sitios reales con una estructura
> de landing cinematográfica: cambia datos y assets, conserva componentes y
> sistema visual.

---

## 1. Requisitos

- **Node.js 18.20.8 o superior** (recomendado 20 LTS). Verifica con:
  ```bash
  node -v
  ```
- **VSCode** con la extensión oficial **Astro** (`astro-build.astro-vscode`)
  para autocompletado y resaltado de sintaxis en archivos `.astro`.
- **OpenCode** ya configurado en tu equipo (el proyecto trae `AGENTS.md` y
  `PROGRESS.md` siguiendo tu patrón habitual, así que OpenCode va a tener
  contexto completo apenas abras la carpeta).

---

## 2. Instalación

Descomprime el proyecto, abre la carpeta en VSCode y en la terminal integrada:

```bash
npm install
npm run dev
```

Para instalaciones reproducibles en despliegue o en otro equipo, usa:

```bash
npm ci
npm run build
```

El proyecto incluye `.npmrc` con versiones exactas para nuevas instalaciones
(`save-exact=true`) y `package-lock.json` como fuente de verdad. Evita instalar
paquetes "por si acaso": agrega dependencias solo cuando sean necesarias para
una funcionalidad concreta.

Esto va a instalar Astro, Tailwind v4, GSAP y Lenis, y levantar el servidor de
desarrollo (por defecto en `http://localhost:4321`). Abre esa URL y deberías
ver la landing completa con el campo de estrellas animado.

Si algo falla en `npm install`, lo más probable es una versión de Node muy
antigua — actualiza Node e intenta de nuevo.

---

## 3. Estructura del proyecto

```
cielo-austral/
├── AGENTS.md              ← contexto para OpenCode
├── PROGRESS.md             ← bitácora de sesiones (append-only)
├── src/
│   ├── data/
│   │   ├── consts.ts        ← nombre del sitio, contacto, navegación
│   │   ├── content.ts       ← copy editable de secciones y FAQ
│   │   └── tours.ts          ← próximos tours, tours realizados, tarifas
│   ├── components/
│   │   ├── seo/SEO.astro     ← meta tags, Open Graph, JSON-LD
│   │   ├── starfield/         ← el <canvas> de fondo
│   │   ├── nav/Navbar.astro
│   │   ├── ui/ScrollProgress.astro
│   │   └── sections/          ← una sección = un archivo
│   │       ├── Hero.astro              (Inicio)
│   │       ├── QuienesSomos.astro
│   │       ├── QueHacemos.astro
│   │       ├── ProximosTours.astro
│   │       ├── ToursRealizados.astro
│   │       ├── Tarifas.astro
│   │       └── Contacto.astro
│   ├── scripts/
│   │   ├── starfield.js             ← animación del campo de estrellas (fondo)
│   │   ├── frameSequencePlayer.js   ← reproductor de fotogramas del Hero
│   │   └── scrollAnimations.js      ← Lenis + GSAP ScrollTrigger, pin del Hero, warp
│   ├── layouts/BaseLayout.astro
│   ├── styles/global.css       ← paleta de colores y tipografías (Tailwind v4)
│   └── pages/index.astro       ← ensambla las 7 secciones en orden
└── public/
    ├── robots.txt
    ├── llms.txt                ← ayuda a motores de IA a entender el sitio (GEO)
    ├── favicon.svg
    └── frames/hero/             ← fotogramas demo del Hero (ezgif-frame-001.jpg...)
```

---

## 4. Cómo hacer los cambios más comunes

### Cambiar textos, tours, tarifas y datos de contacto
No necesitas tocar componentes. Edita directamente:
- `src/data/consts.ts` → nombre del negocio, teléfono, email, redes sociales.
- `src/data/content.ts` → textos de Hero, secciones, servicios, CTA y FAQ.
- `src/data/tours.ts` → próximos tours, tours realizados, cifras clave, planes
  de tarifas. Son arreglos de objetos: copia un bloque existente, cambia los
  valores y listo.

### Cambiar colores y tipografías
Todo vive en `src/styles/global.css`, dentro del bloque `@theme`. Por ejemplo,
para cambiar el color dorado de los CTA:
```css
--color-nova-400: #f2c879; /* cambia este hex */
```
Tailwind genera automáticamente las clases `bg-nova-400`, `text-nova-400`,
etc. a partir de estas variables — no hace falta tocar nada más.

### Ajustar el efecto cinematográfico
- **Intensidad del "salto" entre secciones:** en
  `src/scripts/scrollAnimations.js`, busca `starfield?.warp(0.85)` — sube o
  baja ese número (0 a 1).
- **Velocidad del scroll suave:** en el mismo archivo, dentro de `new
  Lenis({...})`, ajusta `duration` (más alto = más lento/cinematográfico).
- **Cantidad/velocidad de estrellas:** en `src/scripts/starfield.js`, edita el
  arreglo `this.layers` (cantidad, velocidad y tamaño por capa de
  profundidad).

### Reemplazar la secuencia de fotogramas del Hero

El Hero (`#inicio`) queda "pineado" en pantalla mientras el scroll avanza una
secuencia de imágenes fotograma a fotograma. La plantilla ya incluye una
secuencia demo en `public/frames/hero/`:

```txt
ezgif-frame-001.jpg
ezgif-frame-002.jpg
...
ezgif-frame-288.jpg
```

La configuración actual está en `src/scripts/scrollAnimations.js`:

```js
const player = new FrameSequencePlayer(canvas, {
  basePath: '/frames/hero/ezgif-frame-',
  frameCount: 288,
  padLength: 3,
  extension: 'jpg',
});
```

Para un cliente real, puedes usar la misma secuencia demo o reemplazarla por
fotogramas exportados desde un video propio.

**1. Instala ffmpeg** (si no lo tienes):
```bash
# macOS
brew install ffmpeg
# Windows (con winget)
winget install ffmpeg
```

**2. Define cuántos fotogramas necesitas.** Como regla práctica: entre 90 y
150 fotogramas dan un recorrido fluido sin pesar demasiado. Si tu video dura
5 segundos a 24fps, tiene 120 fotogramas — un buen punto de partida.

**3. Extrae y comprime los fotogramas** con ffmpeg (ajusta `tu-video.mp4`,
el ancho de `scale` y la cantidad de fotogramas según tu caso):
```bash
mkdir -p public/frames/hero

ffmpeg -i tu-video.mp4 \
  -vf "scale=1600:-1" \
  -q:v 80 \
  public/frames/hero/frame_%04d.webp
```
- `scale=1600:-1` → redimensiona a 1600px de ancho (suficiente para pantallas
  grandes, mantiene la proporción). Súbelo si tu video se ve borroso en 4K,
  bájalo (ej. 1200) si el peso total es muy alto.
- `-q:v 80` → calidad WebP (0-100). 75-85 suele verse bien con buen peso.
- Si quieres un número exacto de fotogramas en vez de "todos los frames del
  video", agrega `-frames:v 120` antes de la ruta de salida.

**4. Cuenta cuántos fotogramas se generaron** y actualiza `basePath`,
`frameCount`, `padLength` y `extension` en `src/scripts/scrollAnimations.js`
(función `initHeroFrameSequence`) para que coincidan exactamente:
```js
const player = new FrameSequencePlayer(canvas, {
  basePath: '/frames/hero/frame_',
  frameCount: 120, // ← debe ser igual a la cantidad de archivos generados
  padLength: 4,
  extension: 'webp',
});
```

**5. Ajusta cuánto dura el recorrido del scroll** (opcional): la constante
`HERO_SCROLL_VH` al inicio de `scrollAnimations.js` controla cuántas
"alturas de pantalla" de scroll toma completar la secuencia. Súbela para un
recorrido más largo y pausado, bájala para uno más corto y rápido.

**Peso total esperado:** con 120 fotogramas a 1600px de ancho en WebP calidad
80, normalmente estás entre 3-6 MB en total — razonable para una experiencia
hero de este tipo, pero prueba en una conexión móvil real antes de publicar.
Si pesa demasiado, baja la resolución, la calidad, o la cantidad de
fotogramas (puedes saltear frames, ej. tomar 1 de cada 2).

**Si faltan fotogramas o no coinciden los nombres:** la barra de carga puede
terminar, pero el canvas no mostrará imagen. Revisa que los nombres, extensión
y cantidad coincidan con la configuración del player.

### Reemplazar imágenes por fotos reales
La sección "Tours realizados" usa un placeholder ilustrado (no fotos) porque
el proyecto se generó sin acceso a tus imágenes. Para poner fotos reales:

1. Copia tus fotos a `src/assets/tours/` (crea la carpeta).
2. En `ToursRealizados.astro`, importa el componente de imágenes de Astro:
   ```astro
   ---
   import { Image } from 'astro:assets';
   import foto1 from '@/assets/tours/perseidas.jpg';
   ---
   ```
3. Reemplaza el bloque del ícono placeholder por:
   ```astro
   <Image src={foto1} alt={tour.nombre} class="aspect-[4/5] w-full object-cover" />
   ```
   Astro optimiza automáticamente el peso y formato de la imagen.

### Conectar el formulario de contacto
El formulario en `Contacto.astro` hoy es solo visual
(`onsubmit="return false;"`). Para que envíe correos de verdad, la opción más
rápida sin backend propio es un servicio como
[Formspree](https://formspree.io) o [Resend](https://resend.com):

1. Crea una cuenta y obtén tu endpoint/API key.
2. Quita `onsubmit="return false;"` del `<form>`.
3. Agrega `action="https://formspree.io/f/TU_ID"` y `method="POST"` al
   `<form>` (Formspree no requiere JS adicional), o conecta un `fetch()` en
   un `<script>` si usas Resend/tu propio endpoint.

---

## 5. Despliegue

El proyecto es un sitio estático (`astro build` genera HTML/CSS/JS puro), así
que funciona en cualquier hosting estático:

- **Vercel / Netlify / Cloudflare Pages:** conecta el repo de Git, comando de
  build `npm run build`, carpeta de salida `dist/`. Detectan Astro
  automáticamente.
- **cPanel (como usas en otros proyectos tuyos):** corre `npm run build`
  localmente y sube el contenido de `dist/` por FTP/File Manager.

Antes de desplegar a producción:
1. Cambia `SITE_URL` en `astro.config.mjs` por tu dominio real.
2. Cambia `SITE.url` en `src/data/consts.ts` por el mismo dominio.
3. Agrega una imagen real `og-cover.jpg` (1200×630px) en `public/` para que
   el preview en redes sociales se vea bien.

---

## 6. Backend MySQL y panel admin en cPanel

La plantilla mantiene Astro como frontend estático y agrega backend PHP/MySQL
compatible con hosting cPanel:

- `/api/content.php` entrega el contenido desde MySQL en JSON.
- `/admin/` permite iniciar sesión y editar el payload completo del sitio.
- `public/cms/schema.sql` crea la tabla `cms_content` y carga contenido inicial.
- `public/cms/config.example.php` es la plantilla de credenciales. El archivo
  real debe llamarse `config.php` y no se sube a Git.

Flujo de instalación en cPanel:

1. Crea una base de datos MySQL y usuario desde cPanel.
2. Importa `public/cms/schema.sql` en phpMyAdmin.
3. Copia `public/cms/config.example.php` como `public/cms/config.php`.
4. Completa `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASS`.
5. Genera un hash para la contraseña admin:

```bash
php -r "echo password_hash('TU_PASSWORD_SEGURO', PASSWORD_DEFAULT), PHP_EOL;"
```

6. Pega el hash en `ADMIN_PASSWORD_HASH`.
7. Ejecuta `npm ci && npm run build`.
8. Sube el contenido de `dist/` al hosting.
9. Entra a `https://tudominio.cl/admin/`.

Seguridad aplicada:

- No se guardan credenciales reales en el repositorio.
- `public/cms/config.php` está en `.gitignore`.
- Sesiones admin con cookies `HttpOnly`, `SameSite=Lax` y `Secure` si hay HTTPS.
- Formularios admin protegidos con CSRF.
- Login con `password_hash` / `password_verify`.
- API pública solo expone contenido publicado, no credenciales.
- `.htaccess` bloquea acceso directo a `config.php` y `schema.sql`.

Nota: el contenido estático de Astro queda como respaldo. Si la API MySQL no
está configurada o falla, la landing sigue mostrando el contenido incluido en
los archivos `src/data/*`.

---

## 7. SEO y GEO (motores de búsqueda tradicionales + IA)

- **SEO clásico:** `SEO.astro` genera meta tags, Open Graph, Twitter Card y
  datos estructurados JSON-LD tipo `TravelAgency`. El sitemap se genera solo
  gracias a `@astrojs/sitemap` (queda en `/sitemap-index.xml` tras el build).
- **GEO (motores generativos — ChatGPT, Perplexity, Gemini, Claude, etc):**
  - `public/llms.txt` describe el negocio en texto plano estructurado, que
    estos motores pueden leer directamente.
  - El FAQ en la sección de Contacto usa preguntas y respuestas concretas:
    este formato es el que mejor citan los motores de IA.
  - El JSON-LD ayuda tanto a Google como a asistentes de IA a extraer datos
    exactos (dirección, teléfono, nombre) sin ambigüedad.

Edita `public/llms.txt` cada vez que cambien los servicios o el enfoque del
negocio, igual que editarías la meta descripción de SEO.

---

## 8. Accesibilidad y rendimiento

- Las animaciones respetan `prefers-reduced-motion`: si el usuario lo activa
  en su sistema, el canvas deja de moverse y las transiciones se vuelven
  instantáneas.
- Foco de teclado visible en todos los elementos interactivos.
- El canvas de estrellas usa `devicePixelRatio` limitado a 2 para no penalizar
  el rendimiento en pantallas de alta densidad.

---

## 9. Próximos pasos sugeridos

Ver la sección "Backlog" en `AGENTS.md` — está pensada para que retomes el
proyecto (tú u OpenCode) sin perder contexto entre sesiones.
