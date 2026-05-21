/* ═══════════════════════════════════════════════════════════════════
   MAIN  ·  cursor, lens flare, smooth scroll, reveal animations,
   index overlay, keyboard navigation
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Wait for the preloader to finish before booting the show ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  function boot() {
    initLenis();
    initCursorAndFlare();
    initHeroReveal();
    initPlateReveals();
    initIndexOverlay();
    initKeyboardNav();
    initPlateCounter();
    initCTAs();
  }

  /* ─────────────────────────────────────────────────────────────────
     LENIS  ·  smooth physics-based scroll
     ───────────────────────────────────────────────────────────────── */
  let lenis = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Bridge to ScrollTrigger if it's loaded
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  function scrollTo(targetOrEl) {
    const el = typeof targetOrEl === 'string'
      ? document.querySelector(targetOrEl)
      : targetOrEl;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }

  /* ─────────────────────────────────────────────────────────────────
     CURSOR + LENS FLARE  ·  the "wow" feature
     The flare is a screen-blended warm glow that follows the cursor.
     Over photographs (dark areas), it reads as warm lens glare.
     Over UI chrome, it disappears thanks to screen blending.
     ───────────────────────────────────────────────────────────────── */
  function initCursorAndFlare() {
    const cursor = document.getElementById('cursor');
    const flare = document.getElementById('flare');
    const label = document.getElementById('cursor-label');
    if (!cursor || !flare) return;

    // Position state (target vs current for lerping)
    let mx = window.innerWidth / 2,  my = window.innerHeight / 2;
    let cx = mx,                     cy = my;
    let fx = mx,                     fy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (flare.style.opacity === '' || !flare.classList.contains('is-on')) {
        flare.classList.add('is-on');
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => flare.classList.remove('is-on'));
    window.addEventListener('blur', () => flare.classList.remove('is-on'));

    // Lerp loop — separate speeds for the crisp ring (fast) and warm
    // flare (slow, with momentum, like a real lens has weight)
    function frame() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      fx += (mx - fx) * 0.06;
      fy += (my - fy) * 0.06;

      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      flare.style.transform  = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Hover/label states for interactive elements
    const interactive = 'a, button, [data-zoom], .index-list__item, .cta';
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest(interactive);
      if (!t) return;
      cursor.classList.add('is-hover');
      // Custom label?
      let txt = '';
      if (t.matches('[data-zoom]')) txt = 'View →';
      else if (t.matches('.index-list__item')) txt = 'Enter →';
      else if (t.matches('.cta')) txt = '';
      if (txt) {
        label.textContent = txt;
        cursor.classList.add('is-label');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest(interactive);
      if (!t) return;
      cursor.classList.remove('is-hover', 'is-label');
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-press'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-press'));
  }

  /* ─────────────────────────────────────────────────────────────────
     HERO REVEAL  ·  mask-reveal headline + lede after preloader
     ───────────────────────────────────────────────────────────────── */
  function initHeroReveal() {
    const lines = document.querySelectorAll('.hero .line__inner');
    const lede  = document.querySelector('.hero__lede');
    const eyebrow = document.querySelector('.hero__eyebrow');
    const cta = document.querySelectorAll('.hero__cta-row > *');
    const hint = document.querySelector('.hero__scroll-hint');

    // Initial state
    if (lede)    lede.style.cssText    = 'opacity:0; transform:translateY(20px); transition:opacity .9s ease, transform .9s var(--ease-out-expo);';
    if (eyebrow) eyebrow.style.cssText = 'opacity:0; transition:opacity 1s ease;';
    cta.forEach(el => {
      el.style.cssText = 'opacity:0; transform:translateY(14px); transition:opacity .8s ease, transform .8s var(--ease-out-expo);';
    });
    if (hint) hint.style.cssText = 'opacity:0; transition:opacity 1.2s ease;';

    function reveal() {
      // Eyebrow first
      if (eyebrow) eyebrow.style.opacity = '1';

      // Stagger the headline lines with a mask-style reveal
      if (typeof gsap !== 'undefined' && lines.length) {
        gsap.to(lines, {
          y: '0%',
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.12,
          delay: 0.25,
        });
      } else {
        lines.forEach((l, i) => {
          setTimeout(() => { l.style.transform = 'translateY(0%)'; l.style.transition = 'transform 1.4s var(--ease-out-expo)'; }, 250 + i * 120);
        });
      }

      setTimeout(() => {
        if (lede) { lede.style.opacity = '1'; lede.style.transform = 'translateY(0)'; }
      }, 900);

      cta.forEach((el, i) => {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 1100 + i * 90);
      });

      setTimeout(() => { if (hint) hint.style.opacity = '1'; }, 1500);
    }

    window.addEventListener('preloader:done', reveal, { once: true });
    // Fallback if preloader already finished before this attached
    if (document.getElementById('preloader')?.classList.contains('is-done')) reveal();
  }

  /* ─────────────────────────────────────────────────────────────────
     PLATE REVEALS  ·  scroll-triggered, image parallax zoom
     ───────────────────────────────────────────────────────────────── */
  function initPlateReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.plate').forEach((plate) => {
      const num = plate.querySelector('.plate__num');
      const cat = plate.querySelector('.plate__cat');
      const title = plate.querySelector('.plate__title');
      const blurb = plate.querySelector('.plate__blurb');
      const count = plate.querySelector('.plate__count');
      const img = plate.querySelector('.plate__figure img');
      const fig = plate.querySelector('.plate__figure');

      // Initial states
      gsap.set([num, cat, title, blurb, count], { y: 40, opacity: 0 });
      gsap.set(fig, { clipPath: 'inset(8% 8% 8% 8%)' });

      // Reveal on enter
      ScrollTrigger.create({
        trigger: plate,
        start: 'top 75%',
        once: false,
        onEnter: () => {
          gsap.to(fig, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' });
          gsap.to([num, cat, title, blurb, count], {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            delay: 0.15,
          });
        },
      });

      // Parallax zoom on the image as the section scrolls past
      if (img) {
        gsap.to(img, {
          scale: 1.18,
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: plate,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     INDEX OVERLAY  ·  the curated exhibition menu
     ───────────────────────────────────────────────────────────────── */
  function initIndexOverlay() {
    const overlay = document.getElementById('index-overlay');
    const trigger = document.getElementById('nav-trigger');
    const closeBtn = document.getElementById('index-close');
    const items = document.querySelectorAll('.index-list__item');
    if (!overlay || !trigger) return;

    const open = () => {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      if (lenis) lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
    };

    trigger.addEventListener('click', () => {
      overlay.classList.contains('is-open') ? close() : open();
    });
    closeBtn?.addEventListener('click', close);

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        close();
        setTimeout(() => scrollTo(target), 380);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     KEYBOARD NAVIGATION  ·  arrow keys step through plates
     ───────────────────────────────────────────────────────────────── */
  function initKeyboardNav() {
    const plates = Array.from(document.querySelectorAll('[data-plate]'));
    if (!plates.length) return;

    const currentIndex = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let best = 0, bestDelta = Infinity;
      plates.forEach((p, i) => {
        const rect = p.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const center = top + rect.height / 2;
        const delta = Math.abs(center - mid);
        if (delta < bestDelta) { bestDelta = delta; best = i; }
      });
      return best;
    };

    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(plates.length - 1, currentIndex() + 1);
        scrollTo(plates[next]);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(0, currentIndex() - 1);
        scrollTo(plates[prev]);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     PLATE COUNTER  ·  the side "Plate 01/09" updates as you scroll
     ───────────────────────────────────────────────────────────────── */
  function initPlateCounter() {
    const el = document.getElementById('plate-current');
    const plates = document.querySelectorAll('[data-plate]');
    if (!el || !plates.length) return;

    let current = '01';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const n = entry.target.getAttribute('data-plate');
            if (n && n !== '00' && n !== current) {
              current = n;
              el.textContent = n;
            }
          }
        });
      },
      { threshold: [0.4, 0.6] }
    );
    plates.forEach((p) => observer.observe(p));
  }

  /* ─────────────────────────────────────────────────────────────────
     CTA BUTTONS · data-scroll-to handler
     ───────────────────────────────────────────────────────────────── */
  function initCTAs() {
    document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollTo(btn.getAttribute('data-scroll-to'));
      });
    });
    // Internal hash links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href.length > 1) {
          e.preventDefault();
          scrollTo(href);
        }
      });
    });
  }
})();
