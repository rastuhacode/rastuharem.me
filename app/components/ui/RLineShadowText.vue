<script setup lang="ts">
import type { VNode } from "vue";
import { useSlots } from "vue";

interface LineShadowTextProps {
  shadowColor?: string;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const props = withDefaults(defineProps<LineShadowTextProps>(), {
  shadowColor: "black",
  as: "span" as keyof HTMLElementTagNameMap,
  class: "",
});

const slots = useSlots() as Record<string, () => VNode[]>;
const children = slots?.default ? slots.default()[0]?.children : null;

const content = typeof children === "string" ? children : null;

if (!content) {
  throw new Error("LineShadowText only accepts string content");
}
</script>

<template>
  <component
    :is="as"
    :class="
      cn(
        `shadow-color relative z-0 inline-flex`,
        props.class,
      )
    "
  >
    <span aria-hidden="true" :data-text="content" class="line-shadow pointer-events-none absolute top-[0.12em] left-[0.1em] -z-10" />
    <slot />
  </component>
</template>

<style scoped>
.shadow-color {
  --shadow-color: v-bind(props.shadowColor);
}

.line-shadow::before {
  content: attr(data-text);
  background: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0);
  background-size: 0.1em 0.1em;
  background-clip: text;
  color: transparent;
  animation: line-shadow 15s linear infinite;
}

@keyframes line-shadow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% -100%;
  }
}
</style>
