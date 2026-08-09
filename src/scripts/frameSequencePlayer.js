// ============================================================================
// frameSequencePlayer.js — Reproductor de video "scrubbeable" por scroll
//
// La técnica: en vez de controlar un <video>, precargamos N imágenes
// (fotogramas exportados con ffmpeg) y dibujamos la que corresponda en un
// <canvas> según el progreso de scroll. Como cada fotograma es una imagen
// estática ya decodificada, drawImage() es instantáneo — sin el lag ni los
// saltos de intentar sincronizar video.currentTime con el scroll.
//
// Uso típico (ver scrollAnimations.js):
//   const player = new FrameSequencePlayer(canvas, {
//     basePath: '/frames/hero/frame_',
//     frameCount: 120,
//     padLength: 4,       // frame_0001.webp, frame_0002.webp...
//     extension: 'webp',
//   });
//   await player.preload((progreso) => actualizarBarraDeCarga(progreso));
//   player.drawFrame(45); // dibuja el fotograma 45
// ============================================================================

export class FrameSequencePlayer {
  constructor(canvas, { basePath, frameCount, padLength = 4, extension = 'webp' }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.basePath = basePath;
    this.frameCount = frameCount;
    this.padLength = padLength;
    this.extension = extension;

    this.images = new Array(frameCount);
    this.currentFrame = 0;

    this._resize = this._resize.bind(this);
    this._resize();
    window.addEventListener('resize', this._resize);
  }

  _frameUrl(index) {
    const n = String(index + 1).padStart(this.padLength, '0');
    return `${this.basePath}${n}.${this.extension}`;
  }

  /**
   * Precarga todos los fotogramas. Devuelve una promesa que resuelve cuando
   * todos terminaron de cargar (con éxito o error — un fotograma faltante
   * no debe bloquear el resto).
   * @param {(progress: number) => void} onProgress 0..1
   */
  preload(onProgress) {
    let loaded = 0;
    const promises = [];

    for (let i = 0; i < this.frameCount; i++) {
      const img = new Image();
      const done = () => {
        loaded++;
        onProgress?.(loaded / this.frameCount);
      };
      const promise = new Promise((resolve) => {
        img.onload = () => {
          done();
          resolve();
        };
        img.onerror = () => {
          done();
          resolve();
        };
      });
      img.src = this._frameUrl(i);
      this.images[i] = img;
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  _resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
    this.canvas.width = this.cssWidth * this.dpr;
    this.canvas.height = this.cssHeight * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // redibuja el fotograma actual con las nuevas dimensiones
    const img = this.images[this.currentFrame];
    if (img?.complete) this.drawFrame(this.currentFrame);
  }

  /**
   * Dibuja el fotograma `index`, con object-fit:cover manual (llena el
   * canvas sin deformar la imagen, recortando lo que sobre).
   */
  drawFrame(index) {
    const clamped = Math.max(0, Math.min(this.frameCount - 1, Math.round(index)));
    this.currentFrame = clamped;

    const img = this.images[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    const canvasRatio = this.cssWidth / this.cssHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgRatio > canvasRatio) {
      drawHeight = this.cssHeight;
      drawWidth = drawHeight * imgRatio;
      offsetX = (this.cssWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = this.cssWidth;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (this.cssHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  destroy() {
    window.removeEventListener('resize', this._resize);
  }
}
