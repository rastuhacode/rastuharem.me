<script setup lang="ts">
const { data } = await useLazyFetch("/api/activity", {
  server: false,
  key: "home-current-activity",
});

const liveMusic = computed(() => data.value?.music?.live ? data.value.music : null);
const liveGame = computed(() => data.value?.game?.live ? data.value.game : null);
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 pb-1 text-xs" :aria-label="$t('homepage.activity.label')">
    <HomeActivityItem href="https://www.google.com/maps/search/?api=1&amp;query=Yerevan%2C%20Armenia">
      <Icon name="lucide:map-pin" class="size-5 shrink-0 text-[#ef7659]" aria-hidden="true" />
      <span class="min-w-0 leading-tight">
        <span class="block text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">{{ $t("homepage.activity.basedIn") }}</span>
        <span class="block font-semibold">{{ $t("homepage.activity.location") }}</span>
      </span>
    </HomeActivityItem>

    <HomeActivityItem v-if="liveMusic" :href="liveMusic.url || data?.lastFmUrl">
      <span class="grid size-8 shrink-0 place-items-center overflow-hidden bg-[#ef7659]/20 text-[#ef7659]">
        <img v-if="liveMusic.image" :src="liveMusic.image" alt="" class="size-full object-cover">
        <Icon v-else name="simple-icons:lastdotfm" class="size-4" aria-hidden="true" />
      </span>
      <span class="min-w-0 leading-tight">
        <span class="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          <span class="size-1.5 shrink-0 rounded-full bg-emerald-500 motion-safe:animate-pulse" aria-hidden="true" />
          {{ $t("homepage.activity.listening") }}
        </span>
        <span class="block max-w-48 truncate font-semibold sm:max-w-64" :title="`${liveMusic.title} · ${liveMusic.artist}`">
          {{ liveMusic.artist }} - {{ liveMusic.title }}
        </span>
      </span>
    </HomeActivityItem>

    <HomeActivityItem v-if="liveGame" :href="liveGame.url || data?.steamUrl">
      <Icon name="simple-icons:steam" class="size-6 shrink-0 text-[#72afc8]" aria-hidden="true" />
      <span class="min-w-0 leading-tight">
        <span class="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          <span class="size-1.5 shrink-0 rounded-full bg-emerald-500 motion-safe:animate-pulse" aria-hidden="true" />
          {{ $t("homepage.activity.playing") }}
        </span>
        <span class="block max-w-48 truncate font-semibold sm:max-w-64" :title="liveGame.title">{{ liveGame.title }}</span>
      </span>
    </HomeActivityItem>
  </div>
</template>
