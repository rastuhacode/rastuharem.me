<script setup lang="ts">
type Focus = "engineering" | "photography" | "other";
const props = defineProps<{ focus: Focus }>();
const { locale } = useI18n();
const resumeHref = computed(() => locale.value === "ru" ? "/rasten-remizov-ru.pdf" : "/rasten-remizov.pdf");

const views = {
  engineering: {
    kicker: "homepage.views.engineeringKicker",
    title: "homepage.views.engineering",
    description: "homepage.views.engineeringIntro",
    accent: "bg-[#f5e536]",
    shadow: "#f5e536",
  },
  photography: {
    kicker: "homepage.photography.kicker",
    title: "homepage.photography.title",
    description: "homepage.photography.intro",
    accent: "bg-[#ef7659]",
    shadow: "#ef7659",
  },
  other: {
    kicker: "homepage.other.kicker",
    title: "homepage.other.title",
    description: "homepage.other.intro",
    accent: "bg-[#72afc8]",
    shadow: "#72afc8",
  },
} as const;

const view = computed(() => views[props.focus]);
</script>

<template>
  <section class="relative border-b-[3px] border-foreground-bold pb-10 text-foreground-bold sm:pb-14" :aria-labelledby="`${focus}-view-title`">
    <span class="absolute -left-0 top-0 h-full w-1.5" :class="view.accent" aria-hidden="true" />
    <div class="pl-5 sm:pl-9">
      <p class="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">
        {{ $t(view.kicker) }}
      </p>
      <div class="mt-7 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <RLineShadowText :id="`${focus}-view-title`" :key="`${locale}-${focus}`" as="h2" :shadow-color="view.shadow" class="block min-w-0 font-black uppercase leading-[0.86] tracking-[-0.08em]" :class="focus === 'photography' ? 'text-[clamp(2.2rem,5.5vw,6.5rem)]' : 'text-[clamp(2.2rem,7.8vw,8rem)]'">
          {{ $t(view.title) }}
        </RLineShadowText>
        <div class="max-w-xl border-t-[3px] border-foreground-bold pt-5">
          <p class="text-lg font-semibold leading-snug sm:text-xl">
            {{ $t(view.description) }}
          </p>
          <a v-if="focus === 'engineering'" :href="resumeHref" target="_blank" rel="noopener" class="mt-7 inline-flex items-center gap-3 border-[3px] border-foreground-bold bg-[#f5e536] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#171717] no-underline shadow-[6px_6px_0_var(--color-foreground-bold)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold">
            {{ $t("homepage.hero.resumeLabel") }}
            <Icon name="lucide:arrow-up-right" class="size-5" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
