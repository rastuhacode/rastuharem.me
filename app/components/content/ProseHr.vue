<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(defineProps<{ class?: HTMLAttributes["class"] }>(), {
  class: "",
});
</script>

<template>
  <hr
    :class="
      cn(
        'bg-border shrink-0 rounded-lg border-0',
        'h-px w-12 my-10 mx-auto',
        props.class,
      )
    "
  >
</template>
