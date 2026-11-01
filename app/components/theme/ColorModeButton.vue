<script setup lang="ts">
const colorMode = useColorMode();
const { enabled: motionEnabled } = useMotionPreference();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});

function toggleDark() {
  const isAppearanceTransition = motionEnabled.value
    && typeof document.startViewTransition === "function";

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value;
    return;
  }

  document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      :aria-label="$t(isDark ? 'switch_to_light_theme' : 'switch_to_dark_theme')"
      class="flex size-11 shrink-0 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      @click="toggleDark"
    >
      <Icon
        :name="isDark ? 'lucide:sun' : 'lucide:moon'"
        class="size-5"
      />
    </button>
    <template #fallback>
      <span class="flex size-11 shrink-0 items-center justify-center" aria-hidden="true">
        <Icon name="lucide:sun" class="size-5" />
      </span>
    </template>
  </ClientOnly>
</template>
