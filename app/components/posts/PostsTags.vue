<script setup lang="ts">
import type { PostTags } from "#shared/types/posts";

const props = withDefaults(
  defineProps<{
    tags: PostTags[];
    class?: string;
  }>(),
  { class: "" },
);

const emit = defineEmits<{
  "tag:select": [tag: PostTags];
}>();
</script>

<template>
  <RMarquee
    :overlay="false"
    :class="cn('bg-foreground-bold py-1 text-background [--duration:28s] [--gap:0px]', props.class)"
  >
    <template #default="{ isDuplicate }">
      <button
        v-for="tag in props.tags"
        :key="tag"
        type="button"
        :tabindex="isDuplicate ? -1 : 0"
        class="inline-flex min-h-9 items-center gap-4 border-r border-background/45 px-5 font-mono text-[0.7rem] font-black uppercase tracking-[0.16em] transition-colors hover:bg-[#72afc8] hover:text-[#171717] focus-visible:bg-[#72afc8] focus-visible:text-[#171717] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#72afc8]"
        @click="emit('tag:select', tag)"
      >
        <span class="text-[#72afc8]" aria-hidden="true">✳</span>
        #{{ tag }}
      </button>
    </template>
  </RMarquee>
</template>
