<script setup lang="ts">
import HomeViewHeader from "./HomeViewHeader.vue";

type Focus = "engineering" | "photography" | "other";
defineProps<{ focus: Focus }>();
</script>

<template>
  <div id="focus-content" class="scroll-mt-8 space-y-24 sm:space-y-32" aria-live="polite">
    <HomeViewHeader :focus="focus" />

    <template v-if="focus === 'engineering'">
      <HomeExperienceShowcase />
      <HomeProjectsShowcase />
    </template>

    <section v-if="focus === 'photography'" aria-labelledby="photography-heading">
      <div class="mb-9">
        <p class="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">{{ $t("homepage.photography.kicker") }}</p>
        <h3 id="photography-heading" class="mt-3 text-3xl font-black uppercase tracking-[-0.055em] text-foreground-bold sm:text-5xl">{{ $t("homepage.photography.heading") }}</h3>
      </div>
      <PhotosGallery preview type="solo" />
    </section>

    <HomeOtherShowcase v-if="focus === 'other'" />
  </div>
</template>
