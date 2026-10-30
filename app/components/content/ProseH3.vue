<script setup lang="ts">
import type { LinkHTMLAttributes } from "vue";

const props = defineProps<{
  id: LinkHTMLAttributes["id"];
}>();
const textId = useId();
</script>

<template>
  <h3
    :id="props.id"
    :aria-labelledby="textId"
    class="text-xl font-semibold group flex gap-2 text-foreground-bold"
  >
    <span :id="textId"><slot /></span>
    <a
      :href="`#${props.id}`"
      :aria-label="$t('section_permalink', { section: props.id?.replace(/-/g, ' ') ?? '' })"
      class="inline-flex min-h-6 min-w-6 shrink-0 items-center justify-center self-center no-underline opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 transition-opacity duration-300"
    >
      <Icon
        name="lucide:link"
        class="size-4 m-auto"
      />
    </a>
  </h3>
</template>
