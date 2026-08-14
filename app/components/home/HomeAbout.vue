<script setup lang="ts">
defineProps<{
  description: string;
  eyebrow: string;
}>();
</script>

<template>
  <section class="home-shell not-prose border-t border-border/80 py-12 sm:py-14">
    <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {{ eyebrow }}
      </p>
      <p class="max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
        {{ description }}
      </p>
    </div>
  </section>
</template>
