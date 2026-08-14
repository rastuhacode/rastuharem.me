<script setup lang="ts">
useHead(useLocaleHead());

const { finalizePendingLocaleChange } = useI18n();

const localeTransition = {
  css: false,
  mode: "out-in" as const,
  onAfterLeave: finalizePendingLocaleChange,
};
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage :transition="localeTransition" />
  </NuxtLayout>
</template>
