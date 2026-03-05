<script lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { VNode, HTMLAttributes } from "vue";

export interface MarqueeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps["as"];
  /**
   * Pause the marquee on hover.
   * @defaultValue false
   */
  pauseOnHover?: boolean;
  /**
   * Reverse the direction of the marquee.
   * @defaultValue false
   */
  reverse?: boolean;
  /**
   * The orientation of the marquee.
   * @defaultValue 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * The number of times the marquee should repeat.
   * @defaultValue 4
   */
  repeat?: number;
  /**
   * Display an overlay on the marquee.
   * @defaultValue true
   */
  overlay?: boolean;
  class?: HTMLAttributes["class"];
}

export interface MarqueeSlots {
  default?(props?: Record<string, unknown>): VNode[];
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<MarqueeProps>(), {
  as: "div",
  orientation: "horizontal",
  repeat: 20,
  overlay: true,
  pauseOnHover: true,
  class: "",
});
defineSlots<MarqueeSlots>();

const { orientation, pauseOnHover, overlay } = toRefs(props);

const overlayClass =
  'before:absolute before:pointer-events-none before:content-[""] before:z-2 before:from-default before:to-transparent after:absolute after:pointer-events-none after:content-[""] after:z-2 after:from-default after:to-transparent';
</script>

<template>
  <Primitive
    :as="as"
    :data-orientation="orientation"
    data-slot="root"
    :class="
      cn(
        'group/marquee relative flex items-center overflow-hidden gap-(--gap) [--gap:--spacing(16)] [--duration:20s]',
        orientation === 'horizontal' ? 'w-full' : 'h-full',
        overlay ? overlayClass : '',
        reverse ? 'direction-[reverse]!' : '',

        orientation === 'horizontal' && overlay
          ? 'before:inset-y-0 before:left-0 before:h-full before:w-1/3 before:bg-linear-to-r after:inset-y-0 after:right-0 after:h-full after:w-1/3 after:bg-linear-to-l backface-hidden'
          : '',
        orientation === 'vertical' && overlay
          ? 'before:inset-x-0 before:top-0 before:w-full before:h-1/3 before:bg-linear-to-b after:inset-x-0 after:bottom-0 after:w-full after:h-1/3 after:bg-linear-to-t backface-hidden'
          : '',
        props.class,
      )
    "
  >
    <div
      v-for="i in repeat"
      :key="i"
      data-slot="content"
      :class="
        cn(
          'flex items-center shrink-0 justify-around gap-(--gap) min-w-max',
          pauseOnHover ? 'group-hover/marquee:paused' : '',
          orientation === 'horizontal'
            ? 'flex-row animate-[marquee_var(--duration)_linear_infinite] rtl:animate-[marquee-rtl_var(--duration)_linear_infinite] backface-hidden'
            : 'flex-col animate-[marquee-vertical_var(--duration)_linear_infinite] rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] h-fit backface-hidden',
        )
      "
    >
      <slot />
    </div>
  </Primitive>
</template>

<style>
@keyframes marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-100% - var(--gap)), 0, 0);
  }
}

@keyframes marquee-rtl {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(100% + var(--gap)), 0, 0);
  }
}

@keyframes marquee-vertical {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, calc(-100% - var(--gap)), 0);
  }
}

@keyframes marquee-vertical-rtl {
  from {
    transform: translate3d(0, calc(-100% - var(--gap)), 0);
  }

  to {
    transform: translate3d(0, calc(-100% * var(--gap)), 0);
  }
}
</style>
