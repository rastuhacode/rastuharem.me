<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    target?: HTMLAnchorElement["target"];
  }>(),
  { class: "", target: "_blank" },
);
</script>

<template>
  <a :class="cn('border-underline', props.class)" :target="props.target">
    <slot />
  </a>
</template>
