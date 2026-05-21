/* ═══════════════════════════════════════════════════════════════════
   PRELOADER  ·  "D-mark draws"
   Sequence:
     1. Navy field with diagonal orange light leaks (CSS animated)
     2. The D-mark outline draws itself via stroke-dashoffset
     3. The orange dot inside the D scales in with a glow halo
     4. Counter ticks 0→100 while phase text updates
     5. Brief overexposure flash
     6. Preloader fades, hero focus-pulls in
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── SVG D-mark elements ───
  const markPath = document.getElementById('preloader-d-path');
  const markDot  = document.getElementById('preloader-d-dot');
  const markReg  = document.getElementById('preloader-d-reg');

  let pathLength = 0;
  if (markPath && typeof markPath.getTotalLength === 'function') {
    pathLength = markPath.getTotalLength();
    markPath.style.strokeDasharray  = pathLength;
    markPath.style.strokeDashoffset = pathLength;
  }

  // Drive the D-mark in lockstep with the counter:
  //   t = 0   → outline invisible, dot hidden
  //   t = 0.55 → outline fully drawn
  //   t = 0.75 → orange dot fades + scales in
  //   t = 0.90 → registered mark fades in
  function setMarkProgress(t) {
    if (markPath && pathLength) {
      const drawT = Math.min(1, t / 0.55);
      markPath.style.strokeDashoffset = pathLength * (1 - drawT);
    }
    if (markDot) {
      const dotT = Math.min(1, Math.max(0, (t - 0.55) / 0.20));
      markDot.style.opacity   = dotT;
      markDot.style.transform = 'scale(' + (0.4 + dotT * 0.6) + ')';
    }
    if (markReg) {
      const regT = Math.min(1, Math.max(0, (t - 0.75) / 0.20));
      markReg.style.opacity = regT;
    }
  }
  setMarkProgress(0);

  // ─── Counter + phase text ───
  const pctEl = document.getElementById('preloader-pct');
  const phaseEl = document.getElementById('preloader-phase');
  const preloader = document.getElementById('preloader');

  const PHASES = [
    { upTo: 25,  label: 'PREPARING THE STUDIO' },
    { upTo: 55,  label: 'CALIBRATING THE LENS' },
    { upTo: 85,  label: 'COMPOSING THE FRAME' },
    { upTo: 100, label: 'READY' },
  ];

  // ─── Wait for any hero slide image to decode before completing ───
  // (hero has multiple slides; first one is the active one we need)
  const heroImg =
    document.querySelector('.reel__slide.is-active img') ||
    document.querySelector('.hero__img') ||
    document.querySelector('.hero img');
  let heroReady = false;
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      heroReady = true;
    } else {
      heroImg.addEventListener('load',  () => { heroReady = true; }, { once: true });
      heroImg.addEventListener('error', () => { heroReady = true; }, { once: true });
    }
  } else {
    heroReady = true;
  }

  // ─── Run the sequence ───
  const TOTAL = 3400; // ms of the visible animation
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const linear = Math.min(1, elapsed / TOTAL);

    // Ease the counter (cubic out with a tiny stutter near 70%)
    const eased = easeOutCubic(linear);
    const stutter = linear > 0.65 && linear < 0.72 ? -0.02 : 0;
    const pct = Math.max(0, Math.min(100, Math.round((eased + stutter) * 100)));

    if (pctEl) pctEl.textContent = String(pct).padStart(3, '0');
    const phase = PHASES.find((p) => pct <= p.upTo) || PHASES[PHASES.length - 1];
    if (phaseEl && phaseEl.textContent !== phase.label) phaseEl.textContent = phase.label;

    setMarkProgress(eased);

    if (linear < 1 || !heroReady) {
      requestAnimationFrame(tick);
    } else {
      finishPreloader();
    }
  }

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  // ─── Finish + hand off to main.js via custom event ───
  function finishPreloader() {
    const flash = document.createElement('div');
    flash.style.cssText =
      'position:fixed;inset:0;background:#ffffff;z-index:9998;' +
      'opacity:0;pointer-events:none;transition:opacity 0.18s ease-out;';
    document.body.appendChild(flash);

    requestAnimationFrame(() => { flash.style.opacity = '0.92'; });

    setTimeout(() => {
      flash.style.opacity = '0';
      preloader.classList.add('is-done');

      // Tell main.js the show can start
      window.dispatchEvent(new CustomEvent('preloader:done'));

      setTimeout(() => flash.remove(), 600);
    }, 180);
  }

  requestAnimationFrame(tick);

  // Safety net — never trap the user behind the preloader
  setTimeout(() => {
    if (!preloader.classList.contains('is-done')) {
      heroReady = true;
      finishPreloader();
    }
  }, 8000);
})();
