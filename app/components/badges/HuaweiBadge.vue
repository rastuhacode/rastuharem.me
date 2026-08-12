<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

const HREF = "https://www.huawei.com/en"
</script>

<template>
  <RBadge
    :class="cn('hover:bg-red-600 hover:text-white', props.class)"
    :href="HREF"
  >
    <Icon name="simple-icons:huawei" />
    <span class="px-0.5">Huawei</span>
  </RBadge>
</template>
