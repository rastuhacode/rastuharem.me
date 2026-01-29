<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <div class="flex gap-2 flex-wrap mt-2">
    <RBadge href="https://github.com/rastuhacode">
      <Icon name="simple-icons:github" />
      <span class="px-0.5">GitHub</span>
    </RBadge>

    <RBadge href="https://www.linkedin.com/in/rasten-remizov/">
      <Icon name="simple-icons:linkedin" />
      <span class="px-0.5">LinkedIn</span>
    </RBadge>

    <RBadge href="https://steamcommunity.com/id/rastuharem/">
      <Icon name="simple-icons:steam" />
      <span class="px-0.5">Steam</span>
    </RBadge>
  </div>
</template>
