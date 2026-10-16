<script setup lang="ts">
import type { ImgHTMLAttributes, HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: ImgHTMLAttributes["alt"];
    caption?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    class: "",
    alt: "",
    caption: "",
  },
);

const dialogRef = useTemplateRef<HTMLDivElement>("dialogRef");

const isPreview = ref(false);

const handleClose = () => {
  if (isPreview.value === false) return;
  isPreview.value = false;
};

watch(isPreview, (newVal) => {
  if (!newVal) return;
  nextTick(() => {
    dialogRef.value?.focus();
  });
});
</script>

<template>
  <figure class="not-prose my-8 flex w-full max-w-full min-w-0 flex-col border-2 border-foreground-bold bg-background shadow-[4px_4px_0_var(--color-foreground-bold)]">
    <button
      type="button"
      data-slot="post-image-button"
      :aria-label="alt || $t('image_preview')"
      :class="
        cn(
          'flex items-center justify-center w-full min-w-0 cursor-zoom-in p-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#72afc8]',
          props.class,
        )
      "
      @click="isPreview = true"
    >
      <img
        data-slot="post-image"
        :src="props.src"
        :alt="props.alt"
        class="m-0 block h-auto w-full max-h-full max-w-full object-contain"
      >
    </button>
    <figcaption
      v-if="caption"
      class="m-0 flex items-start justify-between gap-3 border-t-2 border-foreground-bold px-3 py-2 font-mono text-xs leading-relaxed text-foreground-bold"
    >
      <span class="min-w-0">{{ caption }}</span>
      <span class="flex size-6 shrink-0 items-center justify-center border border-foreground-bold bg-[#72afc8] text-[#171717]" aria-hidden="true">
        <Icon name="lucide:expand" class="size-3.5" />
      </span>
    </figcaption>
  </figure>

  <Teleport to="body">
    <figure
      v-if="isPreview"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('image_preview')"
      class="fixed top-0 left-0 size-screen bg-background/90 backdrop-blur-xs z-50 flex items-center justify-center cursor-zoom-out"
      tabindex="-1"
      @click="handleClose"
      @keydown.escape="handleClose"
    >
      <img
        :src="props.src"
        :alt="props.alt"
        :class="cn('max-w-screen max-h-screen w-full h-full object-contain')"
      >
      <figcaption
        v-if="caption"
        class="absolute bottom-3 right-3 left-3 w-fit max-w-[calc(100%-1.5rem)] border-2 border-foreground-bold bg-background px-3 py-2 font-mono text-xs leading-relaxed text-foreground-bold shadow-[3px_3px_0_var(--color-foreground-bold)] sm:left-auto sm:max-w-lg"
      >
        {{ caption }}
      </figcaption>
    </figure>
  </Teleport>
</template>
