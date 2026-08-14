<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Primitive } from "reka-ui";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes["class"];
      icon?: string;
      label: string;
      variant?: "solid" | "outline";
    }
  >(),
  {
    as: "a",
    class: "",
    icon: "lucide:arrow-up-right",
    variant: "solid",
  },
);

const delegatedProps = reactiveOmit(props, "class", "icon", "label", "variant");

const isSolid = computed(() => props.variant === "solid");
</script>

<template>
  <Primitive
    v-bind="delegatedProps"
    data-slot="interactive-hover-button"
    :data-variant="variant"
    :aria-label="label"
    :class="cn(
      'r-interactive-hover-button relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border px-5 text-sm font-semibold no-underline outline-none transition-colors duration-300',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'motion-reduce:transition-none',
      isSolid
        ? 'border-foreground-bold bg-foreground-bold text-background'
        : 'border-foreground/30 bg-background/70 text-foreground backdrop-blur-sm hover:border-foreground',
      props.class,
    )"
  >
    <span
      aria-hidden="true"
      :class="cn(
        'interactive-dot absolute left-5 z-0 size-2 rounded-full',
        isSolid ? 'bg-background' : 'bg-foreground-bold',
      )"
    />
    <span
      aria-hidden="true"
      class="interactive-default relative z-10 flex items-center gap-2"
    >
      <span class="size-2 shrink-0" />
      <span>{{ label }}</span>
    </span>

    <span
      aria-hidden="true"
      :class="cn(
        'interactive-hover absolute inset-0 z-20 flex items-center justify-center gap-2',
        isSolid ? 'text-foreground-bold' : 'text-background',
      )"
    >
      <span>{{ label }}</span>
      <Icon
        :name="icon"
        aria-hidden="true"
        class="size-4"
      />
    </span>
  </Primitive>
</template>

<style scoped>
.interactive-default,
.interactive-hover,
.interactive-dot {
  transition: transform 300ms ease-out, opacity 300ms ease-out;
}

.interactive-dot {
  transition-duration: 500ms;
}

.interactive-hover {
  opacity: 0;
  transform: translateX(2rem);
}

.r-interactive-hover-button:hover .interactive-default {
  opacity: 0;
  transform: translateX(2.5rem);
}

.r-interactive-hover-button:hover .interactive-dot {
  transform: scale(48);
}

.r-interactive-hover-button:hover .interactive-hover {
  opacity: 1;
  transform: translateX(0);
}

.r-interactive-hover-button:hover .interactive-icon {
  transform: translate(0.125rem, -0.125rem);
}

@media (prefers-reduced-motion: reduce) {
  .interactive-default,
  .interactive-hover,
  .interactive-dot,
  .interactive-icon {
    transition: none;
  }

  .r-interactive-hover-button:hover .interactive-default {
    opacity: 1;
    transform: none;
  }

  .r-interactive-hover-button:hover .interactive-dot {
    transform: none;
  }

  .r-interactive-hover-button:hover .interactive-hover {
    opacity: 0;
  }
}
</style>
