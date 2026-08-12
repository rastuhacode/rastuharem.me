<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

const HREF = 'https://github.com/rastuhacode/soundgrammy'
</script>

<template>
  <RBadge
    :class="cn('hover:text-white hover:bg-blue-500', props.class)"
    :href="HREF"
  >
    <SoundgrammyIcon class="size-4" />
    <span class="px-0.5">SoundGrammy</span>
  </RBadge>
</template>
