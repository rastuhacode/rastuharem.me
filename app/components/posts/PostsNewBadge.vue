<script setup lang="ts">
const props = defineProps<{ date: string }>();
const now = useNow({ scheduler: update => useIntervalFn(update, 60_000) });
const isNew = computed(() => isPostNew(props, now.value.getTime()));
</script>

<template>
  <ClientOnly>
    <span
      v-if="isNew"
      class="inline-flex shrink-0 self-stretch items-center border-2 border-[#171717] bg-white px-4 py-1 font-mono text-xs font-black uppercase leading-none tracking-[0.14em] text-[#171717]"
    >
      {{ $t("posts.new") }}
    </span>
  </ClientOnly>
</template>
