<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: () => t("homepage.photography.title") + " · Rasten Remizov", description: () => t("homepage.photography.description") });
</script>

<template>
  <div class="site-container not-prose mx-auto grow py-12 sm:py-20">
    <header class="mb-12 border-b-[3px] border-foreground-bold pb-8 text-foreground-bold sm:mb-16 sm:pb-12">
      <p class="inline-block -rotate-2 bg-[#ef7659] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#171717]">{{ $t("homepage.photography.kicker") }}</p>
      <div class="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] lg:items-end">
        <h1 class="min-w-0 text-[clamp(2.3rem,6vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.08em]">
          {{ $t("homepage.photography.title") }}
          <span aria-hidden="true" class="typing-cursor text-[#ef7659]">|</span>
        </h1>
        <div class="max-w-2xl border-t-[3px] border-foreground-bold pt-5">
          <p class="text-lg font-semibold leading-snug sm:text-xl">{{ $t("homepage.photography.description") }}</p>
        </div>
      </div>
    </header>
    <PhotosGallery />
  </div>
</template>
