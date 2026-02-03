<script setup lang="ts">
import type { SeparatorProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { Separator } from "reka-ui";

const props = withDefaults(
  defineProps<SeparatorProps & { class?: HTMLAttributes["class"] }>(),
  {
    orientation: "horizontal",
    decorative: true,
    class: "",
  }
);

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <Separator
    data-slot="separator"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-border shrink-0 rounded-lg',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-12 data-[orientation=horizontal]:my-10 data-[orientation=horizontal]:mx-auto',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        props.class
      )
    "
  />
</template>
