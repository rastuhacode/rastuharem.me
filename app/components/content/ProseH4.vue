<script setup lang="ts">
import type { LinkHTMLAttributes } from 'vue'

const props = defineProps<{
  id: LinkHTMLAttributes['id']
}>()
</script>

<template>
  <h4
    :id="props.id"
    class="text-lg font-semibold group flex gap-1 text-foreground-bold"
  >
    <slot />
    <a
      :href="`#${props.id}`"
      class="no-underline float-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <Icon
        name="lucide:link"
        class="size-3 m-auto"
      />
    </a>
  </h4>
</template>
