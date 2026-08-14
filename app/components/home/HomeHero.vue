<script setup lang="ts">
const { locale, t } = useI18n();

const headlineWords = computed(() => [
  t("homepage.hero.headlineWords[0]"),
  t("homepage.hero.headlineWords[1]"),
  t("homepage.hero.headlineWords[2]"),
]);

const resumeHref = computed(() => locale.value === "ru"
  ? "/rasten-remizov-ru.pdf"
  : "/rasten-remizov.pdf")

const soundcloudHref = "https://soundcloud.com/rastuharem";
</script>

<template>
  <section
    class="home-shell not-prose py-14 sm:py-20"
    aria-labelledby="home-title"
  >
    <div class="max-w-5xl">
      <p class="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
        <span class="size-2 rounded-full bg-emerald-500 shadow-[0_0_18px_color-mix(in_oklab,var(--color-emerald-500)_65%,transparent)]" />
        {{ t("homepage.hero.eyebrow") }}
        <span class="text-border">/</span>

        <span class="flex items-center gap-2">
          <Icon name="lucide:map-pin" />
          {{ t("homepage.hero.location") }}
        </span>
      </p>

      <h1
        id="home-title"
        class="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-foreground-bold sm:text-7xl lg:text-[6.5rem]"
      >
        {{ t("homepage.hero.name") }}
      </h1>

      <p class="mt-7 lg:flex-row flex-col gap-2 flex w-fit text-2xl font-medium leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {{ t("homepage.hero.headlinePrefix") }}
        <RFlipWords
          :words="headlineWords"
          class="text-foreground-bold"
        />
      </p>

      <p class="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        <span>{{ t("homepage.hero.description") }}</span>
        <span class="mt-3 block">
          {{ t("homepage.hero.personalDescriptionPrefix") }}
          <a
            :href="soundcloudHref"
            target="_blank"
            rel="noopener"
            class="text-foreground underline decoration-foreground/70 underline-offset-4 transition-colors hover:decoration-foreground"
          >{{ t("homepage.hero.musicLabel") }}</a>{{ t("homepage.hero.personalDescriptionSuffix") }}
        </span>
      </p>

      <div class="mt-9 flex flex-wrap items-center gap-3">
        <RInteractiveHoverButton
          href="#contact"
          :label="t('homepage.hero.contactLabel')"
          icon="lucide:arrow-down-right"
        />
        <RInteractiveHoverButton
          :href="resumeHref"
          :label="t('homepage.hero.resumeLabel')"
          variant="outline"
          target="_blank"
          rel="noopener"
        />
      </div>
    </div>
  </section>
</template>
