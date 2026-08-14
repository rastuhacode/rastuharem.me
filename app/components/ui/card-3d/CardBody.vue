<script setup lang="ts">
interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    style="transform-style: preserve-3d"
    :class="cn('h-96 w-96', props.class)"
  >
    <slot />
  </div>
</template>
