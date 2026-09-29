<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, ref } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
  size?: number;
  revealSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  size: 0,
  revealSize: 500,
});

const container = ref<HTMLElement | null>(null);
const isHovered = ref(false);
const position = ref({ x: 0, y: 0 });

const maskStyle = computed(() => {
  const size = isHovered.value ? props.revealSize : props.size;

  return {
    maskSize: `${size}px ${size}px`,
    maskPosition: `${position.value.x - size / 2}px ${position.value.y - size / 2}px`,
  };
});

function updateMousePosition(event: MouseEvent) {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  position.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  isHovered.value = true;
}
</script>

<template>
  <div
    ref="container"
    :class="cn('relative', props.class)"
    @mouseenter="updateMousePosition"
    @mousemove="updateMousePosition"
    @mouseleave="isHovered = false"
  >
    <slot name="base" :revealed="false">
      <slot :revealed="false" />
    </slot>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden mask-[url('/images/svg-mask-circle.svg')] mask-no-repeat [transition:mask-size_200ms_ease-in-out] motion-reduce:transition-none"
      :style="maskStyle"
    >
      <slot name="reveal" :revealed="true">
        <slot :revealed="true" />
      </slot>
    </div>
  </div>
</template>
