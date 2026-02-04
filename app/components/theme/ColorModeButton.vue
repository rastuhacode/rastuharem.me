<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.preference === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});

function toggleDark(event: MouseEvent) {
  const isAppearanceTransition = !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: "ease-out",
        fill: "forwards",
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    );
  });
}
</script>

<template>
  <ClientOnly>
    <button class="size-5" @click="toggleDark">
      <Icon
        :name="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'"
        class="size-5"
      />
    </button>
    <template #fallback>
      <Icon name="lucide:sun" class="size-5" />
    </template>
  </ClientOnly>
</template>
