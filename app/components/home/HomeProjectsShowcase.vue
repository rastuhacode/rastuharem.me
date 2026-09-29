<script setup lang="ts">
const shape = "rounded-none border-[3px] border-foreground-bold shadow-[8px_8px_0_var(--color-foreground-bold)]";
const firstSurface = "bg-[#141414]";
const secondSurface = "bg-[#f5df67]/88";
const imageSurface = "bg-[#eedb8a]";
const headingStyle = "font-semibold uppercase";
</script>

<template>
  <section aria-labelledby="projects-title">
    <div class="mb-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
          {{ $t("homepage.selectedWork.eyebrow") }}
        </p>
        <h3 id="projects-title" class="mt-3 max-w-3xl text-4xl leading-tight tracking-[-0.055em] text-foreground-bold sm:text-6xl" :class="headingStyle">
          {{ $t("homepage.selectedWork.title") }}
        </h3>
      </div>
      <div class="max-w-xl border-t-[3px] border-foreground-bold pt-5 lg:mb-1">
        <p class="text-lg font-semibold leading-snug text-foreground-bold sm:text-xl">
          {{ $t("homepage.selectedWork.description") }}
        </p>
      </div>
    </div>
    <div class="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
      <a href="https://github.com/rastuhacode/soundgrammy" target="_blank" rel="noopener" class="group relative flex min-h-132 flex-col overflow-hidden text-white no-underline backdrop-blur-[2px] transition-transform duration-500 hover:-translate-y-2" :class="[shape, firstSurface]">
        <div class="relative min-h-64 grow overflow-hidden">
          <NuxtImg src="/images/soundgrammy-interface.png" :alt="$t('homepage.selectedWork.firstAlt')" width="960" height="650" loading="lazy" class="absolute inset-0 size-full object-cover object-top-left transition-transform duration-700 group-hover:scale-[1.07]" />
          <div class="absolute inset-0" />
        </div>
        <div class="relative flex items-end justify-between gap-4 p-7 sm:p-9">
          <div>
            <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
              {{ $t("homepage.selectedWork.firstKicker") }}
            </p>
            <h4 class="mt-2 text-3xl tracking-tighter] sm:text-4xl" :class="headingStyle">
              SoundGrammy
            </h4>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
              {{ $t("homepage.selectedWork.firstDescription") }}
            </p>
          </div>
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-sky-400 text-[#10202d] transition-transform duration-300 group-hover:rotate-45">
            <Icon name="lucide:arrow-up-right" class="size-5" />
          </span>
        </div>
      </a>
      <a href="https://cv-html-dev.netlify.app" target="_blank" rel="noopener" class="group relative flex min-h-132 flex-col overflow-hidden text-[#1e2126] no-underline backdrop-blur-[2px] transition-transform duration-500 hover:-translate-y-2" :class="[shape, secondSurface]">
        <div class="relative min-h-64 grow overflow-hidden" :class="imageSurface">
          <NuxtImg src="/images/cvhtml-original.png" :alt="$t('homepage.selectedWork.secondAlt')" width="960" loading="lazy" class="absolute left-[7%] top-[9%] h-auto w-[86%] max-w-none rotate-[-4deg] shadow-2xl transition-transform duration-700 group-hover:rotate-0 group-hover:scale-[1.06]" />
        </div>
        <div class="relative flex items-end justify-between gap-4 p-7 sm:p-9">
          <div>
            <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1e2126]/60">
              {{ $t("homepage.selectedWork.secondKicker") }}
            </p>
            <h4 class="mt-2 text-3xl tracking-tighter sm:text-4xl" :class="headingStyle">
              CV.html
            </h4>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-[#1e2126]/70">
              {{ $t("homepage.selectedWork.secondDescription") }}
            </p>
          </div>
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-[#1e2126] text-[#eacb48] transition-transform duration-300 group-hover:rotate-45">
            <Icon name="lucide:arrow-up-right" class="size-5" />
          </span>
        </div>
      </a>
    </div>
  </section>
</template>
