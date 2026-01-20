<script setup lang="ts">
const isGraphicsEnabled = useGraphicsStore();
</script>

<template>
  <RSwitch v-model="isGraphicsEnabled" />
</template>
