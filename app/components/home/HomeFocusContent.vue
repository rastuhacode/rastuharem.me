<script setup lang="ts">
import HomeViewHeader from "./HomeViewHeader.vue";

type Focus = "engineering" | "photography" | "other";
defineProps<{ focus: Focus }>();
const shape = "rounded-none border-[3px] border-[#e5e7eb] shadow-[8px_8px_0_#e5e7eb]";
const musicSurface = "bg-[linear-gradient(155deg,#593f75dd,#392b5ddd_58%,#172b43dd)]";
const writingSurface = "bg-[linear-gradient(155deg,#e6cfaee6,#d0b7a3e6_58%,#a9a4a7e6)]";
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
      <PhotosGallery preview />
    </section>

    <section v-if="focus === 'other'" class="grid gap-5 lg:grid-cols-2" :aria-label="$t('homepage.other.title')">
      <div class="group relative flex min-h-[30rem] flex-col justify-between overflow-hidden p-8 text-white backdrop-blur-[2px] transition-transform duration-500 hover:-translate-y-2 sm:p-10" :class="[shape, musicSurface]">
        <span class="absolute inset-x-0 top-1/3 flex justify-between gap-1 opacity-20"><span v-for="n in 24" :key="n" class="w-1 rounded-full bg-white" :style="{ height: (16 + (n * 17) % 75) + 'px' }" /></span>
        <span class="relative flex items-start justify-between"><Icon name="lucide:audio-lines" class="size-10" /><Icon name="lucide:arrow-up-right" class="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
        <span class="relative"><span class="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-violet-200">{{ $t("homepage.other.kicker") }}</span><span class="mt-2 block text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{{ $t("homepage.other.music") }}</span><span class="mt-5 block max-w-md text-base leading-relaxed text-white/70">{{ $t("homepage.other.musicDescription") }}</span><span class="mt-8 flex flex-wrap gap-3"><a href="https://soundcloud.com/rastuharem" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/25">{{ $t("homepage.other.listenAction") }}<Icon name="lucide:arrow-up-right" class="size-4" /></a><a href="https://www.last.fm/user/rastuhacode" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/25">Last.fm<Icon name="lucide:arrow-up-right" class="size-4" /></a></span></span>
      </div>
      <NuxtLinkLocale to="/posts" class="group relative flex min-h-[30rem] flex-col justify-between overflow-hidden p-8 text-[#202736] no-underline backdrop-blur-[2px] transition-transform duration-500 hover:-translate-y-2 sm:p-10" :class="[shape, writingSurface]">
        <span class="absolute -right-12 top-20 size-80 rotate-12 rounded-[2rem] border border-[#202736]/15" /><span class="absolute -right-2 top-8 size-80 rotate-12 rounded-[2rem] border border-[#202736]/15" />
        <span class="relative flex items-start justify-between"><Icon name="lucide:notebook-pen" class="size-10" /><Icon name="lucide:arrow-up-right" class="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
        <span class="relative"><span class="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#202736]/60">{{ $t("homepage.other.kicker") }}</span><span class="mt-2 block text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{{ $t("homepage.writing.title") }}</span><span class="mt-5 block max-w-md text-base leading-relaxed text-[#202736]/70">{{ $t("homepage.writing.description") }}</span><span class="mt-8 inline-flex items-center gap-2 rounded-full bg-[#202736]/10 px-4 py-2 text-sm font-semibold">{{ $t("homepage.writing.allLabel") }}<Icon name="lucide:arrow-up-right" class="size-4" /></span></span>
      </NuxtLinkLocale>
    </section>
  </div>
</template>
