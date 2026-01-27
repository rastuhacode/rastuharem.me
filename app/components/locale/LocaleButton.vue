<script setup lang="ts">
const US_FLAG_ICON = "twemoji:flag-united-states";
const RU_FLAG_ICON = "twemoji:flag-russia";

const props = defineProps<{
  locale: NuxtLocale;
}>();

const icon = computed(() => {
  const localeToIcon: Record<NuxtLocale, string> = {
    en: US_FLAG_ICON,
    ru: RU_FLAG_ICON,
  };

  return localeToIcon[props.locale];
});
</script>

<template>
  <button class="flex gap-2 items-center">
    <Icon :name="icon" class="size-5" />
    <span>
      <template v-if="locale === 'en'"> English </template>
      <template v-if="locale === 'ru'"> Русский </template>
    </span>
  </button>
</template>
