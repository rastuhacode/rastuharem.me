<script setup lang="ts">
import type { ImgHTMLAttributes, HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    width: number | string;
    height: number | string;
    alt?: ImgHTMLAttributes["alt"];
    caption?: string;
    sizes?: string;
    loading?: ImgHTMLAttributes["loading"];
    class?: HTMLAttributes["class"];
  }>(),
  {
    class: "",
    alt: "",
    caption: "",
    sizes: "min(calc(100vw - 2.75rem), calc(40rem - 2.75rem))",
    loading: "lazy",
  },
);

const image = useImage();
// Keep screenshots lossless, and avoid aggressive recompression of JPEG charts.
const imageModifiers = computed(() => props.src.toLowerCase().endsWith(".png")
  ? { format: "png" }
  : { quality: 95 });
const imageSrc = computed(() => image(props.src, {
  ...imageModifiers.value,
  width: Math.min(Number(props.width), 640),
}));
const imageSrcset = computed(() => {
  const originalWidth = Number(props.width);
  const widths = [...[240, 320, 480, 640, 960, 1280, 1920].filter(width => width < originalWidth), originalWidth];
  return widths.map(width => `${image(props.src, { ...imageModifiers.value, width })} ${width}w`).join(", ");
});

const triggerRef = useTemplateRef<HTMLButtonElement>("triggerRef");

const isPreview = ref(false);

const handleClose = async () => {
  if (isPreview.value === false) return;
  isPreview.value = false;
  await nextTick();
  triggerRef.value?.focus({ preventScroll: true });
};
</script>

<template>
  <figure class="not-prose my-8 flex w-full max-w-full min-w-0 flex-col border-2 border-foreground-bold bg-background shadow-[4px_4px_0_var(--color-foreground-bold)]">
    <button
      ref="triggerRef"
      type="button"
      data-slot="post-image-button"
      :aria-label="alt || $t('image_preview')"
      :class="
        cn(
          'flex items-center justify-center w-full min-w-0 p-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#72afc8]',
          props.class,
        )
      "
      @click="isPreview = true"
    >
      <img
        data-slot="post-image"
        :src="imageSrc"
        :srcset="imageSrcset"
        :sizes="props.sizes"
        :width="props.width"
        :height="props.height"
        :loading="props.loading"
        decoding="async"
        :alt="props.alt"
        class="m-0 block h-auto w-full max-h-full max-w-full object-contain"
      >
    </button>
    <figcaption
      v-if="caption"
      class="m-0 flex items-start justify-between gap-3 border-t-2 border-foreground-bold px-3 py-2 font-mono text-xs leading-relaxed text-foreground-bold"
    >
      <span class="min-w-0">{{ caption }}</span>
    </figcaption>
  </figure>

  <RImageViewer
    :open="isPreview"
    :src="props.src"
    :alt="props.alt"
    :label="$t('image_preview')"
    :close-label="$t('close_image_preview')"
    initial-focus="close"
    @close="handleClose"
  >
    <template v-if="caption" #footer>
      <p class="m-0 px-4 py-3 font-mono text-xs leading-relaxed wrap-break-word sm:px-8 sm:py-4 sm:text-sm">{{ caption }}</p>
    </template>
  </RImageViewer>
</template>
