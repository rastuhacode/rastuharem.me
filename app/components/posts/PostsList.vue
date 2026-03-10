<script setup lang="ts">
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const collection = computed(() => {
  return locale.value === "en" ? "content_en" : "content_ru";
});

const { data: rawPosts } = await useAsyncData(`posts-${locale.value}`, () => {
  return queryCollection(collection.value)
    .where("path", "LIKE", "/posts/%")
    .where("path", "<>", "/posts/index")
    .all();
});

const getYear = (date: string) => new Date(date).getFullYear();

const selectedTags = computed<TPostTags[]>({
  get() {
    const tags = route.query.tags;
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.filter(
        (tag): tag is TPostTags => typeof tag === "string" && isPostTag(tag),
      );
    }
    return tags.split(",").filter((tag): tag is TPostTags => isPostTag(tag));
  },
  set(value) {
    router.push({
      query: { tags: value.length > 0 ? value.join(",") : undefined },
    });
  },
});

const posts = computed(() =>
  rawPosts.value
    ?.toSorted((a, b) => +new Date(getPostDate(b)) - +new Date(getPostDate(a)))
    .filter(isPostReleased)
    .filter((post) => {
      if (selectedTags.value.length > 0) {
        return selectedTags.value.every((tag) => getTags(post).includes(tag));
      }
      return true;
    }),
);

const allPostYears = computed<number[]>(() => {
  const years = new Set<number>();
  posts.value?.forEach((post) => {
    years.add(getYear(String(post.meta.date)));
  });
  return Array.from(years).sort((a, b) => b - a);
});

function filterPostsByYear(year: number) {
  return posts.value?.filter((post) => {
    return getYear(getPostDate(post)) === year;
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, {
    month: "short",
    day: "numeric",
  });
}

function handleTagSelect(tag: TPostTags) {
  if (selectedTags.value.includes(tag)) return;
  selectedTags.value = [...selectedTags.value, tag];
}
</script>

<template>
  <template v-if="posts && posts.length > 0">
    <div
      class="flex gap-2 h-12 mb-2 items-center max-w-full overflow-x-auto overflow-y-hidden not-hover:scrollbar-hide transition-all duration-300"
    >
      <template v-if="selectedTags.length > 0">
        <div
          v-for="tag in selectedTags"
          :key="tag"
          class="group flex items-center h-fit gap-0.5"
        >
          <span>#{{ tag }}</span>
          <button
            class="flex items-center size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            @click="selectedTags = selectedTags.filter((t) => t !== tag)"
          >
            <Icon name="mdi:close" class="size-4" />
          </button>
        </div>
      </template>
    </div>

    <section v-for="year in allPostYears" :key="year">
      <div class="relative flex items-center">
        <span
          class="text-3xl font-bold font-mono tracking-tight text-foreground/50 select-none"
        >
          {{ year }}
        </span>
        <div class="grow ml-4 h-px bg-foreground/50" />
      </div>

      <ul class="flex flex-col gap-1">
        <li
          v-for="post in filterPostsByYear(year)"
          :key="post.id"
          class="list-none"
        >
          <NuxtLinkLocale
            :to="post.path"
            class="group px-4 py-3 no-underline rounded-lg transition-colors duration-300 dark:hover:bg-muted hover:bg-background flex flex-col gap-1"
          >
            <div class="flex sm:flex-row flex-col items-start gap-0.5">
              <div class="grow min-w-0 max-w-full">
                <div class="flex items-center gap-3 flex-wrap">
                  <span
                    class="text-base font-medium text-foreground overflow-hidden text-ellipsis"
                  >
                    {{ post.title }}
                  </span>
                </div>
              </div>

              <div
                class="flex items-center gap-4 shrink-0 text-sm text-muted-foreground tabular-nums my-auto"
              >
                <time :datetime="getPostDate(post)">
                  {{ formatDate(getPostDate(post)) }}
                </time>
                <span class="opacity-30">&middot;</span>
                <span class="whitespace-nowrap"
                  >~ {{ post.meta.duration }}</span
                >
              </div>
            </div>

            <p
              v-if="post.description"
              class="mt-1 mb-1 text-sm text-muted-foreground line-clamp-1"
            >
              {{ post.description }}
            </p>

            <PostsTags
              v-if="post.meta.tags"
              :tags="getTags(post)"
              :max="3"
              class="text-sm text-primary"
              @click.stop.prevent
              @tag:select="handleTagSelect"
            />
          </NuxtLinkLocale>
        </li>
      </ul>
    </section>
  </template>

  <template v-else>
    <div class="flex items-center justify-center h-full">
      <span class="text-2xl text-muted-foreground"> No posts found :( </span>
    </div>
  </template>
</template>
