<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale } = useI18n();
const collection = computed(
  () => `content_${locale.value === "ru" ? "ru" : "en"}` as keyof Collections,
);
const postsKey = computed(() => `home-posts-${locale.value}`);

const { data: rawPosts } = await useAsyncData(
  postsKey,
  () => queryCollection(collection.value)
    .where("path", "LIKE", "/posts/%")
    .where("path", "<>", "/posts/index")
    .all(),
  { watch: [locale] },
);

const posts = computed(() =>
  (rawPosts.value ?? [])
    .filter(isPostReleased)
    .toSorted((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3),
);

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value, {
  day: "2-digit",
  month: "short",
  year: "numeric",
}));

function formatDate(date: string) {
  return dateFormatter.value.format(new Date(date));
}

function isNewPost(date: string) {
  const age = Date.now() - new Date(date).getTime();
  return age >= 0 && age < 3 * 24 * 60 * 60 * 1000;
}
</script>

<template>
  <section
    class="home-shell not-prose border-t border-border/80 py-20 sm:py-24"
    aria-labelledby="blog-title"
  >
    <div class="flex justify-between gap-5 lg:gap-16">
      <div class="grow max-w-2xl">
        <h2
          id="blog-title"
          class="text-3xl font-semibold tracking-[-0.035em] text-foreground-bold sm:text-5xl"
        >
          {{ $t("homepage.writing.title") }}
        </h2>
        <p class="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {{ $t("homepage.writing.description") }}
        </p>
      </div>

      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {{ $t("homepage.writing.eyebrow") }}
      </p>
    </div>

    <div class="mt-12 grid gap-3 lg:grid-cols-3">
      <NuxtLinkLocale
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group flex min-h-64 flex-col rounded-2xl bg-foreground/4 p-6 text-foreground no-underline ring-1 ring-inset ring-foreground/7 transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/7 hover:text-foreground-bold sm:p-7"
      >
        <span class="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span
            v-if="isNewPost(post.date)"
            class="border border-foreground/35 px-2 py-0.5 text-[0.625rem] text-foreground-bold"
          >
            {{ $t("homepage.writing.newLabel") }}
          </span>
          <Icon
            name="lucide:arrow-up-right"
            aria-hidden="true"
            class="ml-auto size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>

        <span class="pt-5">
          <span class="block text-xl font-semibold leading-snug tracking-[-0.02em] sm:text-2xl">
            {{ post.title }}
          </span>
          <span
            v-if="post.description"
            class="mt-2 block max-w-2xl leading-relaxed text-muted-foreground"
          >
            {{ post.description }}
          </span>
        </span>

      </NuxtLinkLocale>
    </div>

    <NuxtLinkLocale
      to="/posts"
      class="border-underline mt-8 inline-flex items-center gap-1 py-1 text-sm font-semibold text-foreground"
    >
      {{ $t("homepage.writing.allLabel") }}
      <Icon name="lucide:arrow-up-right" class="size-4" />
    </NuxtLinkLocale>
  </section>
</template>
