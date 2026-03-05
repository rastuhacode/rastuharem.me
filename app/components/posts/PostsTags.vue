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

const { tags } = toRefs(props);
</script>

<template>
  <RMarquee :overlay="false" :class="props.class">
    <button
      v-for="tag in tags"
      :key="tag"
      class="text-muted-foreground hover:text-foreground transition-colors duration-300"
      @click="emits('tag:select', tag)"
    >
      #{{ tag }}
    </button>
  </RMarquee>
</template>
