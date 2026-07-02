<script setup lang="ts">
import type { ImgHTMLAttributes, HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: ImgHTMLAttributes['alt']
    caption?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    class: '',
    alt: '',
    caption: '',
  },
)

const dialogRef = useTemplateRef<HTMLDivElement>('dialogRef')

const isPreview = ref(false)

const handleClose = () => {
  if (isPreview.value === false) return
  isPreview.value = false
}

watch(isPreview, (newVal) => {
  if (!newVal) return
  nextTick(() => {
    dialogRef.value?.focus()
  })
})
</script>

<template>
  <figure class="flex flex-col w-fit max-w-full min-w-0">
    <button
      type="button"
      data-slot="post-image-button"
      :aria-label="alt || $t('image_preview')"
      :class="
        cn(
          'flex items-center justify-center w-full border border-transparent hover:border-muted-foreground transition-colors duration-300',
          props.class,
        )
      "
      @click="isPreview = true"
    >
      <img
        data-slot="post-image"
        :src="props.src"
        :alt="props.alt"
        class="max-h-full max-w-full object-contain"
      >
    </button>
    <figcaption
      v-if="caption"
      class="text-center"
    >
      {{ caption }}
    </figcaption>
  </figure>

  <Teleport to="body">
    <figure
      v-if="isPreview"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('image_preview')"
      class="fixed top-0 left-0 size-screen backdrop-blur-xs z-50 flex items-center justify-center"
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
        class="absolute bottom-2 right-2 bg-background p-2 rounded-md"
      >
        {{ caption }}
      </figcaption>
    </figure>
  </Teleport>
</template>
