# Daya Studios — *The Darkroom Exhibition*

An experimental, dark-mode photography portfolio designed as a **cinematic gallery walk-through**, not a grid template. Every interaction is set design; the photograph is the protagonist.

> Live prototype runs as a static site — drop it into a GitHub Pages repo and it works.
> A Next.js production blueprint is at the bottom of this document.

---

## 1 · Conceptual framework

The site behaves like a curated exhibition catalog. Instead of a grid of thumbnails, the user moves through nine numbered **plates** (one per category), each presented at full viewport with editorial typography, a catalog number (`01 / 09`), a title, a blurb, and a print count.

Three ideas hold the concept together:

- **The Darkroom.** The palette is near-black, warm cream, and a single amber accent — the colors of a film darkroom under safelight. Film grain animates over everything; a soft vignette pulls the eye toward the center.
- **The Aperture.** The preloader is an 8-bladed iris that opens with the loading counter. The same iris language is echoed by the cursor ring, the lens flare, and the focus-pull animation on the hero image.
- **The Catalog.** Navigation is not a navbar but an **Index overlay** — a typeset list of plates that hover-reveals a thumbnail, like flipping through an exhibition program.

### Aesthetic decisions

| Decision | Why |
|---|---|
| Fraunces (serif display) | Editorial weight, optical-size variable axis lets headlines feel like printed plates |
| IBM Plex Mono (numerals) | Catalog/spec numerals — film stock notation, ISO/aperture readouts |
| `#0a0908` ink + `#f3ece0` paper | Warm black + warm cream — never blue-tinted; reads as analog paper, not screen |
| `#d4a574` amber accent | The color of a darkroom safelight and warm tungsten — single accent, used sparingly |
| Animated SVG grain + vignette | Persistent atmosphere; the screen is never "clean" |
| Custom cursor with `mix-blend-mode: difference` | A small viewfinder ring that adapts to whatever it's over |

---

## 2 · User journey map · Home page

```
   ┌──────────────────────────────────────────────────────────────────┐
   │ 0 · ARRIVAL                                                       │
   │   Black screen. A warm light leak sweeps diagonally.              │
   │   An aperture iris appears, nearly closed, glowing faintly.       │
   │   Catalog counter ticks: 000 → 100. Phase text shifts:            │
   │     "EXPOSING THE PLATE" → "DEVELOPING" → "FIXING" → "READY"      │
   │   At 100, a brief over-exposure flash; iris opens fully.          │
   └──────────────────────────────────────────────────────────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │ 1 · HERO                                                          │
   │   Full-bleed photograph focus-pulls from scale(1.08) to scale(1). │
   │   Three headline lines mask-reveal upward in 1.4s stagger.        │
   │   Eyebrow, lede, CTAs cascade in with eased delays.               │
   │   The "Scroll" hint drips at the bottom.                          │
   │   THROUGHOUT: cursor + warm lens flare follows the pointer.       │
   │   Three.js dust motes drift in the background, parallaxing.       │
   └──────────────────────────────────────────────────────────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │ 2 · ENTER THE GALLERY  (Lenis smooths the wheel)                  │
   │   Side-mounted "Plate 01/09" counter activates and updates as     │
   │   each plate crosses center-screen (IntersectionObserver).        │
   └──────────────────────────────────────────────────────────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │ 3 · PLATES 01 → 09                                                │
   │   Each plate enters with a clip-path inset reveal (1.4s expo.out) │
   │   while text staggers in. As the user keeps scrolling, the image  │
   │   parallax-zooms (scale 1.06 → 1.18, scrubbed to scroll).         │
   │   Even/odd plates alternate layout side for editorial rhythm.     │
   │   Hover: focus-pull border slides inward, image breathes.         │
   │   Categories: Lifestyle · People · Products · Automotive ·        │
   │               Commercial · Food & Drink · Restaurants & Hotels ·  │
   │               Travel · Artwork                                    │
   └──────────────────────────────────────────────────────────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │ 4 · INDEX (any time)                                              │
   │   Tap "Index" top-right. Backdrop blurs, list staggers in.        │
   │   Hovering an item slides a thumbnail in from the right.          │
   │   Click: overlay closes, page smoothly scrolls to that plate.     │
   │   Esc closes. ↑↓ arrows step plate-by-plate at any time.          │
   └──────────────────────────────────────────────────────────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │ 5 · COLOPHON                                                      │
   │   "End of exhibition." Mailto, studio cities, social, press list. │
   │   © Daya Studios MMXXV.                                           │
   └──────────────────────────────────────────────────────────────────┘
```

---

## 3 · Technical architecture

### Prototype (this repo) — static, zero-build

```
portfolio/
├── index.html              ← Single-page document
├── assets/
│   ├── css/
│   │   └── style.css       ← Theme tokens, preloader, hero, plates, overlay
│   ├── js/
│   │   ├── preloader.js    ← Aperture iris + counter + hand-off event
│   │   ├── main.js         ← Lenis · cursor · flare · GSAP reveals · overlay · keyboard
│   │   └── three-scene.js  ← ES module: dust motes (Three.js via importmap)
│   └── img/                ← (your photographs go here in production)
└── README.md
```

**Why no build step?**
The prototype is intentionally framework-free so you can `git push` to a GitHub Pages branch and have a live URL in two minutes. Every dependency is loaded from a CDN with an `importmap` for Three.js. There is nothing to compile.

### Vendor scripts (all via CDN)

| Library | Why we use it | Loaded from |
|---|---|---|
| **GSAP 3.12** + ScrollTrigger | The only animation engine with the precision needed for editorial reveals and scrubbed scroll | cdnjs |
| **Lenis 1.0.42** | Physics-based smooth scroll with momentum — gives the gallery its "spatial" feel | jsDelivr |
| **Three.js r160** | Subtle background dust motes; canvas-mounted, screen-blended | jsDelivr (via importmap) |

### Production blueprint — Next.js port

For a long-term studio site, port to **Next.js 14 App Router**:

```
app/
├── layout.tsx              ← Persistent chrome (cursor, grain, flare, dust)
├── page.tsx                ← Home: hero + plates manifest
├── (gallery)/
│   └── [category]/page.tsx ← Individual category galleries with deep linking
├── about/page.tsx
├── contact/page.tsx
components/
├── Preloader/              ← Same iris logic, refactored to React + Motion
├── LensFlare/
├── Cursor/
├── Plate/                  ← Receives image manifest, handles parallax
├── IndexOverlay/
├── DustScene/              ← React Three Fiber wrapper of three-scene.js
lib/
├── images.ts               ← Manifest: { category, src, w, h, blurDataURL, alt }
├── lenis.ts                ← Singleton, bridged to ScrollTrigger
└── motion.ts               ← Shared easings + variants
public/
└── images/                 ← Optimized renditions (built by sharp)
```

Recommended packages:

- `next` 14, `react` 18, `typescript`
- `gsap` + `@gsap/react` for declarative animations
- `lenis` (the official npm package, same author as studio-freight)
- `three` + `@react-three/fiber` + `@react-three/drei`
- `framer-motion` for declarative entry animations on overlay/index
- `sharp` for the build-time image pipeline

---

## 4 · High-resolution image performance

A photographer's portfolio that ships 10MB hero images is a portfolio that loses its first client to a 3-second blank screen. The plan:

1. **Render at three sizes per image** (`480w`, `1200w`, `2400w`) and serve via `srcset` + `sizes`. The browser picks the right rendition for the viewport.
2. **Encode AVIF first, then WebP, with JPEG fallback** using `<picture>`. AVIF cuts file size 30–50% vs JPEG with no perceptual loss on dark photography.
3. **Blur-up placeholders** generated at build time (sharp `.resize(20).blur()` → 600 bytes base64) inlined as `background-image` until the full image decodes.
4. **Preload only the hero**. Everything else uses `loading="lazy"` and `decoding="async"`. The prototype already does this — see the `<link rel="preload">` in `index.html`.
5. **Preconnect to the image CDN** (already wired) so the TLS handshake is paid up-front, not on first image request.
6. **In production**, replace direct Unsplash URLs with a Cloudinary, Imgix, or `next/image` pipeline. `next/image` handles all of the above automatically.

Concrete `<picture>` shape in production:

```html
<picture>
  <source type="image/avif" srcset="plate-01-480.avif 480w, plate-01-1200.avif 1200w, plate-01-2400.avif 2400w" sizes="(min-width:900px) 50vw, 100vw">
  <source type="image/webp" srcset="plate-01-480.webp 480w, plate-01-1200.webp 1200w, plate-01-2400.webp 2400w" sizes="(min-width:900px) 50vw, 100vw">
  <img src="plate-01-1200.jpg" alt="..." loading="lazy" decoding="async" width="1200" height="1500">
</picture>
```

---

## 5 · The "Wow" feature — cursor-following lens flare

A soft, warm radial gradient (`600 × 600`) follows the cursor with **slower lerp than the cursor ring itself** — so the flare lags slightly, giving it the weight of real lens glass. It's set to `mix-blend-mode: screen`, which means it only glows over dark areas (i.e. the photography), and disappears over light text or UI chrome. Combined with the parallax zoom on plate images, hovering a photograph feels like physically lifting it into the light.

The implementation is in `assets/js/main.js` under `initCursorAndFlare()`. Two pointer trackers, one ring (fast), one flare (slow with momentum). On phones (`pointer: coarse`), both are hidden and the native cursor returns.

---

## 6 · Replacing the placeholder images with the real Daya Studios work

The prototype uses **Unsplash placeholders** — license-clear, high-quality, and tonally consistent with the brief. They are not the real Daya Studios photographs. **Do not** publish the live site with these in place.

To swap:

1. Export the real Daya Studios photos at 2400px on the long edge, JPEG quality 85.
2. Run them through [Squoosh](https://squoosh.app) or `sharp` to produce AVIF + WebP + JPEG at 480 / 1200 / 2400.
3. Drop them in `assets/img/` (or your image CDN).
4. Open `index.html` and replace the nine `<img src="https://images.unsplash.com/…">` URLs inside `.plate__figure` and the matching thumbnails in the `.index-list`.
5. Update the hero image at the top of `<body>` (and the matching `<link rel="preload">` in `<head>`).
6. Update the headline copy and blurbs to the studio's voice — placeholder text is intentionally generic.

---

## 7 · Browser support, accessibility, performance budgets

- **Targets:** Chrome / Safari / Firefox / Edge, last two versions. iOS 15+. Android Chrome 100+.
- **`prefers-reduced-motion`**: kills the grain, the lens flare, the dust, and all transitions. The site still works — just static.
- **Keyboard:** `↑` / `↓` step through plates, `Esc` closes the index, all CTAs are reachable by `Tab`.
- **Mobile:** custom cursor and flare are disabled on `pointer: coarse`. The side chromes hide on narrow viewports. Hover states fall back gracefully.
- **Budget:** Initial HTML+CSS+JS < 60KB gzipped (vendor JS not counted, all cacheable from CDN). Hero image LCP target: < 1.8s on a fast 3G connection assuming the production image pipeline above.

---

## 8 · Running locally

```bash
# Any static server will do
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node:

```bash
npx serve .
```

## 9 · Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit · The Darkroom Exhibition"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source: `main` / root**. Site is live at `https://<you>.github.io/<repo>/`.

---

## 10 · Credits

- Typography: [Fraunces](https://fonts.google.com/specimen/Fraunces) by Undercase Type; [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) by IBM.
- Placeholder photography: [Unsplash](https://unsplash.com) contributors (free, license-clear).
- Motion: [GSAP](https://gsap.com) by GreenSock. [Lenis](https://lenis.darkroom.engineering) by Studio Freight / Darkroom.
- 3D: [Three.js](https://threejs.org).
