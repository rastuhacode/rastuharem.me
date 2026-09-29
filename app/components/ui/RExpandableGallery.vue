<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

interface Props {
  images: { src: string; alt: string; label: string; width: number; height: number }[];
  action?: { label: string; to: string };
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <div :class="cn('flex h-72 w-full gap-3 sm:h-96 sm:gap-5', props.class)">
    <button
      v-for="(image, index) in images"
      :key="image.src"
      type="button"
      :class="index >= 2 ? 'hidden sm:flex' : 'flex'"
      class="group relative h-full min-w-0 flex-1 cursor-zoom-in overflow-hidden border-[3px] border-foreground-bold bg-background p-0 shadow-[5px_5px_0_var(--color-foreground-bold)] transition-[flex-grow] duration-500 ease-in-out hover:flex-3 focus-visible:flex-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold"
      :aria-label="image.alt"
      @click="emit('select', index)"
    >
      <img
        class="absolute inset-0 h-full w-full object-cover"
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        loading="lazy"
        decoding="async"
      >
      <span class="absolute bottom-3 left-3 border-2 border-white bg-[#111] px-2 py-1 text-[0.65rem] font-black text-white">{{ image.label }}</span>
    </button>
    <NuxtLinkLocale
      v-if="action"
      :to="action.to"
      class="group relative flex h-full min-w-0 flex-1 flex-col justify-between overflow-hidden border-[3px] border-foreground-bold bg-[#ef7659] p-3 text-[#171717] no-underline shadow-[5px_5px_0_var(--color-foreground-bold)] transition-[flex-grow] duration-500 ease-in-out hover:flex-3 focus-visible:flex-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold sm:p-6"
    >
      <Icon name="lucide:arrow-up-right" class="size-6 shrink-0 self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-8" aria-hidden="true" />
      <span class="max-w-64 text-[clamp(1rem,2.5vw,2.4rem)] font-black uppercase leading-[0.95] tracking-[-0.06em]">{{ action.label }}</span>
    </NuxtLinkLocale>
  </div>
</template>
