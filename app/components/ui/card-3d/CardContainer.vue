<script setup lang="ts">
import { useMouseState } from "./useMouseState";

interface Props {
  class?: string;
  containerClass?: string;
}

const props = defineProps<Props>();

const containerRef = useTemplateRef("containerRef");

const mouseState = useMouseState();
provide("use3DCardMouseState", mouseState);

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { left, top, width, height } = containerRef.value.getBoundingClientRect();
  const x = ((e.clientX - left) / width - 0.5) * 8;
  const y = ((e.clientY - top) / height - 0.5) * -8;
  containerRef.value.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
}

function handleMouseEnter() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  mouseState.setMouseEntered(true);
}

function handleMouseLeave() {
  if (!containerRef.value) return;

  mouseState.setMouseEntered(false);
  containerRef.value.style.transform = `rotateY(0deg) rotateX(0deg)`;
}
</script>

<template>
  <div
    style="perspective: 1000px"
    :class="cn('relative', props.containerClass)"
  >
    <div
      ref="containerRef"
      style="transform-style: preserve-3d"
      :class="
        cn(
          'relative transition-transform duration-200 ease-out motion-reduce:transition-none',
          props.class,
        )
      "
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <slot />
    </div>
  </div>
</template>
