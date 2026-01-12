<script setup lang="ts">
const isGraphicsEnabled = useGraphicsStore();
</script>

<template>
  <UiSwitch v-model="isGraphicsEnabled" class="absolute bottom-4 left-4 z-20" />
</template>
