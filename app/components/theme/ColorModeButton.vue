<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.preference === 'dark'
  },
  set(value: boolean) {
    colorMode.preference = value ? 'dark' : 'light'
  },
})

function toggleDark() {
  const isAppearanceTransition = !window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
}
</script>

<template>
  <ClientOnly>
    <button
      class="size-5"
      @click="toggleDark"
    >
      <Icon
        :name="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'"
        class="size-5"
      />
    </button>
    <template #fallback>
      <Icon
        name="lucide:sun"
        class="size-5"
      />
    </template>
  </ClientOnly>
</template>
