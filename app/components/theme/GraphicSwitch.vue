<script setup lang="ts">
const graphics = useGraphicsStore();
</script>

<template>
  <RSwitch
    v-model="graphics"
    :aria-label="$t('background_effects')"
    :title="$t('background_effects')"
  >
    <template #thumb="{ modelValue }">
      <Icon
        v-if="modelValue"
        name="lucide:stars"
        class="size-3"
      />
    </template>
  </RSwitch>
</template>
