<script setup lang="ts">
import type { DropdownMenuItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { DropdownMenuItem, useForwardProps } from "reka-ui";

const props = withDefaults(
  defineProps<
    DropdownMenuItemProps & {
      class?: HTMLAttributes["class"];
      inset?: boolean;
      variant?: "default" | "destructive";
    }
  >(),
  {
    variant: "default",
    class: "",
  }
);

const delegatedProps = reactiveOmit(props, "inset", "variant", "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-inset:pl-8',
        'focus:bg-accent focus:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-muted-foreground',

        // Destructive
        'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive',
        'dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:text-destructive!',

        props.class
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
