<script setup lang="ts">
const isGraphicsEnabled = useGraphicsStore();
</script>

<template>
  <UiSwitch v-model="isGraphicsEnabled" />
</template>
