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

const allPostYears = computed<string[]>(() => {
  return (
    posts.value?.map((post) => String(post.meta.date).split("-")[0]!) ?? []
  );
});

function filterPostsByYear(year: string) {
  return posts.value?.filter((post) => {
    return String(post.meta.date).split("-")[0] === year;
  });
}
</script>

<template>
  <div v-for="year in allPostYears" :key="year">
    <span>{{ year }}</span>
    <ul class="h-fit">
      <li v-for="post in filterPostsByYear(year)" :key="post.id">
        <NuxtLink
          :to="post.path"
          class="no-underline flex gap-4 items-center h-fit"
        >
          <span>{{ post.title }}</span>
          <NuxtTime
            :locale="locale"
            :datetime="String(post.meta.date)"
            month="short"
            day="numeric"
            >{{ post.meta.date }}</NuxtTime
          >
          <span>~ {{ post.meta.duration }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
