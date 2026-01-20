<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <RBadge
    :class="cn('hover:bg-red-600 hover:text-white', props.class)"
    href="https://www.huawei.com/en/"
  >
    <Icon name="simple-icons:huawei" />
    <span class="px-0.5">Huawei</span>
  </RBadge>
</template>
