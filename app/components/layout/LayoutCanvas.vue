<script setup lang="ts">
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

// Configuration
const CONNECTION_DISTANCE = 120;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 0.02;
const PARTICLE_OPACITY = 0.6;
const LINE_OPACITY = 0.15;
const BASE_SPEED = 0.3;

// Reactive color from CSS variables (for theme support)
const particleColor = reactive({ r: 100, g: 100, b: 100 });

function updateColorFromCSS(): void {
  const styles = getComputedStyle(document.documentElement);
  particleColor.r =
    parseInt(styles.getPropertyValue("--canvas-particle-r").trim()) || 100;
  particleColor.g =
    parseInt(styles.getPropertyValue("--canvas-particle-g").trim()) || 100;
  particleColor.b =
    parseInt(styles.getPropertyValue("--canvas-particle-b").trim()) || 100;
}

function getParticleRgba(opacity: number): string {
  return `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${opacity})`;
}

const el = useTemplateRef("canvasRef");
const particles = ref<Particle[]>([]);

// Mouse tracking
const mouse = reactive({ x: -1000, y: -1000 });

function getParticleCount(width: number, height: number): number {
  const area = width * height;
  // Scale particles based on screen area, with min/max bounds
  const count = Math.floor(area / 15000);
  return Math.max(30, Math.min(count, 150));
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED * 2,
    vy: (Math.random() - 0.5) * BASE_SPEED * 2,
    radius: Math.random() * 1.5 + 1,
  };
}

function initParticles(width: number, height: number): Particle[] {
  const count = getParticleCount(width, height);
  return Array.from({ length: count }, () => createParticle(width, height));
}

function initCanvas(
  canvas: HTMLCanvasElement,
  width = 400,
  height = 400,
  _dpi?: number
) {
  const ctx = canvas.getContext("2d")!;

  const dpr = window.devicePixelRatio || 1;
  // Vendor-specific backing store pixel ratio (legacy Safari)
  const ctxWithBsr = ctx as CanvasRenderingContext2D & {
    webkitBackingStorePixelRatio?: number;
    mozBackingStorePixelRatio?: number;
    msBackingStorePixelRatio?: number;
    oBackingStorePixelRatio?: number;
    backingStorePixelRatio?: number;
  };
  const bsr =
    ctxWithBsr.webkitBackingStorePixelRatio ||
    ctxWithBsr.mozBackingStorePixelRatio ||
    ctxWithBsr.msBackingStorePixelRatio ||
    ctxWithBsr.oBackingStorePixelRatio ||
    ctxWithBsr.backingStorePixelRatio ||
    1;

  const dpi = _dpi || dpr / bsr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = dpi * width;
  canvas.height = dpi * height;
  ctx.scale(dpi, dpi);

  return { ctx, dpi };
}

function updateParticle(
  particle: Particle,
  width: number,
  height: number
): void {
  // Apply mouse interaction
  const dx = mouse.x - particle.x;
  const dy = mouse.y - particle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < MOUSE_RADIUS && distance > 0) {
    // Repel particles from mouse
    const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
    const angle = Math.atan2(dy, dx);
    particle.vx -= Math.cos(angle) * force * MOUSE_FORCE;
    particle.vy -= Math.sin(angle) * force * MOUSE_FORCE;
  }

  // Update position
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Bounce off edges with some dampening
  if (particle.x < 0 || particle.x > width) {
    particle.vx *= -0.9;
    particle.x = Math.max(0, Math.min(width, particle.x));
  }
  if (particle.y < 0 || particle.y > height) {
    particle.vy *= -0.9;
    particle.y = Math.max(0, Math.min(height, particle.y));
  }

  // Apply slight friction to prevent infinite acceleration
  particle.vx *= 0.99;
  particle.vy *= 0.99;

  // Ensure minimum velocity for continuous movement
  const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
  if (speed < BASE_SPEED * 0.5) {
    const angle = Math.random() * Math.PI * 2;
    particle.vx += Math.cos(angle) * BASE_SPEED * 0.1;
    particle.vy += Math.sin(angle) * BASE_SPEED * 0.1;
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  particleList: Particle[]
): void {
  for (let i = 0; i < particleList.length; i++) {
    const p1 = particleList[i]!;
    for (let j = i + 1; j < particleList.length; j++) {
      const p2 = particleList[j]!;

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECTION_DISTANCE) {
        // Opacity based on distance
        const opacity = (1 - distance / CONNECTION_DISTANCE) * LINE_OPACITY;
        ctx.beginPath();
        ctx.strokeStyle = getParticleRgba(opacity);
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  // Draw connections to mouse
  for (const particle of particleList) {
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < MOUSE_RADIUS) {
      const opacity = (1 - distance / MOUSE_RADIUS) * LINE_OPACITY * 1.5;
      ctx.beginPath();
      ctx.strokeStyle = getParticleRgba(opacity);
      ctx.lineWidth = 1;
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particleList: Particle[]
): void {
  ctx.fillStyle = getParticleRgba(PARTICLE_OPACITY);

  for (const particle of particleList) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

onMounted(() => {
  const canvas = el.value!;

  // Initialize window size tracking only on client
  const size = reactive(useWindowSize());

  const { ctx } = initCanvas(canvas, size.width, size.height);

  // Initialize color from CSS variables
  updateColorFromCSS();

  // Watch for theme changes (class changes on html element)
  const themeObserver = new MutationObserver(() => {
    updateColorFromCSS();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Initialize particles
  particles.value = initParticles(size.width, size.height);

  // Mouse move handler
  const handleMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const handleMouseLeave = () => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseleave", handleMouseLeave);

  // Animation loop
  const controls = useRafFn(() => {
    ctx.clearRect(0, 0, size.width, size.height);

    // Update all particles
    for (const particle of particles.value) {
      updateParticle(particle, size.width, size.height);
    }

    // Draw connections first (below particles)
    drawConnections(ctx, particles.value);

    // Draw particles on top
    drawParticles(ctx, particles.value);
  });

  // Handle window resize
  watch(
    () => [size.width, size.height] as const,
    ([newWidth, newHeight]) => {
      controls.pause();
      initCanvas(canvas, newWidth, newHeight);

      // Reinitialize particles for new size
      const newCount = getParticleCount(newWidth, newHeight);
      const currentCount = particles.value.length;

      if (newCount > currentCount) {
        // Add more particles
        for (let i = 0; i < newCount - currentCount; i++) {
          particles.value.push(createParticle(newWidth, newHeight));
        }
      } else if (newCount < currentCount) {
        // Remove excess particles
        particles.value.splice(newCount);
      }

      // Ensure all particles are within bounds
      for (const particle of particles.value) {
        particle.x = Math.min(particle.x, newWidth);
        particle.y = Math.min(particle.y, newHeight);
      }

      controls.resume();
    }
  );

  onUnmounted(() => {
    controls.pause();
    themeObserver.disconnect();
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
  });
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="-z-10 fixed top-0 left-0 size-screen slide-enter"
  />
</template>
