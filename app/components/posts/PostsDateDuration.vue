<script setup lang="ts">
export type PostsTimeDurationProps = {
  date: string;
  duration: string;
};

const props = defineProps<PostsTimeDurationProps>();

const { locale } = useI18n();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, {
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div
    class="flex items-center gap-2 shrink-0 text-sm text-muted-foreground tabular-nums my-auto"
  >
    <time :datetime="props.date">
      {{ formatDate(props.date) }}
    </time>
    <span class="opacity-30">&middot;</span>
    <span class="whitespace-nowrap">~ {{ props.duration }}</span>
  </div>
</template>
