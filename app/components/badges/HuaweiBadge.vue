<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <UiBadge :class="cn(props.class)" href="https://www.huawei.com/en/">
    <Icon name="simple-icons:huawei" />
    <span class="px-0.5">Huawei</span>
  </UiBadge>
</template>
