<script setup lang="ts">
import type { LinkHTMLAttributes } from "vue";

const props = defineProps<{
  id: LinkHTMLAttributes["id"];
}>();
</script>

<template>
  <h2 :id="props.id" class="text-2xl group flex gap-2 text-foreground-bold">
    <slot />
    <a
      :href="`#${props.id}`"
      class="no-underline float-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <Icon name="lucide:link" class="size-5 m-auto" />
    </a>
  </h2>
</template>
