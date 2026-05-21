/* ═══════════════════════════════════════════════════════════════════
   THREE.JS  ·  Floating "lens dust" motes
   Subtle, screen-blended particles that drift in slow currents and
   parallax to the cursor. Reads as dust in a beam of light.
   ═══════════════════════════════════════════════════════════════════ */

import * as THREE from 'three';

const canvas = document.getElementById('dust');
if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initDust(canvas);
}

function initDust(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  // ─── Build a particle field ───
  const COUNT = 180;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const speeds = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    sizes[i]  = Math.random() * 0.06 + 0.02;
    speeds[i] = Math.random() * 0.05 + 0.01;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  // ─── Soft sprite texture (radial gradient on a canvas) ───
  // A drawn texture is sharper than a plain Points material and lets
  // the dust read as warm light, not pixels.
  const tex = makeSpriteTexture();

  const material = new THREE.PointsMaterial({
    map: tex,
    color: 0xfb7f40,         // warm amber
    size: 0.18,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.85,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ─── Mouse parallax ───
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  // ─── Animate ───
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    const pos = geometry.attributes.position.array;

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3;
      // Slow vertical drift (like dust in a sunbeam)
      pos[idx + 1] += speeds[i] * 0.01;
      // Gentle horizontal sway via per-particle phase
      pos[idx + 0] += Math.sin(t * 0.5 + phases[i]) * 0.0015;
      // Wrap when off-screen
      if (pos[idx + 1] > 6) pos[idx + 1] = -6;
    }
    geometry.attributes.position.needsUpdate = true;

    // Subtle camera parallax — gives the field volume
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // ─── Resize ───
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
}

function makeSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0.0, 'rgba(255, 200, 140, 1)');
  grad.addColorStop(0.3, 'rgba(251, 127, 64, 0.65)');
  grad.addColorStop(0.7, 'rgba(0, 50, 129, 0.12)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
