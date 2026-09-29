<script setup lang="ts">
type Focus = "engineering" | "photography" | "other";
const props = defineProps<{ focus: Focus }>();
const emit = defineEmits<{ "update:focus": [value: Focus] }>();
const { t } = useI18n();

const views = computed(() => [
  { id: "engineering" as const, number: "01", icon: "lucide:blocks", title: t("homepage.views.engineering"), detail: t("homepage.views.engineeringDescription"), kicker: t("homepage.views.engineeringKicker") },
  { id: "photography" as const, number: "02", icon: "lucide:aperture", title: t("homepage.photography.title"), detail: t("homepage.photography.viewDescription"), kicker: t("homepage.photography.kicker") },
  { id: "other" as const, number: "03", icon: "lucide:audio-lines", title: t("homepage.other.title"), detail: t("homepage.other.viewDescription"), kicker: t("homepage.other.kicker") },
]);
</script>

<template>
  <section id="choose-path" class="site-container mx-auto mt-12 scroll-mt-6 sm:mt-16" :aria-label="$t('homepage.views.choose')">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-3">
      <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground-bold sm:text-3xl">
          {{ $t("homepage.views.choose") }}
      </h2>
      <span class="text-xs font-bold tracking-[0.2em] text-muted-foreground">01 — 03</span>
    </div>

    <!-- Brutalism: outlined posters, with color used only as a printed mark. -->
    <div class="flex gap-4 items-center flex-wrap">
      <button v-for="(view, index) in views" :key="view.id" :aria-pressed="props.focus === view.id" class="group relative flex min-h-60 flex-col grow shrink-0 justify-between border-2 bg-background/30 p-6 text-left text-foreground-bold backdrop-blur-[2px] transition-all duration-300 hover:border-foreground hover:bg-background/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground md:min-h-72" :class="focus === view.id ? 'border-foreground-bold shadow-[7px_7px_0_var(--color-foreground-bold)]' : 'border-foreground/50'" @click="emit('update:focus', view.id)">
        <span class="absolute -left-0.5 top-7 h-11 w-1.5" :class="index === 0 ? 'bg-[#ead51a]' : index === 1 ? 'bg-[#e66b55]' : 'bg-[#72afc8]'" aria-hidden="true" />
        <span class="flex items-start justify-between"><span class="text-5xl font-black leading-none -tracking-widest">{{ view.number }}</span><Icon :name="view.icon" class="size-8 stroke-[2.5] transition-transform group-hover:rotate-12" /></span>
        <span>
          <span class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {{ view.kicker }}
          </span>
          <span class="block text-[clamp(1.9rem,3.3vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.08em]">
            {{ view.title }}
          </span>
          <span class="mt-5 block max-w-xs text-sm font-semibold leading-snug text-foreground">
            {{ view.detail }}
          </span>
        </span>
        <span v-if="props.focus === view.id" class="absolute -right-2 -top-3 rotate-6 border border-foreground-bold bg-background px-2 py-1 text-[0.65rem] font-black uppercase">{{ $t("homepage.views.selected") }}</span>
      </button>
    </div>
  </section>
</template>
