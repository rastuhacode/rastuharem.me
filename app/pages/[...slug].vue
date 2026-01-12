<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();
const isGraphicsEnabled = useGraphicsStore();

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
  <div>
    <LiquidContainer
      v-show="isGraphicsEnabled"
      class="min-w-fit w-1/2 p-5 m-auto rounded-xl"
    >
      <ContentRenderer
        v-if="page"
        :value="page"
        class="slide-enter-content prose dark:prose-invert w-full m-auto rounded-xl"
      />
    </LiquidContainer>

    <div v-if="!isGraphicsEnabled" class="min-w-fit w-1/2 p-5 m-auto">
      <ContentRenderer
        v-if="page"
        :value="page"
        class="slide-enter-content prose dark:prose-invert w-full m-auto"
      />
    </div>
  </div>
</template>
