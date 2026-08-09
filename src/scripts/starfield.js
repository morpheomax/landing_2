// ============================================================================
// starfield.js — Campo de estrellas inmersivo en <canvas>
//
// Qué hace:
//  - Dibuja 3 capas de estrellas con distinta profundidad (paralaje).
//  - Reacciona al scroll: al desplazarte, las estrellas se mueven con
//    velocidades distintas por capa, dando sensación de profundidad espacial.
//  - Método warp(intensity): durante 700-900ms estira las estrellas en
//    "líneas de velocidad" tipo salto hiperespacial. Se dispara al cruzar
//    el límite entre secciones (ver scrollAnimations.js).
//  - Respeta prefers-reduced-motion: si el usuario lo pide, se detiene el
//    movimiento automático y solo se dibuja un fondo estático.
// ============================================================================

export class Starfield {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3 capas: [count, speedFactor, sizeRange, colorAlpha]
    this.layers = [
      { count: 140, speed: 0.02, size: [0.4, 1.1], alpha: 0.55 },
      { count: 90, speed: 0.05, size: [0.8, 1.8], alpha: 0.8 },
      { count: 50, speed: 0.1, size: [1.2, 2.6], alpha: 1 },
    ];

    this.stars = [];
    this.scrollY = window.scrollY;
    this.targetScrollY = window.scrollY;
    this.warpIntensity = 0; // 0 = normal, 1 = warp máximo
    this.mouse = { x: 0, y: 0 };

    this._resize = this._resize.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._tick = this._tick.bind(this);

    this._resize();
    this._buildStars();

    window.addEventListener('resize', this._resize);
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });

    this.rafId = requestAnimationFrame(this._tick);
  }

  _resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _buildStars() {
    this.stars = [];
    this.layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        this.stars.push({
          layer: layerIndex,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.4 + Math.random() * 0.8,
        });
      }
    });
  }

  _onScroll() {
    this.targetScrollY = window.scrollY;
  }

  _onMouseMove(e) {
    this.mouse.x = (e.clientX / this.width - 0.5) * 2; // -1..1
    this.mouse.y = (e.clientY / this.height - 0.5) * 2;
  }

  /**
   * Dispara el efecto de "salto" al cruzar entre secciones.
   * @param {number} intensity 0..1
   */
  warp(intensity = 1) {
    if (this.reducedMotion) return;
    this.warpIntensity = Math.max(this.warpIntensity, intensity);
  }

  _tick(time) {
    // suaviza el scroll para que el paralaje no se sienta brusco
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
    // el warp decae con el tiempo hasta volver a 0
    this.warpIntensity += (0 - this.warpIntensity) * 0.06;

    this._draw(time);
    this.rafId = requestAnimationFrame(this._tick);
  }

  _draw(time) {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // fondo con leve gradiente radial (profundidad de nebulosa)
    const grad = ctx.createRadialGradient(
      width * 0.5, height * 0.35, 0,
      width * 0.5, height * 0.35, Math.max(width, height) * 0.75
    );
    grad.addColorStop(0, 'rgba(20, 16, 46, 0.55)');
    grad.addColorStop(1, 'rgba(5, 6, 10, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    this.stars.forEach((star) => {
      const layer = this.layers[star.layer];
      const parallax = this.scrollY * layer.speed;
      const mouseParallax = 8 * layer.speed * 10;

      let x = star.x + this.mouse.x * mouseParallax;
      let y = ((star.y + parallax) % (height + 40)) - 20;
      if (y < -20) y += height + 40;

      const twinkle = this.reducedMotion
        ? layer.alpha
        : layer.alpha * (0.55 + 0.45 * Math.sin(time * 0.0015 * star.twinkleSpeed + star.twinklePhase));

      if (this.warpIntensity > 0.02 && !this.reducedMotion) {
        // líneas de velocidad radiales desde el centro (salto hiperespacial)
        const dx = x - cx;
        const dy = y - cy;
        const stretch = 1 + this.warpIntensity * (4 + star.layer * 3);
        const x2 = cx + dx * stretch;
        const y2 = cy + dy * stretch;

        ctx.strokeStyle = `rgba(230, 225, 255, ${twinkle * this.warpIntensity})`;
        ctx.lineWidth = star.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(237, 238, 242, ${twinkle})`;
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('mousemove', this._onMouseMove);
  }
}
