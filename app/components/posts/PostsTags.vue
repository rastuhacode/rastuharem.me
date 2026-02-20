<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tags: TPostTags[];
    max?: number;
    class?: string;
  }>(),
  { max: 3, class: "" },
);

const emits = defineEmits<{
  "tag:select": [tag: TPostTags];
}>();

const visibleTags = computed(() => {
  return props.tags.slice(0, props.max);
});

const hiddenTagsCount = computed(() => {
  if (props.tags.length <= props.max) {
    return undefined;
  }
  return props.tags.length - props.max;
});
</script>

<template>
  <div :class="cn('flex gap-2 overflow-hidden max-w-full', props.class)">
    <RBadge
      v-for="tag in visibleTags"
      :key="tag"
      as="button"
      @click="emits('tag:select', tag)"
    >
      {{ tag }}
    </RBadge>
    <RBadge v-if="hiddenTagsCount"> +{{ hiddenTagsCount }} </RBadge>
  </div>
</template>
