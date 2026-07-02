<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <div class="flex gap-2 flex-wrap mt-2">
    <template v-if="locale === 'en' || locale === 'ru'">
      <RBadge href="https://t.me/rastuharem">
        <Icon name="simple-icons:telegram" />
        <span class="px-0.5">Telegram</span>
      </RBadge>

      <RBadge href="https://www.linkedin.com/in/rasten-remizov">
        <Icon name="simple-icons:linkedin" />
        <span class="px-0.5">LinkedIn</span>
      </RBadge>
    </template>
  </div>
</template>
