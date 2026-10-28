<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean;
  src: string;
  alt: string;
  label: string;
  closeLabel: string;
  keyshortcuts?: string;
  initialFocus?: "image" | "close";
}>(), {
  keyshortcuts: undefined,
  initialFocus: "image",
});

const emit = defineEmits<{ close: []; keydown: [event: KeyboardEvent] }>();
const dialogRef = useTemplateRef<HTMLDialogElement>("dialog");
const imageStageRef = useTemplateRef<HTMLDivElement>("imageStage");
const closeButtonRef = useTemplateRef<HTMLButtonElement>("closeButton");

function focusImage() {
  imageStageRef.value?.focus({ preventScroll: true });
}

defineExpose({ focusImage });

watch(() => props.open, async (open) => {
  if (!open) {
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
      @click="emit('close')"
      @cancel.prevent="emit('close')"
      @close="props.open && emit('close')"
      @keydown.capture="emit('keydown', $event)"
    >
      <template v-if="open">
        <figure class="m-0 flex min-h-0 flex-1 flex-col">
          <div ref="imageStage" tabindex="-1" class="relative min-h-0 flex-1 outline-none">
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
