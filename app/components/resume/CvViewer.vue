<script setup lang="ts">
const { locale } = useI18n();

const cvContent
  = locale.value === "en" ? "/rasten-remizov.pdf" : "/rasten-remizov-ru.pdf";

const cv = ref<string>();

onMounted(async () => {
  const data = await fetch(cvContent);
  cv.value = await data.text();
});
</script>

<template>
  <div class="mx-auto w-full h-full flex flex-col gap-2">
    <div class="flex justify-end items-center">
      <span>
        {{ $t("built_with") }}
        <CvHtmlBadge class="ml-1" />
      </span>
    </div>
    <div class="relative h-full w-full overflow-hidden">
      <iframe
        :src="cvContent"
        class="absolute top-0 left-0 w-full h-full"
      />
    </div>
  </div>
</template>
