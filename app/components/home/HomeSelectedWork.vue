<script setup lang="ts">
import { CardBody, CardContainer, CardItem } from "~/components/ui/card-3d";

interface Project {
  alt: string;
  description: string;
  href: string;
  image: string;
  kicker: string;
  name: string;
  tags: string[];
}

const { t } = useI18n();

const projects = computed<Project[]>(() => [
  {
    alt: t("homepage.selectedWork.firstAlt"),
    description: t("homepage.selectedWork.firstDescription"),
    href: "https://github.com/rastuhacode/soundgrammy",
    image: "/images/soundgrammy-interface.png",
    kicker: t("homepage.selectedWork.firstKicker"),
    name: "SoundGrammy",
    tags: [
      t("homepage.selectedWork.firstTags[0]"),
      t("homepage.selectedWork.firstTags[1]"),
      t("homepage.selectedWork.firstTags[2]"),
    ],
  },
  {
    alt: t("homepage.selectedWork.secondAlt"),
    description: t("homepage.selectedWork.secondDescription"),
    href: "https://cv-html-dev.netlify.app",
    image: "/images/cvhtml-original.png",
    kicker: t("homepage.selectedWork.secondKicker"),
    name: "CV.html",
    tags: [
      t("homepage.selectedWork.secondTags[0]"),
      t("homepage.selectedWork.secondTags[1]"),
      t("homepage.selectedWork.secondTags[2]"),
    ],
  },
]);
</script>

<template>
  <section
    id="work"
    class="home-shell not-prose scroll-mt-24 border-t border-border/80 py-20 sm:py-24"
    aria-labelledby="work-title"
  >
    <div class="flex justify-between gap-5 lg:gap-16">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {{ $t("homepage.selectedWork.eyebrow") }}
      </p>

      <div class="grow max-w-2xl">
        <h2
          id="work-title"
          class="text-3xl font-semibold tracking-[-0.035em] text-foreground-bold sm:text-5xl"
        >
          {{ $t("homepage.selectedWork.title") }}
        </h2>
        <p class="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {{ $t("homepage.selectedWork.description") }}
        </p>
      </div>
    </div>

    <div class="mt-12 grid gap-5 lg:grid-cols-2">
      <CardContainer
        v-for="project in projects"
        :key="project.name"
        container-class="h-full"
        class="h-full w-full"
      >
        <a
          :href="project.href"
          target="_blank"
          rel="noopener"
          :aria-label="project.name"
          class="group block h-full text-foreground no-underline"
        >
          <CardBody class="h-full w-full overflow-hidden rounded-3xl border border-border/80 bg-background/75 shadow-[0_24px_80px_-48px_color-mix(in_oklab,var(--foreground)_45%,transparent)] backdrop-blur-md transition-colors duration-300 group-hover:border-foreground/40">
            <CardItem :translate-z="38" class="relative aspect-16/10 w-full overflow-hidden border-b border-border/80 bg-muted">
              <NuxtImg
                :src="project.image"
                :alt="project.alt"
                width="960"
                loading="lazy"
                class="size-full object-cover object-top"
              />
              <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
            </CardItem>

            <div class="p-6 sm:p-8" style="transform-style: preserve-3d">
              <CardItem :translate-z="26" class="w-full text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {{ project.kicker }}
              </CardItem>
              <CardItem :translate-z="52" as="h3" class="mt-3 flex w-full items-center justify-between gap-4 text-2xl font-semibold tracking-tight text-foreground-bold sm:text-3xl">
                <span>{{ project.name }}</span>
                <Icon name="lucide:arrow-up-right" class="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </CardItem>
              <CardItem :translate-z="30" class="mt-4 w-full leading-relaxed text-muted-foreground">
                {{ project.description }}
              </CardItem>

              <CardItem :translate-z="20" class="mt-6 flex w-full flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {{ tag }}
                </span>
              </CardItem>
            </div>
          </CardBody>
        </a>
      </CardContainer>
    </div>
  </section>
</template>
