<script setup lang="ts">
defineProps<{ href?: string }>();
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="group inline-flex h-14 min-w-0 max-w-full items-center gap-2 border-2 border-foreground-bold bg-background/80 px-3 py-2 text-foreground-bold no-underline shadow-[4px_4px_0_var(--color-foreground-bold)] backdrop-blur-lg sm:gap-3"
    :class="href ? 'transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground' : ''"
  >
    <slot />
    <Icon v-if="href" name="lucide:arrow-up-right" class="size-4 shrink-0 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
  </component>
</template>
