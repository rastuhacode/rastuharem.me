<script setup lang="ts">
const props = defineProps<{
  locale: NuxtLocale
}>()

const icon = computed(() => LocaleToIcon[props.locale])
</script>

<template>
  <SwitchLocalePathLink
    :locale="locale"
    class="flex gap-2 items-center"
  >
    <Icon
      :name="icon"
      class="size-5"
    />
    <span>
      <template v-if="props.locale === 'en'"> English </template>
      <template v-if="props.locale === 'ru'"> Русский </template>
    </span>
  </SwitchLocalePathLink>
</template>
