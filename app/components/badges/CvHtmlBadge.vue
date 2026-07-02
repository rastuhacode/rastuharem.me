<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <RBadge
    :class="cn('hover:text-violet-400', props.class)"
    href="https://cv-html-dev.netlify.app"
  >
    <Icon
      name="lucide:file-text"
      class="size-4"
    />
    <span class="px-0.5">CV.html</span>
  </RBadge>
</template>
