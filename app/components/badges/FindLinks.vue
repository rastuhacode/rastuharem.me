<script setup lang="ts">
const { locale } = useI18n()
</script>

<template>
  <div class="flex gap-2 flex-wrap mt-2">
    <template v-if="locale === 'en' || locale === 'ru'">
      <RBadge href="https://github.com/rastuhacode">
        <Icon name="simple-icons:github" />
        <span class="px-0.5">GitHub</span>
      </RBadge>

      <RBadge href="https://steamcommunity.com/id/rastuharem">
        <Icon name="simple-icons:steam" />
        <span class="px-0.5">Steam</span>
      </RBadge>
    </template>
  </div>
</template>
