<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Primitive } from "reka-ui";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes["class"];
    }
  >(),
  { as: "a", class: "" }
);

const delegatedProps = reactiveOmit(props, "class");

const target = computed(() => {
  return props.as === "a" ? "_blank" : undefined;
});
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="
      cn(
        'leading-none font-normal whitespace-nowrap text-ellipsis',
        'inline-flex items-center p-1 gap-1 rounded-md no-underline h-6 transition-colors duration-300',
        'border border-gray-600 bg-gray-700 hover:bg-gray-800',
        props.class
      )
    "
    :target="target"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
