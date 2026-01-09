<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
  return queryCollection("content").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <main class="bg-black size-screen">
    <MainGradient />
    <ContentRenderer v-if="page" :value="page" class="text-white" />
  </main>
</template>
