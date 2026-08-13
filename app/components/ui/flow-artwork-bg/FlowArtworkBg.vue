<script setup lang="ts">
import type { Application, Graphics } from "pixi.js";

interface Point {
  x: number;
  y: number;
}

interface FlowConfig {
  baseAngle: number;
  phaseA: number;
  phaseB: number;
  phaseC: number;
  frequencyX: number;
  frequencyY: number;
  diagonalFrequency: number;
  turbulence: number;
  curveSteps: number;
  stepLength: number;
}

interface FlowStroke {
  alpha: number;
  colorIndex: number;
  dashLength: number;
  dashOffset: number;
  gapLength: number;
  points: Point[];
  width: number;
}

const graphiteColorsLight = [
  0x282828,
  0x404040,
  0x5B5B5B,
  0x737373,
  0x949494,
] as const;
const graphiteColorsDark = [
  0xD4D4D4,
  0xB9B9B9,
  0x9A9A9A,
  0x7C7C7C,
  0x5E5E5E,
] as const;
const revealDuration = 1450;

const props = withDefaults(defineProps<{ interactive?: boolean }>(), {
  interactive: true,
});

const containerRef = useTemplateRef("containerRef");
const canvasHostRef = useTemplateRef("canvasHostRef");
const colorMode = useColorMode();
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const canInteract = computed(() => props.interactive && !reducedMotion.value);

let app: Application | null = null;
let flowLayers: Graphics[] = [];
let highlightLayer: Graphics | null = null;
let resizeObserver: ResizeObserver | null = null;
let animationFrame: number | undefined;
let width = 0;
let height = 0;
let fieldSeed = 0;
let flowConfig = createFlowConfig(fieldSeed);
let strokeSeeds: number[] = [];
let touchActive = false;
let revealProgress = 1;
let revealStartedAt: number | undefined;
let hasStartedReveal = false;

const pointer = {
  currentX: 0,
  currentY: 0,
  currentStrength: 0,
  targetX: 0,
  targetY: 0,
  targetStrength: 0,
};

onMounted(async () => {
  if (!containerRef.value || !canvasHostRef.value) return;

  fieldSeed = createSeed();
  flowConfig = createFlowConfig(fieldSeed);
  containerRef.value.dataset.fieldSeed = fieldSeed
    .toString(16)
    .padStart(8, "0");
  containerRef.value.dataset.fieldPalette = "graphite";
  containerRef.value.dataset.fieldStyle = "graphite";

  const { Application: PixiApplication, Graphics: PixiGraphics } = await import(
    "pixi.js"
  );

  if (!canvasHostRef.value) return;

  app = new PixiApplication();
  await app.init({
    antialias: true,
    autoDensity: true,
    autoStart: false,
    backgroundAlpha: 0,
    powerPreference: "low-power",
    preference: "webgl",
    resolution: Math.min(window.devicePixelRatio || 1, 1.5),
  });

  flowLayers = graphiteColorsLight.map(() => new PixiGraphics());
  highlightLayer = new PixiGraphics();
  app.stage.addChild(...flowLayers, highlightLayer);

  app.canvas.className = "absolute inset-0 size-full";
  app.canvas.setAttribute("aria-hidden", "true");
  canvasHostRef.value.appendChild(app.canvas);

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(containerRef.value);
  resize();

  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
  window.addEventListener("pointercancel", handlePointerUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", releasePointer);
  window.addEventListener("blur", releasePointer);
});

onBeforeUnmount(() => {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  window.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
  window.removeEventListener("pointercancel", handlePointerUp);
  document.documentElement.removeEventListener("pointerleave", releasePointer);
  window.removeEventListener("blur", releasePointer);
  app?.destroy({ removeView: true }, { children: true });
});

watch([() => colorMode.value, canInteract], async ([, isInteractive]) => {
  await nextTick();
  if (!isInteractive) releasePointer();
  else renderArtwork();
});

function resize() {
  if (!app || !containerRef.value) return;

  const nextWidth = containerRef.value.clientWidth;
  const nextHeight = containerRef.value.clientHeight;
  if (
    nextWidth <= 0
    || nextHeight <= 0
    || (nextWidth === width && nextHeight === height)
  ) {
    return;
  }

  width = nextWidth;
  height = nextHeight;
  app.renderer.resize(width, height);
  buildStrokeSeeds();

  if (!hasStartedReveal) {
    hasStartedReveal = true;
    revealProgress = reducedMotion.value ? 1 : 0;
    renderArtwork();

    if (revealProgress < 1) {
      revealStartedAt = performance.now();
      startAnimation();
    }
  }
  else {
    renderArtwork();
  }
}

function createSeed() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  }

  return Math.floor(Math.random() * 0x1_0000_0000);
}

function createRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}

function createFlowConfig(seed: number): FlowConfig {
  const random = createRandom(seed);
  const between = (minimum: number, maximum: number) => (
    minimum + (maximum - minimum) * random()
  );
  return {
    baseAngle: between(-0.45, 0.45),
    phaseA: between(0, Math.PI * 2),
    phaseB: between(0, Math.PI * 2),
    phaseC: between(0, Math.PI * 2),
    frequencyX: between(0.7, 1.35),
    frequencyY: between(0.65, 1.25),
    diagonalFrequency: between(0.6, 1.1),
    turbulence: between(0.48, 0.76),
    curveSteps: Math.round(between(92, 136)),
    stepLength: between(4, 5.6),
  };
}

function buildStrokeSeeds() {
  const minimumLines = width < 640 ? 126 : 210;
  const maximumLines = width < 640 ? 210 : 420;
  const lineCount = Math.round(
    Math.min(maximumLines, Math.max(minimumLines, (width * height) / 3600)),
  );
  const random = createRandom(fieldSeed ^ 0xA53C_9E17);

  strokeSeeds = Array.from(
    { length: lineCount },
    () => Math.floor(random() * 0x1_0000_0000),
  );

  if (containerRef.value) {
    containerRef.value.dataset.flowLines = lineCount.toString();
  }
}

function angleAt(x: number, y: number) {
  const normalizedX = x / Math.max(width, 1);
  const normalizedY = y / Math.max(height, 1);
  const diagonal = (x + y) / Math.max(width + height, 1);
  const waveX = Math.sin(
    normalizedY * Math.PI * 2 * flowConfig.frequencyY + flowConfig.phaseA,
  );
  const waveY = Math.cos(
    normalizedX * Math.PI * 2 * flowConfig.frequencyX + flowConfig.phaseB,
  );
  const crossCurrent = Math.sin(
    diagonal * Math.PI * 2 * flowConfig.diagonalFrequency + flowConfig.phaseC,
  );
  const baseAngle = flowConfig.baseAngle
    + waveX * flowConfig.turbulence
    + waveY * flowConfig.turbulence * 0.62
    + crossCurrent * flowConfig.turbulence * 0.34;

  if (pointer.currentStrength <= 0) return baseAngle;

  const deltaX = x - pointer.currentX;
  const deltaY = y - pointer.currentY;
  const radius = Math.min(220, Math.max(150, width * 0.17));
  const influence = Math.exp(
    -(deltaX ** 2 + deltaY ** 2) / (2 * radius ** 2),
  ) * pointer.currentStrength;
  const gentleBend = Math.sin(
    (deltaX - deltaY) * 0.008 + flowConfig.phaseC,
  ) * influence * 0.075;

  return baseAngle + gentleBend;
}

function traceDirection(start: Point, direction: -1 | 1) {
  const points: Point[] = [];
  let x = start.x;
  let y = start.y;
  const margin = Math.max(width, height) * 0.12;

  for (let step = 0; step < flowConfig.curveSteps; step++) {
    if (
      x < -margin
      || x > width + margin
      || y < -margin
      || y > height + margin
    ) {
      break;
    }

    points.push({ x, y });
    const angle = angleAt(x, y);
    x += Math.cos(angle) * flowConfig.stepLength * direction;
    y += Math.sin(angle) * flowConfig.stepLength * direction;
  }

  return points;
}

function createStroke(seed: number): FlowStroke {
  const random = createRandom(seed);
  const start = {
    x: (-0.08 + random() * 1.16) * width,
    y: (-0.08 + random() * 1.16) * height,
  };
  const backwards = traceDirection(start, -1).reverse();
  const forwards = traceDirection(start, 1);
  const points = [...backwards.slice(0, -1), ...forwards];
  const normalizedX = start.x / Math.max(width, 1);
  const normalizedY = start.y / Math.max(height, 1);
  const colorMap = (
    Math.sin(normalizedX * Math.PI * 2 + flowConfig.phaseA)
    + Math.cos(normalizedY * Math.PI * 2 + flowConfig.phaseB)
    + 2
  ) / 4;
  const colorIndex = Math.min(
    graphiteColorsLight.length - 1,
    Math.floor(colorMap * graphiteColorsLight.length),
  );

  return {
    alpha: 0.62 + random() * 0.38,
    colorIndex,
    dashLength: Math.round(3 + random() * 12),
    dashOffset: Math.floor(random() * 16),
    gapLength: Math.round(1 + random() * 7),
    points,
    width: 0.55 + random() ** 1.4 * 2.4,
  };
}

function drawBrokenPath(
  graphics: Graphics,
  points: Point[],
  dashLength: number,
  gapLength: number,
  offset: number,
  visibleProgress = 1,
) {
  const visiblePointCount = Math.floor(points.length * visibleProgress);
  if (visiblePointCount < 2) return false;

  const cycle = dashLength + gapLength;
  let isDrawing = false;

  for (let index = 0; index < visiblePointCount; index++) {
    const point = points[index];
    if (!point) continue;
    const shouldDraw = (index + offset) % cycle < dashLength;

    if (!shouldDraw) {
      isDrawing = false;
      continue;
    }

    if (!isDrawing) graphics.moveTo(point.x, point.y);
    else graphics.lineTo(point.x, point.y);
    isDrawing = true;
  }

  return true;
}

function renderArtwork() {
  if (
    !app
    || !highlightLayer
    || flowLayers.length !== graphiteColorsLight.length
    || strokeSeeds.length === 0
  ) {
    return;
  }

  flowLayers.forEach(layer => layer.clear());
  highlightLayer.clear();

  const isDark = document.documentElement.classList.contains("dark");
  const palette = isDark ? graphiteColorsDark : graphiteColorsLight;
  const easedReveal = 1 - (1 - revealProgress) ** 3;
  const activeHighlightLayer = highlightLayer;

  if (containerRef.value) {
    containerRef.value.dataset.revealProgress = revealProgress.toFixed(3);
  }

  strokeSeeds.forEach((seed, index) => {
    const stroke = createStroke(seed);
    const color = palette[stroke.colorIndex];
    const flowLayer = flowLayers[stroke.colorIndex];
    if (color === undefined || !flowLayer) return;
    const revealRandom = createRandom(seed ^ 0xC21F_731A);
    const revealDelay = revealRandom() * 0.32;
    const strokeReveal = Math.min(
      1,
      Math.max(0, (easedReveal - revealDelay) / (1 - revealDelay)),
    );

    if (
      drawBrokenPath(
        flowLayer,
        stroke.points,
        stroke.dashLength,
        stroke.gapLength,
        stroke.dashOffset,
        strokeReveal,
      )
    ) {
      flowLayer.stroke({
        alpha: (
          isDark ? 0.38 : 0.48
        ) * stroke.alpha,
        color,
        pixelLine: stroke.width < 1,
        width: stroke.width,
      });
    }

    if (
      index % 5 === 0
      && drawBrokenPath(
        activeHighlightLayer,
        stroke.points,
        Math.max(2, Math.round(stroke.dashLength * 0.55)),
        stroke.gapLength * 2,
        stroke.dashOffset + 3,
        strokeReveal,
      )
    ) {
      activeHighlightLayer.stroke({
        alpha: isDark ? 0.22 : 0.25,
        color: isDark ? 0xF0F0F0 : 0x181818,
        pixelLine: true,
        width: 1,
      });
    }
  });

  app.renderer.render(app.stage);
}

function movePointer(event: PointerEvent) {
  if (!canInteract.value) return;

  pointer.targetX = event.clientX;
  pointer.targetY = event.clientY;
  pointer.targetStrength = 1;

  if (pointer.currentStrength === 0) {
    pointer.currentX = event.clientX;
    pointer.currentY = event.clientY;
  }

  startAnimation();
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType !== "touch") return;
  touchActive = true;
  movePointer(event);
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerType === "touch" && !touchActive) return;
  movePointer(event);
}

function handlePointerUp(event: PointerEvent) {
  if (event.pointerType !== "touch") return;
  touchActive = false;
  releasePointer();
}

function releasePointer() {
  pointer.targetStrength = 0;
  startAnimation();
}

function startAnimation() {
  if (animationFrame === undefined) animationFrame = requestAnimationFrame(tick);
}

function tick(timestamp: number) {
  animationFrame = undefined;

  if (revealStartedAt !== undefined && revealProgress < 1) {
    revealProgress = Math.min(
      1,
      (timestamp - revealStartedAt) / revealDuration,
    );

    if (revealProgress >= 1) revealStartedAt = undefined;
  }

  pointer.currentX += (pointer.targetX - pointer.currentX) * 0.13;
  pointer.currentY += (pointer.targetY - pointer.currentY) * 0.13;
  pointer.currentStrength += (
    pointer.targetStrength - pointer.currentStrength
  ) * 0.09;

  if (pointer.currentStrength < 0.002 && pointer.targetStrength === 0) {
    pointer.currentStrength = 0;
  }

  renderArtwork();

  const isSettling = Math.abs(pointer.targetX - pointer.currentX) > 0.25
    || Math.abs(pointer.targetY - pointer.currentY) > 0.25
    || Math.abs(pointer.targetStrength - pointer.currentStrength) > 0.002;

  if (revealProgress < 1 || isSettling) startAnimation();
}
</script>

<template>
  <div
    ref="containerRef"
    class="flow-artwork-background fixed inset-0 -z-10 overflow-hidden bg-background"
    aria-hidden="true"
  >
    <div
      ref="canvasHostRef"
      class="flow-canvas absolute inset-0"
    />
  </div>
</template>

<style scoped>
.flow-canvas {
  mix-blend-mode: var(--flow-canvas-blend);
  opacity: var(--flow-canvas-opacity);
}

@media (width < 640px) {
  .flow-canvas {
    opacity: calc(var(--flow-canvas-opacity) * 0.76);
  }
}
</style>
