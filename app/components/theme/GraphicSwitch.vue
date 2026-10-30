<script setup lang="ts">
const graphics = useGraphicsStore();
const { reducedMotion } = useMotionPreference();
</script>

<template>
  <RSwitch
    v-model="graphics"
    :disabled="reducedMotion"
    :aria-label="$t('background_effects')"
    :title="$t(reducedMotion ? 'system_reduced_motion' : 'background_effects')"
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
