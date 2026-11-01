<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    v-bind="forwarded"
    :class="
      cn(
        'peer group/switch inline-flex size-11 shrink-0 items-center justify-center rounded-sm outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <span aria-hidden="true" class="inline-flex h-[1.15rem] w-8 items-center rounded-full border border-transparent shadow-xs transition-colors group-data-[state=unchecked]/switch:bg-ring group-data-[state=checked]/switch:bg-foreground">
      <SwitchThumb
        data-slot="switch-thumb"
        :class="
          cn(
            'bg-background pointer-events-none size-4 rounded-full ring-0 transition-transform relative flex items-center justify-center',
            'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
          )
        "
      >
        <slot name="thumb" v-bind="slotProps" />
      </SwitchThumb>
    </span>
  </SwitchRoot>
</template>
