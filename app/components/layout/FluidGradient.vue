<script setup lang="ts">
import type WebGLFluidEnhanced from "webgl-fluid-enhanced";

const container = useTemplateRef("container");
const simulation = shallowRef<WebGLFluidEnhanced | null>(null);

let lastX = 0;
let lastY = 0;

function onMouseMove(e: MouseEvent) {
  if (!simulation.value || !container.value) return;

  const ACCELERATION_FACTOR = 10;

  const canvas = container.value.querySelector("canvas");
  if (!canvas) return;

  // Scale X by devicePixelRatio, but Y seems to not need scaling
  const dpr = window.devicePixelRatio || 1;

  const x = e.clientX * dpr;
  const y = e.clientY;

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  // Only trigger splat if mouse moved enough
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    simulation.value.splatAtLocation(
      x,
      y,
      dx * dpr * ACCELERATION_FACTOR,
      dy * -ACCELERATION_FACTOR
    );
  }

  lastX = e.clientX;
  lastY = e.clientY;
}

onMounted(async () => {
  if (!container.value) return;

  const WebGLFluidEnhanced = (await import("webgl-fluid-enhanced")).default;

  simulation.value = new WebGLFluidEnhanced(container.value);

  simulation.value.setConfig({
    simResolution: 128,
    dyeResolution: 1024,
    densityDissipation: 1.5,
    velocityDissipation: 2,
    pressure: 0.1,
    pressureIterations: 20,
    curl: 3,
    splatRadius: 0.4,
    splatForce: 6000,
    shading: true,
    colorful: true,
    colorUpdateSpeed: 50,
    backgroundColor: "#020208",
    transparent: false,
    bloom: false,
    brightness: 0.3,
    bloomIterations: 8,
    bloomResolution: 256,
    bloomIntensity: 0.1,
    bloomThreshold: 0.6,
    bloomSoftKnee: 0.7,
    sunrays: false,
    hover: false, // Disable built-in hover, we handle it manually
  });

  simulation.value.start();

  // Listen for mouse movement on the window
  window.addEventListener("mousemove", onMouseMove);
});

onUnmounted(() => {
  simulation.value?.stop();
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <div class="fixed inset-0 z-0">
    <div ref="container" class="absolute inset-0 size-full" />
  </div>
</template>
