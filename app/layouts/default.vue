<script setup lang="ts">
const isGraphicsEnabled = useGraphicsStore();
</script>

<template>
  <div class="size-screen flex flex-col">
    <FluidGradient v-if="isGraphicsEnabled" />
    <LayoutGradient :grainy="!isGraphicsEnabled" />

    <LayoutHeader />
    <main class="grow overflow-y-auto overflow-x-hidden z-10">
      <slot />
    </main>

    <GraphicSwitch />
  </div>
</template>
