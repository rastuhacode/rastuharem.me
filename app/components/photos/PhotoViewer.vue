<script setup lang="ts">
import type { PortfolioPhoto } from "../../../shared/types/photo";

const props = defineProps<{
  photo?: PortfolioPhoto | null;
  type: "solo" | "collection";
  index: number;
  total: number;
}>();
const emit = defineEmits<{ close: []; navigate: [direction: -1 | 1] }>();
const { t, locale } = useI18n();
const detailsVisible = useLocalStorage("photo-details-visible", false);
const detailsId = useId();
const dialogRef = useTemplateRef<HTMLDialogElement>("photoDialog");
const photoStageRef = useTemplateRef<HTMLDivElement>("photoStage");
const photoLabel = computed(() => props.type === "collection"
  ? t("homepage.photography.photoLabel", { number: props.index + 1, total: props.total })
  : t("homepage.photography.photograph"));
const photoDetails = computed(() => {
  const photo = props.photo;
  if (!photo) return [];
  const date = new Intl.DateTimeFormat(locale.value, { year: "numeric", month: "short", day: "numeric" })
    .format(new Date(`${photo.takenAt.slice(0, 10)}T00:00:00`));
  return [
    { label: t("homepage.photography.dateTaken"), value: date, wide: true },
    { label: t("homepage.photography.camera"), value: photo.camera, wide: true },
    { label: t("homepage.photography.lens"), value: photo.lens, fullWidth: true },
    { label: t("homepage.photography.focalLength"), value: photo.focalLength },
    { label: t("homepage.photography.shutter"), value: photo.shutter },
    { label: t("homepage.photography.aperture"), value: photo.aperture },
    { label: "ISO", value: photo.iso?.toString() },
    { label: t("homepage.photography.resolution"), value: `${photo.width} × ${photo.height}`, wide: true },
  ].filter(detail => detail.value);
});

function handlePhotoKeydown(event: KeyboardEvent) {
  if (!props.photo || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  event.stopPropagation();
  // Arrow navigation stays on the image; Tab still focuses the viewer controls.
  photoStageRef.value?.focus({ preventScroll: true });
  if (props.type === "collection") emit("navigate", event.key === "ArrowRight" ? 1 : -1);
}

watch(() => props.photo, async (photo) => {
  if (!photo) {
    dialogRef.value?.close();
    return;
  }
  await nextTick();
  if (props.photo !== photo) return;
  if (!dialogRef.value?.open) {
    dialogRef.value?.showModal();
    photoStageRef.value?.focus({ preventScroll: true });
  }
}, { immediate: true });
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="photoDialog"
      class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col border-0 bg-[#111] p-0 text-white open:flex"
      :aria-label="$t('homepage.photography.previewLabel')"
      :aria-keyshortcuts="type === 'collection' ? 'ArrowLeft ArrowRight' : undefined"
      @click="emit('close')"
      @close="emit('close')"
      @keydown.capture="handlePhotoKeydown"
    >
      <template v-if="photo">
        <div ref="photoStage" tabindex="-1" class="relative min-h-0 flex-1 outline-none">
          <img :src="photo.src" :alt="photoLabel" class="absolute inset-0 h-full w-full object-contain">
        </div>
        <div class="flex max-h-[35dvh] shrink-0 flex-col border-t-2 border-white/50 bg-[#111] pb-[env(safe-area-inset-bottom)]" @click.stop>
          <button
            type="button"
            class="flex min-h-11 w-full shrink-0 cursor-pointer items-center gap-3 px-4 text-xs font-black uppercase tracking-[0.15em] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:px-8"
            :class="type === 'collection' ? 'justify-between' : 'justify-end'"
            :aria-expanded="detailsVisible"
            :aria-controls="detailsId"
            @click="detailsVisible = !detailsVisible"
          >
            <span v-if="type === 'collection'">{{ String(index + 1).padStart(2, "0") }} / {{ total }}</span>
            <span class="flex items-center gap-2">
              {{ $t(detailsVisible ? "homepage.photography.hideDetails" : "homepage.photography.showDetails") }}
              <Icon :name="detailsVisible ? 'lucide:chevron-down' : 'lucide:chevron-up'" class="size-4" aria-hidden="true" />
            </span>
          </button>
          <dl v-show="detailsVisible" :id="detailsId" class="grid min-h-0 grid-cols-4 gap-x-3 gap-y-2 overflow-y-auto overscroll-contain px-4 pt-2 pb-3 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3 sm:px-8 sm:pt-3 sm:pb-5">
            <div v-for="detail in photoDetails" :key="detail.label" class="min-w-0 sm:max-w-full" :class="detail.fullWidth ? 'col-span-4' : detail.wide ? 'col-span-2' : ''">
              <dt class="wrap-break-word text-[0.6rem] font-black uppercase tracking-widest text-white/55 sm:tracking-[0.18em]">{{ detail.label }}</dt>
              <dd class="mt-0.5 wrap-break-word text-xs font-semibold sm:mt-1 sm:text-sm">{{ detail.value }}</dd>
            </div>
          </dl>
        </div>
        <button
          type="button"
          class="absolute right-5 top-5 flex size-12 cursor-pointer items-center justify-center border-2 border-white bg-[#111] text-white transition-colors hover:bg-white hover:text-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-8 sm:top-8"
          :aria-label="$t('homepage.photography.closePhoto')"
          @click.stop="emit('close')"
        >
          <Icon name="lucide:x" class="size-6" aria-hidden="true" />
        </button>
      </template>
    </dialog>
  </Teleport>
</template>
