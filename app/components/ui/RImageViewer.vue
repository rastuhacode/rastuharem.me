<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean;
  src: string;
  alt: string;
  label: string;
  closeLabel: string;
  keyshortcuts?: string;
  initialFocus?: "image" | "close";
  swipeEnabled?: boolean;
}>(), {
  keyshortcuts: undefined,
  initialFocus: "image",
  swipeEnabled: false,
});

const emit = defineEmits<{ close: []; keydown: [event: KeyboardEvent]; swipe: [direction: -1 | 1] }>();
const dialogRef = useTemplateRef<HTMLDialogElement>("dialog");
const imageStageRef = useTemplateRef<HTMLDivElement>("imageStage");
const closeButtonRef = useTemplateRef<HTMLButtonElement>("closeButton");
let touchStart: { x: number; y: number; id: number } | null = null;
let suppressClickUntil = 0;

function startTouch(event: TouchEvent) {
  touchStart = null;
  suppressClickUntil = 0;
  const touch = event.touches[0];
  if (!props.swipeEnabled || event.touches.length !== 1 || !touch) return;
  touchStart = { x: touch.clientX, y: touch.clientY, id: touch.identifier };
}

function moveTouch(event: TouchEvent) {
  if (event.touches.length !== 1) cancelTouch();
}

function cancelTouch() {
  touchStart = null;
  suppressClickUntil = performance.now() + 500;
}

function endTouch(event: TouchEvent) {
  const start = touchStart;
  touchStart = null;
  if (!start || !props.open || !props.swipeEnabled || event.touches.length) return;
  const touch = Array.from(event.changedTouches).find(touch => touch.identifier === start.id);
  if (!touch) return;
  const x = touch.clientX - start.x;
  const y = touch.clientY - start.y;
  // Keep vertical scrolling, pinching, and small tap movements out of navigation.
  if (Math.hypot(x, y) > 12) suppressClickUntil = performance.now() + 500;
  if (Math.abs(x) >= 50 && Math.abs(x) > Math.abs(y) * 1.5) emit("swipe", x < 0 ? 1 : -1);
}

function handleClick(event: MouseEvent) {
  // A touch swipe can synthesize a click; it must not also dismiss the viewer.
  if (event.detail > 0 && performance.now() < suppressClickUntil) return;
  emit("close");
}

function focusImage() {
  imageStageRef.value?.focus({ preventScroll: true });
}

defineExpose({ focusImage });

watch(() => props.open, async (open) => {
  if (!open) {
    touchStart = null;
    suppressClickUntil = 0;
    dialogRef.value?.close();
    return;
  }

  await nextTick();
  if (!props.open || dialogRef.value?.open) return;
  dialogRef.value?.showModal();
  if (props.initialFocus === "close") closeButtonRef.value?.focus({ preventScroll: true });
  else focusImage();
}, { immediate: true });
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col border-0 bg-[#111] p-0 text-white open:flex"
      :aria-label="label"
      :aria-keyshortcuts="keyshortcuts"
      @click="handleClick"
      @cancel.prevent="emit('close')"
      @close="props.open && emit('close')"
      @keydown.capture="emit('keydown', $event)"
    >
      <template v-if="open">
        <figure class="m-0 flex min-h-0 flex-1 flex-col">
          <div
            ref="imageStage"
            tabindex="-1"
            class="relative min-h-0 flex-1 outline-none"
            :class="swipeEnabled ? '[touch-action:pan-y_pinch-zoom]' : ''"
            @touchstart.passive="startTouch"
            @touchmove.passive="moveTouch"
            @touchend.passive="endTouch"
            @touchcancel.passive="cancelTouch"
          >
            <img :src="src" :alt="alt" class="absolute inset-0 h-full w-full object-contain">
          </div>
          <figcaption
            v-if="$slots.footer"
            class="flex max-h-[35dvh] shrink-0 flex-col overflow-y-auto border-t-2 border-white/50 bg-[#111] pb-[env(safe-area-inset-bottom)]"
            @click.stop
          >
            <slot name="footer" />
          </figcaption>
        </figure>
        <button
          ref="closeButton"
          type="button"
          class="absolute right-5 top-5 flex size-12 cursor-pointer items-center justify-center border-2 border-white bg-[#111] text-white transition-colors hover:bg-white hover:text-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-8 sm:top-8"
          :aria-label="closeLabel"
          @click.stop="emit('close')"
        >
          <Icon name="lucide:x" class="size-6" aria-hidden="true" />
        </button>
      </template>
    </dialog>
  </Teleport>
</template>
