<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <UiBadge
    :class="cn(props.class)"
    href="https://astra.ru/software-services/astra-consulting/"
  >
    <AstraIcon class="size-4" />
    <span class="px-0.5">Astra Consulting</span>
  </UiBadge>
</template>
