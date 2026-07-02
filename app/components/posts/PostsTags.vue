<script setup lang="ts">
import type { PostTags } from "#shared/types/posts";

const props = withDefaults(
  defineProps<{
    tags: PostTags[];
    max?: number;
    class?: string;
  }>(),
  { max: 3, class: "" },
);

const emits = defineEmits<{
  "tag:select": [tag: PostTags];
}>();

const { tags } = toRefs(props);
</script>

<template>
  <RMarquee
    :overlay="false"
    :class="props.class"
  >
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
