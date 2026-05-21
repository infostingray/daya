/* ═══════════════════════════════════════════════════════════════════
   PRELOADER  ·  "Exposing the plate"
   Sequence:
     1. Place 8 aperture blades around the center (fully closed)
     2. Light leaks sweep across (CSS handles this)
     3. Counter ticks 0→100 while blades rotate open
     4. Brief overexposure flash
     5. Iris opens fully, preloader fades, hero focus-pulls in
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Position the 8 aperture blades into an iris formation ───
  // Each blade is a triangle pointing outward; we rotate it around the
  // origin by 45° increments and slide it toward the center on "open".
  const blades = document.querySelectorAll('.preloader__iris .blade');
  const BLADE_COUNT = blades.length;
  const ANGLE_STEP = 360 / BLADE_COUNT;

  // Closed state: blades rotated to fully occlude the center.
  // Open state: blades rotated outward so the center is exposed.
  function setApertureOpenness(t) {
    // t = 0 (closed) → 1 (open)
    // We rotate each blade by its base angle, then add an offset that
    // grows with t to swing the blade outward.
    const swing = -45 * t; // degrees of additional rotation per blade
    blades.forEach((blade, i) => {
      const base = i * ANGLE_STEP;
      blade.setAttribute(
        'transform',
        `rotate(${base + swing}) translate(${-30 + t * 28}, 0)`
      );
    });
  }

  // Start nearly closed (a sliver open so the warm glow shows through)
  setApertureOpenness(0.05);

  // ─── Counter + phase text ───
  const pctEl = document.getElementById('preloader-pct');
  const phaseEl = document.getElementById('preloader-phase');
  const preloader = document.getElementById('preloader');

  const PHASES = [
    { upTo: 25,  label: 'EXPOSING THE PLATE' },
    { upTo: 55,  label: 'DEVELOPING' },
    { upTo: 85,  label: 'FIXING THE IMAGE' },
    { upTo: 100, label: 'READY · DRY TO TOUCH' },
  ];

  // ─── Resource awareness ───
  // We wait for the hero image to actually decode before completing,
  // so the iris doesn't open onto a blank or half-loaded plate.
  const heroImg = document.querySelector('.hero__img');
  let heroReady = false;
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      heroReady = true;
    } else {
      heroImg.addEventListener('load', () => { heroReady = true; }, { once: true });
      heroImg.addEventListener('error', () => { heroReady = true; }, { once: true }); // don't block forever
    }
  } else {
    heroReady = true;
  }

  // ─── Run the sequence ───
  const TOTAL = 3400;       // ms of the visible exposure animation
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const linear = Math.min(1, elapsed / TOTAL);

    // Ease the counter so it feels mechanical-but-organic
    // (cubic ease-out with a tiny stutter near 70% for "developing")
    const eased = easeOutCubic(linear);
    const stutter = linear > 0.65 && linear < 0.72 ? -0.02 : 0;
    const pct = Math.max(0, Math.min(100, Math.round((eased + stutter) * 100)));

    // Update DOM
    pctEl.textContent = String(pct).padStart(3, '0');
    const phase = PHASES.find(p => pct <= p.upTo) || PHASES[PHASES.length - 1];
    if (phaseEl.textContent !== phase.label) phaseEl.textContent = phase.label;

    // Aperture opens with the counter
    setApertureOpenness(eased);

    if (linear < 1 || !heroReady) {
      requestAnimationFrame(tick);
    } else {
      finishPreloader();
    }
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  // ─── Finish + hand off to main.js via custom event ───
  function finishPreloader() {
    // Brief overexposure flash
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed; inset: 0; background: var(--paper);
      z-index: 9998; opacity: 0; pointer-events: none;
      transition: opacity 0.18s ease-out;
    `;
    document.body.appendChild(flash);

    requestAnimationFrame(() => { flash.style.opacity = '0.85'; });

    setTimeout(() => {
      flash.style.opacity = '0';
      preloader.classList.add('is-done');

      // Focus pull on hero — release the initial scale and brightness
      if (heroImg) {
        heroImg.style.transform = 'scale(1)';
        heroImg.style.filter = 'brightness(0.6) contrast(1.05) saturate(0.95)';
      }

      // Tell main.js the show can start
      window.dispatchEvent(new CustomEvent('preloader:done'));

      setTimeout(() => flash.remove(), 600);
    }, 180);
  }

  // Kick off
  requestAnimationFrame(tick);

  // Safety net: never trap the user behind the preloader
  setTimeout(() => {
    if (!preloader.classList.contains('is-done')) {
      heroReady = true;
      finishPreloader();
    }
  }, 8000);
})();
