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
    initHeroReveal();
    initHeroSlideshow();
    initHeroVisibility();
    initPlateReveals();
    initIndexOverlay();
    initKeyboardNav();
    initPlateCounter();
    initCTAs();
    initBookingForm();
    initClientsReveal();
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
  function initHeroSlideshow() {
    const reel = document.getElementById('hero-reel');
    if (!reel) return;
    const slides = Array.from(reel.querySelectorAll('.reel__slide'));
    if (slides.length === 0) return;

    const chips = Array.from(document.querySelectorAll('#hero-chips .chip'));
    const catEl = document.querySelector('[data-current-cat]');

    const ROTATE_MS = 5500;
    let index = 0;
    let timerId = null;
    let paused = false;

    function setSlide(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
      chips.forEach((c, k) => c.classList.toggle('is-active', k === index));
      if (catEl) {
        const cat = slides[index].getAttribute('data-cat');
        if (cat) catEl.textContent = cat;
      }
    }

    function tick() {
      if (paused) return;
      setSlide(index + 1);
    }

    function startTimer() {
      stopTimer();
      timerId = setInterval(tick, ROTATE_MS);
    }
    function stopTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; }
    }

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Chip interactions: hover previews (desktop only), click jumps to plate
    chips.forEach((chip, k) => {
      if (hasHover) {
        chip.addEventListener('mouseenter', () => {
          paused = true;
          stopTimer();
          setSlide(k);
        });
        chip.addEventListener('mouseleave', () => {
          paused = false;
          startTimer();
        });
        chip.addEventListener('focus', () => { paused = true; stopTimer(); setSlide(k); });
        chip.addEventListener('blur',  () => { paused = false; startTimer(); });
      }
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const target = chip.getAttribute('data-cat-link');
        if (!target) return;
        // Support both URL navigation (category pages) and on-page scroll anchors
        if (target.startsWith('#')) scrollTo(target);
        else window.location.href = target;
      });
    });

    setSlide(0);
    startTimer();
  }

  /* ─────────────────────────────────────────────────────────────────
     HERO VISIBILITY · toggles body.hero-in-view for logo/chrome swap
     ───────────────────────────────────────────────────────────────── */
  function initHeroVisibility() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Start in the hero state since the page loads at the top
    document.body.classList.add('hero-in-view');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Consider hero "in view" while more than 30% of it is visible
          document.body.classList.toggle('hero-in-view', entry.intersectionRatio > 0.3);
        });
      },
      { threshold: [0, 0.3, 0.6, 1] }
    );
    observer.observe(hero);
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
        const href = item.getAttribute('data-href');
        if (!href) return;
        close();
        setTimeout(() => { window.location.href = href; }, 220);
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
  /* ─────────────────────────────────────────────────────────────────
     BOOKING FORM · mailto submission with formatted body
     ───────────────────────────────────────────────────────────────── */
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    const status = document.getElementById('booking-status');

    const setStatus = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('is-error', 'is-success');
      if (kind) status.classList.add('is-' + kind);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name     = (data.get('name')     || '').toString().trim();
      const email    = (data.get('email')    || '').toString().trim();
      const phone    = (data.get('phone')    || '').toString().trim();
      const project  = (data.get('project')  || '').toString().trim();
      const date     = (data.get('date')     || '').toString().trim();
      const duration = (data.get('duration') || '').toString().trim();
      const slot     = (data.get('slot')     || '').toString().trim();
      const message  = (data.get('message')  || '').toString().trim();

      if (!name || !email) {
        setStatus('Please add your name and email.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('That email looks off — please check.', 'error');
        return;
      }

      const lines = [
        'Booking request from the website',
        '',
        'Name:        ' + name,
        'Email:       ' + email,
        'Phone:       ' + (phone || '—'),
        'Project:     ' + (project || '—'),
        'Date:        ' + (date || '—'),
        'Duration:    ' + (duration || '—'),
        'Time slot:   ' + (slot || '—'),
        '',
        'Brief / message:',
        message || '(none provided)',
        '',
        '— Sent from dayastudios.com'
      ];
      const subject = 'Booking — ' + name + (project ? ' · ' + project : '');
      const body = lines.join('\n');

      const mailto = 'mailto:studio@dayastudios.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
      setStatus('Email app opening — send to finish.', 'success');
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     SECTION REVEALS · clients + gallery mosaic mask-reveal on entry
     ───────────────────────────────────────────────────────────────── */
  function initClientsReveal() {
    const sections = document.querySelectorAll('.clients, .gallery');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => observer.observe(s));
  }

})();
