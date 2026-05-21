/* ═══════════════════════════════════════════════════════════════════
   CATEGORY PAGE
   Reads ?cat=<key> from the URL, looks up CATEGORY_DATA, and renders:
     1. Hero title / blurb / num / count
     2. Masonry photo grid with per-photo client + project captions
     3. Previous / Next category navigation
     4. Shared Frames overlay (top-right menu)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Parse ?cat=… from the URL ───
  const params = new URLSearchParams(window.location.search);
  const requestedKey = (params.get('cat') || 'lifestyle').toLowerCase();
  const DATA = (window.CATEGORY_DATA || {});
  const ORDER = (window.CATEGORY_ORDER || Object.keys(DATA));

  // Fallback if someone hits an unknown ?cat=
  const cat = DATA[requestedKey] || DATA[ORDER[0]];
  if (!cat) return;

  // ─── Populate the hero ───
  document.title = 'Daya Studios — ' + cat.name;
  setText('cat-num',   cat.num);
  setText('cat-count', cat.count);
  setText('cat-title', cat.title);
  setText('cat-blurb', cat.blurb);

  // ─── Render the photo grid ───
  const grid = document.getElementById('photos');
  if (grid) {
    grid.innerHTML = ''; // safety
    cat.photos.forEach((p, i) => {
      const figure = document.createElement('figure');
      figure.className = 'photo photo--' + (p.aspect || 'landscape');
      figure.style.setProperty('--idx', i);

      const img = document.createElement('img');
      img.src = p.src;
      img.alt = (p.project || cat.name) + ' — ' + (p.client || 'Daya Studios');
      img.loading = i < 3 ? 'eager' : 'lazy';
      img.decoding = 'async';
      // Local-first, Unsplash fallback (same pattern as the home page)
      img.addEventListener('error', function onErr() {
        if (this.dataset.fallbackTried) return;
        this.dataset.fallbackTried = '1';
        this.src = p.fallback;
      }, { once: false });

      const caption = document.createElement('figcaption');
      caption.innerHTML =
        '<span class="photo__client">' + escapeHtml(p.client || '—') + '</span>' +
        '<span class="photo__project">' + escapeHtml(p.project || '') +
          (p.year ? ' <span class="photo__year">· ' + escapeHtml(p.year) + '</span>' : '') +
        '</span>';

      figure.appendChild(img);
      figure.appendChild(caption);
      grid.appendChild(figure);
    });
  }

  // ─── Reveal photos as they enter the viewport ───
  if ('IntersectionObserver' in window) {
    const photoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            photoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.photo').forEach((p) => photoObserver.observe(p));
  } else {
    document.querySelectorAll('.photo').forEach((p) => p.classList.add('is-revealed'));
  }

  // ─── Wire up Previous / Next category navigation ───
  const idx = ORDER.indexOf(requestedKey);
  const prevKey = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
  const nextKey = ORDER[(idx + 1) % ORDER.length];

  const prevEl = document.getElementById('cat-prev');
  const nextEl = document.getElementById('cat-next');
  if (prevEl && DATA[prevKey]) {
    prevEl.href = 'category.html?cat=' + prevKey;
    setNavName(prevEl, DATA[prevKey].num + ' · ' + DATA[prevKey].name);
  }
  if (nextEl && DATA[nextKey]) {
    nextEl.href = 'category.html?cat=' + nextKey;
    setNavName(nextEl, DATA[nextKey].num + ' · ' + DATA[nextKey].name);
  }

  // ─── Frames overlay (shared menu) — same behaviour as the home page ───
  initFramesOverlay();

  // ─── Helpers ───
  function setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  function setNavName(el, name) {
    const span = el.querySelector('.cat-nav__name');
    if (span) span.textContent = name;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function initFramesOverlay() {
    const overlay = document.getElementById('index-overlay');
    const trigger = document.getElementById('nav-trigger');
    const closeBtn = document.getElementById('index-close');
    const items = document.querySelectorAll('.index-list__item');
    if (!overlay || !trigger) return;

    const open = () => {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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
        setTimeout(() => { window.location.href = href; }, 180);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }
})();
