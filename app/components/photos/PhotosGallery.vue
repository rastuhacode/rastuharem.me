<script setup lang="ts">
import type { PhotoIndexManifest, PortfolioPhoto } from "../../../shared/types/photo";
import { layoutPhotos, visiblePhotoTiles } from "~~/shared/utils/photoLayout";

const props = defineProps<{ preview?: boolean }>();
const { t, locale } = useI18n();
const { data: manifest, error: manifestError } = await useFetch<PhotoIndexManifest>("/api/photo-index/manifest.json", {
  default: () => ({ count: 0, pageSize: 60, pages: 0 }),
});
const { data: firstPage, error: firstPageError } = await useFetch<PortfolioPhoto[]>("/api/photo-index/page-0001.json", {
  default: () => [],
});
const photos = ref<PortfolioPhoto[]>([...firstPage.value]);
const currentPage = ref(1);
const loadingMore = ref(false);
const moreError = ref(false);

function pageUrl(page: number) {
  return `/api/photo-index/page-${String(page).padStart(4, "0")}.json`;
}

async function loadMore() {
  if (props.preview || loadingMore.value || currentPage.value >= manifest.value.pages) return;
  loadingMore.value = true;
  moreError.value = false;
  try {
    const next = currentPage.value + 1;
    const page = await $fetch<PortfolioPhoto[]>(pageUrl(next));
    photos.value.push(...page);
    currentPage.value = next;
  }
  catch {
    moreError.value = true;
  }
  finally {
    loadingMore.value = false;
  }
}

const previewPhotos = computed(() => photos.value.slice(0, 3).map((photo, index) => ({ photo, index })));
const previewImages = computed(() => previewPhotos.value.map(({ photo, index }) => ({
  src: photo.src,
  alt: t("homepage.photography.openPhoto", { number: index + 1 }),
  label: String(index + 1).padStart(2, "0"),
  width: photo.width,
  height: photo.height,
})));

const galleryRef = useTemplateRef<HTMLDivElement>("gallery");
const loadMoreRef = useTemplateRef<HTMLButtonElement>("loadMore");
const virtualReady = ref(false);
const columnCount = ref(1);
const galleryWidth = ref(0);
const viewportTop = ref(0);
const viewportHeight = ref(0);
const focusedIndex = ref<number | null>(null);
const gap = computed(() => columnCount.value === 3 ? 28 : 20);
const layout = computed(() => galleryWidth.value > 0
  ? layoutPhotos(photos.value, columnCount.value, galleryWidth.value, gap.value)
  : null);
const visibleTiles = computed(() => {
  if (!layout.value) return [];
  const tiles = visiblePhotoTiles(layout.value, viewportTop.value - 700, viewportTop.value + viewportHeight.value + 700);
  if (focusedIndex.value !== null && !tiles.some(tile => tile.index === focusedIndex.value)) {
    const tile = layout.value.tiles[focusedIndex.value];
    if (tile) tiles.push(tile);
  }
  return tiles.sort((a, b) => a.index - b.index);
});
const fallbackColumns = computed(() => {
  const columns = Array.from({ length: columnCount.value }, () => [] as { photo: PortfolioPhoto; index: number }[]);
  photos.value.forEach((photo, index) => columns[index % columns.length]!.push({ photo, index }));
  return columns;
});

let resizeObserver: ResizeObserver | undefined;
let moreObserver: IntersectionObserver | undefined;
let scrollFrame = 0;
let scrollContainer: HTMLElement | undefined;

function findScrollContainer(element: HTMLElement) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/\b(auto|scroll|overlay)\b/.test(getComputedStyle(parent).overflowY)) return parent;
  }
}

function measureViewport() {
  const gallery = galleryRef.value;
  if (!gallery) return;
  galleryWidth.value = gallery.clientWidth;
  viewportTop.value = (scrollContainer?.getBoundingClientRect().top ?? 0) - gallery.getBoundingClientRect().top;
  viewportHeight.value = scrollContainer?.clientHeight ?? window.innerHeight;
}

function scheduleViewport() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    measureViewport();
  });
}

onMounted(() => {
  if (galleryRef.value) scrollContainer = findScrollContainer(galleryRef.value);
  const updateColumns = () => {
    columnCount.value = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    measureViewport();
  };
  updateColumns();
  resizeObserver = new ResizeObserver(updateColumns);
  if (galleryRef.value) resizeObserver.observe(galleryRef.value);
  (scrollContainer ?? window).addEventListener("scroll", scheduleViewport, { passive: true });
  window.addEventListener("resize", updateColumns);
  virtualReady.value = true;
  nextTick(measureViewport);

  if (!props.preview && loadMoreRef.value) {
    moreObserver = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) void loadMore();
    }, { root: scrollContainer, rootMargin: "800px" });
    moreObserver.observe(loadMoreRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  moreObserver?.disconnect();
  (scrollContainer ?? window).removeEventListener("scroll", scheduleViewport);
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
});

async function handleGalleryKeydown(event: KeyboardEvent) {
  if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
  const button = event.target;
  if (!(button instanceof HTMLButtonElement) || button.dataset.photoIndex === undefined) return;

  const nextIndex = Number(button.dataset.photoIndex) + (event.shiftKey ? -1 : 1);
  if (nextIndex < 0 || nextIndex >= manifest.value.count) return;
  event.preventDefault();
  while (nextIndex >= photos.value.length && currentPage.value < manifest.value.pages) {
    await loadMore();
    if (moreError.value) return;
  }
  focusedIndex.value = nextIndex;
  const tile = layout.value?.tiles[nextIndex];
  if (tile && galleryRef.value) {
    const galleryTop = galleryRef.value.getBoundingClientRect().top;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + galleryTop - scrollContainer.getBoundingClientRect().top + tile.y - 96,
      });
    }
    else window.scrollTo({ top: window.scrollY + galleryTop + tile.y - 96 });
    measureViewport();
  }
  await nextTick();
  galleryRef.value?.querySelector<HTMLButtonElement>(`[data-photo-index="${nextIndex}"]`)?.focus();
}

function handleGalleryFocus(event: FocusEvent) {
  const button = event.target;
  if (button instanceof HTMLButtonElement && button.dataset.photoIndex !== undefined) {
    focusedIndex.value = Number(button.dataset.photoIndex);
  }
}

const activeIndex = ref<number | null>(null);
const dialogRef = useTemplateRef<HTMLDialogElement>("photoDialog");
const activePhoto = computed(() => activeIndex.value === null ? null : photos.value[activeIndex.value]);
const photoDetails = computed(() => {
  const photo = activePhoto.value;
  if (!photo) return [];
  const date = new Intl.DateTimeFormat(locale.value, { year: "numeric", month: "short", day: "numeric" })
    .format(new Date(`${photo.takenAt.slice(0, 10)}T00:00:00`));
  return [
    { label: t("homepage.photography.file"), value: photo.fileName },
    { label: t("homepage.photography.dateTaken"), value: date },
    { label: t("homepage.photography.camera"), value: photo.camera },
    { label: t("homepage.photography.lens"), value: photo.lens },
    { label: t("homepage.photography.focalLength"), value: photo.focalLength },
    { label: t("homepage.photography.shutter"), value: photo.shutter },
    { label: t("homepage.photography.aperture"), value: photo.aperture },
    { label: "ISO", value: photo.iso?.toString() },
    { label: t("homepage.photography.resolution"), value: `${photo.width} × ${photo.height}` },
  ].filter(detail => detail.value);
});

function photoLabel(index: number) {
  return t("homepage.photography.photoLabel", { number: index + 1, total: manifest.value.count });
}

function closePhoto() {
  activeIndex.value = null;
}

watch(activeIndex, async (index) => {
  if (index === null) {
    dialogRef.value?.close();
    return;
  }
  await nextTick();
  if (!dialogRef.value?.open) dialogRef.value?.showModal();
});
</script>

<template>
  <p v-if="manifestError || firstPageError" class="border-[3px] border-foreground-bold p-6 font-semibold text-foreground-bold">{{ $t("homepage.photography.loadError") }}</p>
  <RExpandableGallery v-if="preview" :images="previewImages" :action="{ label: t('homepage.photography.viewAction'), to: '/photos' }" @select="activeIndex = previewPhotos[$event]?.index ?? null" />
  <template v-else>
    <div
      ref="gallery"
      :class="virtualReady ? 'relative' : 'grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7'"
      :style="virtualReady ? { height: `${layout?.height ?? 0}px` } : undefined"
      :aria-label="$t('homepage.photography.galleryLabel')"
      @keydown="handleGalleryKeydown"
      @focusin="handleGalleryFocus"
    >
      <template v-if="virtualReady">
        <figure
          v-for="tile in visibleTiles"
          :key="tile.photo.src"
          class="absolute left-0 top-0"
          :style="{ width: `${tile.width}px`, height: `${tile.height}px`, transform: `translate(${tile.x}px, ${tile.y}px)` }"
        >
          <PhotoCard :photo="tile.photo" :index="tile.index" :total="manifest.count" :image-height="tile.imageHeight" :tab-stop="tile.index === 0 || tile.index === photos.length - 1" :eager="tile.index < columnCount" @select="activeIndex = $event" />
        </figure>
      </template>
      <template v-else>
        <div v-for="(column, columnIndex) in fallbackColumns" :key="columnIndex" class="flex min-w-0 flex-col gap-5 xl:gap-7">
          <figure v-for="{ photo, index } in column" :key="photo.src">
            <PhotoCard :photo="photo" :index="index" :total="manifest.count" :tab-stop="index === 0 || index === photos.length - 1" :eager="index < columnCount" @select="activeIndex = $event" />
          </figure>
        </div>
      </template>
    </div>
    <button
      v-if="currentPage < manifest.pages"
      ref="loadMore"
      type="button"
      class="mt-10 w-full border-[3px] border-foreground-bold px-6 py-4 font-black uppercase tracking-wider text-foreground-bold"
      :disabled="loadingMore"
      @click="loadMore"
    >{{ loadingMore ? $t("homepage.photography.loadingMore") : $t("homepage.photography.loadMore") }}</button>
    <p v-if="moreError" class="mt-4 font-semibold text-foreground-bold">{{ $t("homepage.photography.loadError") }}</p>
  </template>

  <Teleport to="body">
    <dialog
      ref="photoDialog"
      class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col border-0 bg-[#111] p-0 text-white open:flex"
      :aria-label="$t('homepage.photography.previewLabel')"
      @click="closePhoto"
      @close="closePhoto"
    >
      <template v-if="activePhoto">
        <div class="relative min-h-0 flex-1">
          <img :src="activePhoto.src" :alt="photoLabel(activeIndex!)" class="absolute inset-0 h-full w-full object-contain">
        </div>
        <div class="shrink-0 border-t-2 border-white/50 bg-[#111] px-5 py-4 sm:px-8 sm:py-5">
          <div class="mb-4 text-xs font-black uppercase tracking-[0.2em]">{{ String(activeIndex! + 1).padStart(2, "0") }} / {{ manifest.count }}</div>
          <dl class="flex flex-wrap gap-x-7 gap-y-3">
            <div v-for="detail in photoDetails" :key="detail.label" class="min-w-fit">
              <dt class="text-[0.6rem] font-black uppercase tracking-[0.18em] text-white/55">{{ detail.label }}</dt>
              <dd class="mt-1 text-xs font-semibold sm:text-sm">{{ detail.value }}</dd>
            </div>
          </dl>
        </div>
        <button
          type="button"
          class="absolute right-5 top-5 flex size-12 cursor-pointer items-center justify-center border-2 border-white bg-[#111] text-white transition-colors hover:bg-white hover:text-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-8 sm:top-8"
          :aria-label="$t('homepage.photography.closePhoto')"
          @click.stop="closePhoto"
        >
          <Icon name="lucide:x" class="size-6" aria-hidden="true" />
        </button>
      </template>
    </dialog>
  </Teleport>
</template>
