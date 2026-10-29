<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    href?: string;
    target?: HTMLAnchorElement["target"];
  }>(),
  { class: "", href: undefined, target: "_blank" },
);

const localePath = useLocalePath();
const href = computed(() => {
  const path = props.href?.split(/[?#]/, 1)[0] ?? "";
  // Files, external URLs and fragment links are not localized page routes.
  if (!props.href || !path.startsWith("/") || path.startsWith("//") || /\.[^/]+$/.test(path)) return props.href;
  return localePath(props.href);
});
</script>

<template>
  <a
    :href="href"
    :class="cn('border-underline inline-block', props.class)"
    :target="props.target"
  >
    <slot />
  </a>
</template>
