// ============================================================================
// scrollAnimations.js — El "director de cámara" del sitio
//
// Responsabilidades:
//  1. Inicializa Lenis para un scroll suave y cinematográfico.
//  2. Conecta Lenis con GSAP ScrollTrigger (para que las animaciones
//     que dependen del scroll usen la posición suavizada).
//  3. Revela cada elemento marcado con [data-reveal] al entrar en vista.
//  4. Marca el link de navegación activo según la sección visible.
//  5. Dispara el efecto "warp" del starfield cada vez que cruzas de
//     una sección <section> a otra (el "corte de escena" de la película).
//  6. Actualiza la barra de progreso de scroll.
//
// Se importa una sola vez desde BaseLayout.astro (client:only, ver el <script>
// al final del layout). Todo vive en un solo archivo para que sea fácil de
// seguir y modificar.
// ============================================================================

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Starfield } from './starfield.js';
import { FrameSequencePlayer } from './frameSequencePlayer.js';

gsap.registerPlugin(ScrollTrigger);

// Cuántas "alturas de pantalla" de scroll dura el recorrido del Hero antes de
// soltar el pin y continuar al resto del sitio. Súbelo para un recorrido más
// largo/lento, bájalo para uno más corto/rápido.
const HERO_SCROLL_VH = 3;

export async function initCinematicScroll() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------
  // 1. Starfield de fondo
  // ---------------------------------------------------------------------
  const canvas = document.getElementById('starfield-canvas');
  const starfield = canvas ? new Starfield(canvas) : null;

  // ---------------------------------------------------------------------
  // 1b. Hero: secuencia de fotogramas pineada por scroll
  // ---------------------------------------------------------------------
  await initHeroFrameSequence({ reducedMotion });

  // ---------------------------------------------------------------------
  // 2. Lenis (scroll suave) + puente con ScrollTrigger
  // ---------------------------------------------------------------------
  let lenis = null;
  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ---------------------------------------------------------------------
  // 3. Revelado de contenido al hacer scroll
  // ---------------------------------------------------------------------
  const revealItems = gsap.utils.toArray('[data-reveal]');
  revealItems.forEach((el) => {
    const delay = Number(el.dataset.revealDelay || 0);
    gsap.fromTo(
      el,
      { opacity: 0, y: 44 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ---------------------------------------------------------------------
  // 4. Nav activo + 5. Warp al cambiar de sección
  // ---------------------------------------------------------------------
  const sections = gsap.utils.toArray('main > section[id]');
  const navLinks = gsap.utils.toArray('[data-nav-link]');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('text-nova-400', isActive);
      link.classList.toggle('text-mist-100/60', !isActive);
    });
  };

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => {
        setActiveLink(section.id);
        starfield?.warp(0.85);
      },
      onEnterBack: () => {
        setActiveLink(section.id);
        starfield?.warp(0.6);
      },
    });
  });

  // ---------------------------------------------------------------------
  // 6. Barra de progreso de scroll
  // ---------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Scroll suave para los enlaces del nav (usa Lenis si está activo)
  // ---------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -12 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Recalcula ScrollTrigger cuando cambia el tamaño de la ventana o cargan fuentes
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ============================================================================
// initHeroFrameSequence — pinea el Hero y liga el scroll a los fotogramas
// ============================================================================
async function initHeroFrameSequence({ reducedMotion }) {
  const scrubber = document.getElementById('hero-scrubber');
  const canvas = document.getElementById('hero-frame-canvas');
  const heroText = document.getElementById('hero-text');
  const loadingScreen = document.getElementById('hero-loading');
  const loadingBar = document.getElementById('hero-loading-bar');

  if (!scrubber || !canvas) return;

  // Secuencia demo incluida en public/frames/hero/:
  // ezgif-frame-001.jpg ... ezgif-frame-288.jpg.
  // Para otro cliente, reemplaza estos valores por el patron de sus frames.
  const player = new FrameSequencePlayer(canvas, {
    basePath: '/frames/hero/ezgif-frame-',
    frameCount: 288,
    padLength: 3,
    extension: 'jpg',
  });

  await player.preload((progress) => {
    if (loadingBar) loadingBar.style.width = `${Math.round(progress * 100)}%`;
  });

  player.drawFrame(0);

  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.remove(), 500);
  }

  // Si el usuario pide menos movimiento: se muestra el primer fotograma fijo,
  // sin pin ni scrubbing, y el texto queda siempre visible.
  if (reducedMotion) return;

  const frameState = { frame: 0 };

  gsap.timeline({
    scrollTrigger: {
      trigger: scrubber,
      start: 'top top',
      end: () => `+=${window.innerHeight * HERO_SCROLL_VH}`,
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
    },
  })
    // 0 → 1: avanza los fotogramas a lo largo de todo el recorrido
    .to(
      frameState,
      {
        frame: player.frameCount - 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => player.drawFrame(frameState.frame),
      },
      0
    )
    // 0.45 → 0.7: el texto se desvanece hacia la segunda mitad
    .to(heroText, { opacity: 0, y: -30, ease: 'none', duration: 0.25 }, 0.45)
    // 0.8 → 1: el canvas se desvanece y revela el starfield procedural detrás
    .to(canvas, { opacity: 0, ease: 'none', duration: 0.2 }, 0.8);
}
