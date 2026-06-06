/* ============================================
   WESTERN GB TRAVEL & TOURS - 3D Scene (Three.js)
   ============================================ */

function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Stars / Particles
  const particlesCount = 1500;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 30;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;

    // Gold and white mix
    if (Math.random() > 0.7) {
      colors[i3] = 0.94;     // R (gold)
      colors[i3 + 1] = 0.75; // G
      colors[i3 + 2] = 0.25; // B
    } else {
      colors[i3] = 1;
      colors[i3 + 1] = 1;
      colors[i3 + 2] = 1;
    }

    sizes[i] = Math.random() * 3 + 1;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Mountain-like geometry
  const mountainGeometry = new THREE.BufferGeometry();
  const mountainVertices = [];
  const mountainColors = [];
  const mountainWidth = 40;
  const mountainDepth = 20;
  const segments = 60;

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = (i / segments - 0.5) * mountainWidth;
      const z = (j / segments - 0.5) * mountainDepth - 5;

      // Mountain height based on position
      let y = -4;
      const distFromCenter = Math.sqrt(x * x * 0.1 + (z + 2) * (z + 2) * 0.3);
      y += Math.max(0, 5 - distFromCenter) * Math.sin(x * 0.5) * Math.cos(z * 0.3);
      y += Math.random() * 0.3;
      y += Math.sin(x * 0.8 + z * 0.5) * 1.5;
      y = Math.max(y, -4);

      mountainVertices.push(x, y, z);

      // Snow on top (white), rock below (dark blue)
      const heightRatio = (y + 4) / 6;
      if (heightRatio > 0.6) {
        mountainColors.push(0.95, 0.97, 1.0);
      } else if (heightRatio > 0.3) {
        mountainColors.push(0.2, 0.35, 0.5);
      } else {
        mountainColors.push(0.08, 0.15, 0.25);
      }
    }
  }

  const mountainIndices = [];
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + 1;
      const c = a + (segments + 1);
      const d = c + 1;
      mountainIndices.push(a, c, b);
      mountainIndices.push(b, c, d);
    }
  }

  mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mountainVertices, 3));
  mountainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(mountainColors, 3));
  mountainGeometry.setIndex(mountainIndices);
  mountainGeometry.computeVertexNormals();

  const mountainMaterial = new THREE.MeshPhongMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    wireframe: false,
    side: THREE.DoubleSide,
    flatShading: true
  });

  const mountains = new THREE.Mesh(mountainGeometry, mountainMaterial);
  mountains.position.y = -2;
  scene.add(mountains);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x4488bb, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xf0c040, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x2e86de, 1, 20);
  pointLight.position.set(-5, 5, 5);
  scene.add(pointLight);

  // Camera position
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Rotate particles slowly
    particles.rotation.y = elapsed * 0.05;
    particles.rotation.x = elapsed * 0.02;

    // Float mountains
    mountains.position.y = -2 + Math.sin(elapsed * 0.3) * 0.3;
    mountains.rotation.y = elapsed * 0.02;

    // Follow mouse subtly
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.5 + 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Animate individual particle sizes
    const posArr = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      posArr[i3 + 1] += Math.sin(elapsed + i * 0.01) * 0.002;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ---------- Parallax on Scroll ----------
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
      const yPos = -(scrollY * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  });
}

// ---------- Mouse Trail Effect ----------
function initMouseTrail() {
  const trail = [];
  const trailLength = 10;

  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${8 - i * 0.6}px;
      height: ${8 - i * 0.6}px;
      background: rgba(240, 192, 64, ${0.6 - i * 0.05});
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform ${0.1 + i * 0.02}s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', (e) => {
    trail.forEach((dot, i) => {
      setTimeout(() => {
        dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }, i * 30);
    });
  });
}

// ---------- Initialize All Animations ----------
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initParallax();

  // Only enable mouse trail on desktop
  if (window.innerWidth > 768) {
    initMouseTrail();
  }
});
