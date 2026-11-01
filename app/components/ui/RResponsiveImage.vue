<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string;
  width: number;
  height: number;
  sizes: string;
  alt?: string;
  loading?: "lazy" | "eager";
}>(), {
  alt: "",
  loading: "lazy",
});

const image = useImage();
const sources = computed(() => {
  const widths = [240, 320, 480, 640, 960, 1280, 1920].filter(width => width < props.width);
  // Keep the original as the largest candidate; never upscale a source photo.
  const srcset = [
    ...widths.map(width => `${image(props.src, { width, quality: 95 })} ${width}w`),
    `${props.src} ${props.width}w`,
  ].join(", ");
  const src = props.width > 640 ? image(props.src, { width: 640, quality: 95 }) : props.src;
  return { src, srcset };
});
</script>

<template>
  <img
    :src="sources.src"
    :srcset="sources.srcset"
    :sizes="sizes"
    :width="width"
    :height="height"
    :alt="alt"
    :loading="loading"
    decoding="async"
  >
</template>
