<script setup lang="ts">
import { LiquidWeb } from "liquid-web/vue";
import { useForwardProps } from "reka-ui";

export interface LiquidWebOptions {
  el?: string | HTMLElement;
  init?: boolean;
  scale?: number;
  blur?: number | string;
  saturation?: number | string;
  aberration?: number;
  mode?: "standard" | "polar" | "prominent" | "shader";
}

const props = withDefaults(
  defineProps<{
    selector?: string;
    class?: string;
    options?: LiquidWebOptions;
  }>(),
  {
    selector: "div",
    class: "",
    options: () => ({
      scale: 150,
      blur: 0,
      mode: "prominent",
    }),
  }
);

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <LiquidWeb
    v-bind="forwarded"
    :class="cn('relative border border-white/10', props.class)"
  >
    <slot />
  </LiquidWeb>
</template>
