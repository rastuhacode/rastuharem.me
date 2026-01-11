<script setup lang="ts">
const { locale } = useI18n();

const collection = computed(() => {
  if (locale.value === "en") {
    return "content_en";
  } else {
    return "content_ru";
  }
});

const { data: posts } = await useAsyncData("posts", () => {
  return queryCollection(collection.value)
    .where("path", "LIKE", "/posts/%")
    .where("path", "<>", "/posts/index")
    .all();
});
</script>

<template>
  <ul class="h-fit">
    <li
      v-for="post in posts"
      :key="post.id"
      class="flex gap-4 items-center h-fit"
    >
      <div class="rounded-full w-2 h-2 bg-gray-300"></div>
      <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      <span>{{ post.description }}</span>
      <span>{{ post.meta.date }}</span>
      <span>{{ post.meta.duration }}</span>
    </li>
  </ul>
</template>
