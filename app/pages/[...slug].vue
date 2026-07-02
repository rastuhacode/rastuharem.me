<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();

const slug = computed(() => {
  const rawSlug = route.params.slug;
  if (rawSlug === undefined) return "/";

  const path = String(rawSlug);
  const normalized = path.replace(/,/g, "/").replace(/\/+$/, "");
  return "/" + normalized;
});

const { data: page, status } = await useAsyncData(
  `page-${locale.value}-${slug.value}`,
  async () => {
    // Build collection name based on current locale
    const collection = ("content_" + locale.value) as keyof Collections;
    const content = await queryCollection(collection).path(slug.value).first();

    // Optional: fallback to default locale if content is missing
    if (!content && locale.value !== "en") {
      return await queryCollection("content_en").path(slug.value).first();
    }

    return content;
  },
);

const isUnreleased = computed(
  () =>
    page.value?.path?.startsWith("/posts/")
    && page.value?.date
    && !isPostReleased(page.value),
);

if ((status.value === "success" && !page.value) || isUnreleased.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  ...page.value?.seo,
  ogTitle: page.value?.title,
  ogDescription: page.value?.description,
});
</script>

<template>
  <div
    v-if="page"
    class="grow"
  >
    <RToc
      v-if="page?.toc && page.body?.toc?.links"
      :links="page.body.toc.links"
      class="hidden lg:flex"
    />
    <ContentRenderer
      :value="page"
      class="w-full min-h-fit h-full mx-auto p-5 slide-enter-content prose dark:prose-invert"
    />
  </div>
</template>
