<script setup lang="ts">
const graphics = useGraphicsStore()
</script>

<template>
  <RSwitch v-model="graphics">
    <template #thumb="{ modelValue }">
      <Icon
        v-if="modelValue"
        name="lucide:stars"
        class="size-3"
      />
    </template>
  </RSwitch>
</template>
