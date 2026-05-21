/* ═══════════════════════════════════════════════════════════════════
   PRELOADER  ·  "The brand mark arrives"
   Sequence:
     1. Navy field with diagonal orange light leaks (CSS animated)
     2. The D-mark image fades + scales into view (CSS animated)
     3. An orange halo pulses behind the dot (CSS animated)
     4. Counter ticks 0→100 while phase text updates
     5. Brief overexposure flash
     6. Preloader fades, hero crossfades in
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Counter + phase text ───
  const pctEl     = document.getElementById('preloader-pct');
  const phaseEl   = document.getElementById('preloader-phase');
  const preloader = document.getElementById('preloader');

  const PHASES = [
    { upTo: 25,  label: 'PREPARING THE STUDIO' },
    { upTo: 55,  label: 'CALIBRATING THE LENS' },
    { upTo: 85,  label: 'COMPOSING THE FRAME' },
    { upTo: 100, label: 'READY' },
  ];

  // ─── Wait for the D-mark image AND the first hero slide to decode ───
  // (so the preloader doesn't dismiss to a blank, half-loaded page)
  const markImg = document.getElementById('preloader-d-img');
  const heroImg =
    document.querySelector('.reel__slide.is-active img') ||
    document.querySelector('.hero img');

  const trackedImgs = [markImg, heroImg].filter(Boolean);
  let pendingImgs = trackedImgs.length;
  if (pendingImgs === 0) pendingImgs = 0;

  function imgDone() {
    if (--pendingImgs <= 0) imagesReady = true;
  }
  let imagesReady = false;
  trackedImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      imgDone();
    } else {
      img.addEventListener('load',  imgDone, { once: true });
      img.addEventListener('error', imgDone, { once: true }); // don't block forever
    }
  });
  if (trackedImgs.length === 0) imagesReady = true;

  // ─── Run the sequence ───
  const TOTAL = 5400; // ms — paced to match the develop + heartbeat animation
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const linear = Math.min(1, elapsed / TOTAL);

    // Cubic-out with a tiny stutter near 70% — feels mechanical-but-organic
    const eased = easeOutCubic(linear);
    const stutter = linear > 0.65 && linear < 0.72 ? -0.02 : 0;
    const pct = Math.max(0, Math.min(100, Math.round((eased + stutter) * 100)));

    if (pctEl) pctEl.textContent = String(pct).padStart(3, '0');
    const phase = PHASES.find((p) => pct <= p.upTo) || PHASES[PHASES.length - 1];
    if (phaseEl && phaseEl.textContent !== phase.label) phaseEl.textContent = phase.label;

    if (linear < 1 || !imagesReady) {
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
      'opacity:0;pointer-events:none;transition:opacity 0.2s ease-out;';
    document.body.appendChild(flash);

    requestAnimationFrame(() => { flash.style.opacity = '0.92'; });

    setTimeout(() => {
      flash.style.opacity = '0';
      preloader.classList.add('is-done');

      window.dispatchEvent(new CustomEvent('preloader:done'));

      setTimeout(() => flash.remove(), 600);
    }, 200);
  }

  requestAnimationFrame(tick);

  // Safety net — never trap the user behind the preloader
  setTimeout(() => {
    if (!preloader.classList.contains('is-done')) {
      imagesReady = true;
      finishPreloader();
    }
  }, 8000);
})();

