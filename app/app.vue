<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: "dark",
  },
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
