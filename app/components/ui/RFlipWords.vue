<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    duration?: number;
    words: string[];
  }>(),
  {
    class: "",
    duration: 3200,
  },
);

const currentIndex = ref(0);
const reduceMotion = ref(false);
let intervalId: ReturnType<typeof setInterval> | undefined;

const currentWord = computed(() => props.words[currentIndex.value] ?? "");

onMounted(() => {
  reduceMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion.value && props.words.length > 1) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.words.length;
    }, props.duration);
  }
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <span
    :class="cn('relative inline-grid [perspective:900px]', props.class)"
    :aria-label="currentWord"
  >
    <Transition name="flip-word">
      <span
        :key="currentWord"
        aria-hidden="true"
        class="col-start-1 row-start-1 inline-block origin-center"
      >
        {{ currentWord }}
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.flip-word-enter-active,
.flip-word-leave-active {
  transition: opacity 420ms ease, transform 420ms ease, filter 420ms ease;
}

.flip-word-enter-from {
  opacity: 0;
  filter: blur(5px);
  transform: rotateX(-72deg) translateY(0.3em);
}

.flip-word-leave-to {
  opacity: 0;
  filter: blur(5px);
  transform: rotateX(72deg) translateY(-0.3em);
}

@media (prefers-reduced-motion: reduce) {
  .flip-word-enter-active,
  .flip-word-leave-active {
    transition: none;
  }
}
</style>
