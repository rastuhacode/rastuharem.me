<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();

const slug = computed(() => {
  const path = String(route.params.slug);
  return "/" + path.replace(/,/g, "/");
});

const { data: page } = await useAsyncData(
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
  }
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    class="slide-enter-content prose dark:prose-invert w-full m-auto"
  />
</template>
