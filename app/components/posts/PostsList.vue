<script setup lang="ts">
import type { PostTags } from "#shared/types/posts";
import { isPostTag } from "#shared/types/posts/tags";

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const collection = computed(() => locale.value === "en" ? "content_en" : "content_ru");
const postsKey = computed(() => `posts-${locale.value}`);

const { data: rawPosts } = await useAsyncData(postsKey, () =>
  queryCollection(collection.value)
    .where("path", "LIKE", "/posts/%")
    .where("path", "<>", "/posts/index")
    .all(),
);

const selectedTags = computed<PostTags[]>({
  get() {
    const tags = route.query.tags;
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.filter((tag): tag is PostTags => typeof tag === "string" && isPostTag(tag));
    }
    return tags.split(",").filter((tag): tag is PostTags => isPostTag(tag));
  },
  set(value) {
    router.push({ query: { ...route.query, tags: value.length ? value.join(",") : undefined } });
  },
});

const allPosts = computed(() =>
  rawPosts.value?.filter(isPostReleased)
    .toSorted((a, b) => +new Date(b.date) - +new Date(a.date)) ?? [],
);
const availableTags = computed<PostTags[]>(() =>
  [...new Set(allPosts.value.flatMap(post => post.tags ?? []))].filter(isPostTag),
);
const posts = computed(() =>
  allPosts.value.filter(post => selectedTags.value.every(tag => post.tags?.includes(tag))),
);
const years = computed(() =>
  [...new Set(posts.value.map(post => new Date(post.date).getUTCFullYear()))].sort((a, b) => b - a),
);

function postsForYear(year: number) {
  return posts.value.filter(post => new Date(post.date).getUTCFullYear() === year);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}

function selectTag(tag: PostTags) {
  if (!selectedTags.value.includes(tag)) selectedTags.value = [...selectedTags.value, tag];
}

function removeTag(tag: PostTags) {
  selectedTags.value = selectedTags.value.filter(selected => selected !== tag);
}
</script>

<template>
  <div class="site-container not-prose mx-auto pb-12 pt-8 text-foreground-bold sm:pt-14">
    <header class="border-b-[5px] border-foreground-bold pb-9 sm:pb-12">
      <p class="inline-block -rotate-2 bg-[#72afc8] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#171717]">
        {{ $t("posts.eyebrow") }}
      </p>
      <div class="mt-7 grid gap-7 lg:grid-cols-[1fr_0.6fr] lg:items-center">
        <h1 class="min-w-0 text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.09em]">
          {{ $t("blog") }}<span aria-hidden="true" class="typing-cursor text-[#72afc8]">|</span>
        </h1>
        <p class="max-w-xl border-l-[5px] border-foreground-bold pl-5 text-lg font-semibold leading-snug sm:text-xl">
          {{ $t("posts.description") }}
        </p>
      </div>
      <div class="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em]">
        <span>{{ String(allPosts.length).padStart(2, "0") }} / {{ $t("posts.entries") }}</span>
      </div>
    </header>

    <section v-if="availableTags.length" class="mt-10 border-[3px] border-foreground-bold shadow-[6px_6px_0_var(--color-foreground-bold)]" :aria-label="$t('posts.filters')">
      <div class="flex flex-wrap items-center justify-between gap-3 bg-background px-4 py-3 sm:px-5">
        <p class="m-0 font-mono text-xs font-black uppercase tracking-[0.18em]">
          {{ $t("posts.filters") }} <span class="ml-2 text-muted-foreground">/ {{ String(selectedTags.length).padStart(2, "0") }}</span>
        </p>
        <button v-if="selectedTags.length" type="button" class="border-b-2 border-foreground-bold font-mono text-[0.7rem] font-black uppercase tracking-wider hover:text-[#72afc8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-bold" @click="selectedTags = []">
          {{ $t("posts.clearFilters") }}
        </button>
      </div>
      <PostsTags :tags="availableTags" @tag:select="selectTag" />
      <div v-if="selectedTags.length" class="flex flex-wrap gap-2 border-t-[3px] border-foreground-bold bg-background p-3 sm:px-5">
        <button v-for="tag in selectedTags" :key="tag" type="button" :aria-label="$t('posts.removeFilter', { tag })" class="inline-flex items-center gap-2 border-2 border-foreground-bold bg-[#72afc8] px-2.5 py-1 font-mono text-xs font-black text-[#171717] shadow-[3px_3px_0_var(--color-foreground-bold)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground-bold" @click="removeTag(tag)">
          #{{ tag }} <Icon name="lucide:x" class="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>

    <div v-if="posts.length" class="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
      <section v-for="year in years" :key="year" :aria-label="`${$t('posts.year')} ${year}`">
        <div class="mb-6 flex items-end gap-4 border-b-[3px] border-foreground-bold pb-3 sm:mb-8">
          <h2 class="m-0 bg-foreground-bold px-3 py-1 font-mono text-3xl font-black leading-none text-background sm:text-4xl">{{ year }}</h2>
          <span class="pb-1 font-mono text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{{ String(postsForYear(year).length).padStart(2, "0") }} {{ $t("posts.entries") }}</span>
        </div>
        <ol class="m-0 grid grid-cols-1 list-none gap-7 p-0">
          <li v-for="(post, index) in postsForYear(year)" :key="post.id" class="min-w-0 border-[3px] border-foreground-bold bg-background/85 shadow-[6px_6px_0_var(--color-foreground-bold)] backdrop-blur-[2px] sm:shadow-[8px_8px_0_var(--color-foreground-bold)]">
            <div class="grid min-w-0 grid-cols-1 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
              <span class="hidden border-r-[3px] border-foreground-bold px-4 pt-6 font-mono text-3xl font-black leading-none text-[#72afc8] sm:block" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
              <NuxtLinkLocale :to="post.path" class="group block min-w-0 p-5 text-foreground-bold no-underline transition-colors hover:bg-[#72afc8]/20 focus-visible:bg-[#72afc8]/20 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-foreground-bold sm:p-7">
                <span class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] font-black uppercase tracking-[0.12em] text-muted-foreground">
                  <span class="sm:hidden">{{ String(index + 1).padStart(2, "0") }} <span aria-hidden="true">/</span></span>
                  <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                  <span aria-hidden="true">/</span>
                  <span>{{ post.duration }}</span>
                </span>
                <div class="mt-4 flex items-start justify-between gap-4">
                  <h3 class="m-0 max-w-4xl text-[clamp(1.8rem,3.6vw,3.6rem)] font-black leading-[0.98] tracking-[-0.055em]">{{ post.title }}</h3>
                  <span class="grid size-9 shrink-0 place-items-center border-2 border-foreground-bold bg-[#72afc8] text-[#171717] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-11" aria-hidden="true">
                    <Icon name="lucide:arrow-up-right" class="size-5" />
                  </span>
                </div>
                <p v-if="post.description" class="mb-0 mt-4 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">{{ post.description }}</p>
              </NuxtLinkLocale>
            </div>
            <div v-if="post.tags?.length" class="flex items-stretch border-t-[3px] border-foreground-bold">
              <span class="hidden shrink-0 items-center border-r-[3px] border-foreground-bold px-4 font-mono text-[0.65rem] font-black uppercase tracking-[0.16em] sm:flex">{{ $t("posts.tags") }}</span>
              <PostsTags :tags="post.tags" class="min-w-0 flex-1" @tag:select="selectTag" />
            </div>
          </li>
        </ol>
      </section>
    </div>

    <div v-else class="mt-16 border-[3px] border-foreground-bold bg-background p-8 text-center shadow-[6px_6px_0_var(--color-foreground-bold)] sm:p-12">
      <span class="text-5xl text-[#72afc8]" aria-hidden="true">✳</span>
      <p class="mt-4 text-2xl font-black uppercase tracking-tight">{{ $t("no_posts_found") }}</p>
      <button v-if="selectedTags.length" type="button" class="mt-5 border-[3px] border-foreground-bold bg-[#72afc8] px-5 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#171717] shadow-[4px_4px_0_var(--color-foreground-bold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold" @click="selectedTags = []">
        {{ $t("posts.clearFilters") }}
      </button>
    </div>
  </div>
</template>
