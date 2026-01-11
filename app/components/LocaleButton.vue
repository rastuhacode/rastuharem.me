<script setup lang="ts">
const US_FLAG_ICON = "twemoji:flag-united-states";
const RU_FLAG_ICON = "twemoji:flag-russia";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { locale, setLocale, availableLocales } = useI18n();

const icon = computed(() => {
  type Locale = (typeof availableLocales)[number];

  const localeToIcon: Record<Locale, string> = {
    en: US_FLAG_ICON,
    ru: RU_FLAG_ICON,
  };

  return localeToIcon[locale.value];
});
</script>

<template>
  <button
    class="size-5"
    @click="
      () => {
        const cur = locale;
        const next = cur === 'en' ? 'ru' : 'en';
        setLocale(next);
      }
    "
  >
    <Icon :name="icon" class="size-5" />
  </button>
</template>
