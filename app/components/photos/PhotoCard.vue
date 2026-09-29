<script setup lang="ts">
import type { PortfolioPhoto } from "../../../shared/types/photo";

const props = defineProps<{
  photo: PortfolioPhoto;
  index: number;
  total: number;
  imageHeight?: number;
  tabStop?: boolean;
  eager?: boolean;
}>();
const emit = defineEmits<{ select: [index: number] }>();
const { t } = useI18n();
const label = computed(() => t("homepage.photography.openPhoto", { number: props.index + 1 }));
</script>

<template>
  <button
    type="button"
    :data-photo-index="index"
    :tabindex="tabStop ? 0 : -1"
    class="group block w-full border-[3px] border-foreground-bold bg-background p-0 text-left shadow-[6px_6px_0_var(--color-foreground-bold)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-foreground-bold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold"
    :aria-label="label"
    @click="emit('select', index)"
  >
    <img
      :src="photo.src"
      :alt="t('homepage.photography.photoLabel', { number: index + 1, total })"
      :width="photo.width"
      :height="photo.height"
      :style="imageHeight === undefined ? undefined : { height: `${imageHeight}px` }"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="block w-full"
    >
    <span class="flex h-[35px] items-center justify-between border-t-[3px] border-foreground-bold px-3 text-[0.65rem] font-black uppercase tracking-[0.16em] text-foreground-bold sm:px-4">
      <span>{{ t("homepage.photography.frame") }} / {{ String(index + 1).padStart(2, "0") }}</span>
      <Icon name="lucide:expand" class="size-4 transition-transform group-hover:scale-125" aria-hidden="true" />
    </span>
  </button>
</template>
