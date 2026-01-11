<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();

const { data: page } = await useAsyncData(
  "page-" + route.path,
  async () => {
    // Build collection name based on current locale
    const collection = ("content_" + locale.value) as keyof Collections;
    return await queryCollection(collection).path(route.path).first();
  },
  {
    watch: [locale], // Refetch when locale changes
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
    class="slide-enter-content prose dark:prose-invert m-auto"
  />
</template>
