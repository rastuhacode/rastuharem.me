<script setup lang="ts">
import type {
  ContentEnCollectionItem,
  ContentRuCollectionItem,
} from "@nuxt/content";

type Post = ContentEnCollectionItem | ContentRuCollectionItem;

const { locale } = useI18n();

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
const isFuture = (date: Date | string | number) => new Date(date) > new Date();

// TODO: Replace it with schema typing
const stringMetaDate = (post: Post) => String(post.meta.date);

const selectedTag = ref<TPostTags>();

const posts = computed(() =>
  rawPosts.value
    ?.toSorted(
      (a, b) => +new Date(stringMetaDate(b)) - +new Date(stringMetaDate(a)),
    )
    .filter((post) => !isFuture(stringMetaDate(post)))
    .filter((post) => {
      if (selectedTag.value) {
        return getTags(post).includes(selectedTag.value);
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
    return getYear(stringMetaDate(post)) === year;
  });
}

function getTags(post: Post) {
  // TODO: fix types (guard or schema)
  const tags = (post.meta.tags as TPostTags[]) ?? [];
  return tags;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, {
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <template v-if="posts && posts.length > 0">
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
            class="group px-4 py-3 no-underline rounded-lg transition-colors duration-300 hover:bg-muted flex flex-col gap-1"
          >
            <div class="flex sm:flex-row flex-col items-start gap-0.5">
              <div class="grow min-w-0 max-w-full">
                <div class="flex items-center gap-3 flex-wrap">
                  <span
                    class="text-base font-medium text-foreground overflow-hidden text-ellipsis"
                  >
                    {{ post.title }}
                  </span>

                  <PostsTags
                    v-if="post.meta.tags"
                    :tags="getTags(post)"
                    :max="3"
                    class="text-sm text-primary pointer-events-none"
                    @click.stop.prevent
                    @tag:select="(tag) => (selectedTag = tag)"
                  />
                </div>
              </div>

              <div
                class="flex items-center gap-4 shrink-0 text-sm text-muted-foreground tabular-nums my-auto"
              >
                <time :datetime="stringMetaDate(post)">
                  {{ formatDate(stringMetaDate(post)) }}
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
