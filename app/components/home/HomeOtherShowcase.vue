<script setup lang="ts">
const { locale } = useI18n();
const collection = computed(() => locale.value === "en" ? "content_en" : "content_ru");
const postsKey = computed(() => `home-recent-posts-${locale.value}`);

const { data: rawPosts } = await useAsyncData(postsKey, () =>
  queryCollection(collection.value)
    .where("path", "LIKE", "/posts/%")
    .where("path", "<>", "/posts/index")
    .all(),
);

const recentPosts = computed(() =>
  rawPosts.value?.filter(isPostReleased)
    .toSorted((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3) ?? [],
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}
</script>

<template>
  <div class="space-y-20 sm:space-y-28">
    <section class="text-foreground-bold" aria-labelledby="recent-posts-heading">
      <div class="mb-9 flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
        <div>
          <p class="font-mono text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">01 / {{ $t("homepage.writing.title") }}</p>
          <h3 id="recent-posts-heading" class="mt-4 text-[clamp(2.8rem,6vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.07em]">
            {{ $t("homepage.writing.recentTitle") }}
          </h3>
          <p class="mt-4 max-w-xl text-base font-semibold leading-snug">{{ $t("homepage.writing.description") }}</p>
        </div>
        <NuxtLinkLocale to="/posts" class="group inline-flex min-h-12 shrink-0 items-center gap-3 border-b-[3px] border-foreground-bold font-mono text-xs font-black uppercase tracking-[0.12em] text-foreground-bold no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold">
          {{ $t("homepage.writing.allLabel") }}
          <Icon name="lucide:arrow-right" class="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </NuxtLinkLocale>
      </div>

      <ol v-if="recentPosts.length" class="m-0 grid list-none gap-5 p-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:grid-rows-2">
        <li v-for="(post, index) in recentPosts" :key="post.id" class="min-w-0" :class="index === 0 ? 'lg:row-span-2' : ''">
          <NuxtLinkLocale :to="post.path" class="group flex h-full flex-col justify-between border-[3px] border-foreground-bold p-6 no-underline shadow-[6px_6px_0_var(--color-foreground-bold)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold sm:p-8" :class="index === 0 ? 'min-h-96 bg-[#f5e536] text-[#171717]' : 'min-h-48 bg-background/85 text-foreground-bold'">
            <span class="flex items-start justify-between gap-4">
              <span class="font-mono text-3xl font-black leading-none" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
              <span class="grid size-10 shrink-0 place-items-center border-[3px] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" :class="index === 0 ? 'border-[#171717] bg-[#171717] text-white' : 'border-foreground-bold bg-foreground-bold text-background'" aria-hidden="true">
                <Icon name="lucide:arrow-up-right" class="size-5" />
              </span>
            </span>
            <div class="mt-8">
              <span class="flex flex-wrap gap-x-2 font-mono text-[0.7rem] font-black uppercase tracking-[0.12em]">
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                <span aria-hidden="true">/</span>
                <span>{{ post.duration }}</span>
              </span>
              <h4 class="m-0 mt-3 font-black leading-[0.98] tracking-[-0.055em]" :class="index === 0 ? 'text-[clamp(2.3rem,4.2vw,4.7rem)]' : 'text-[clamp(1.6rem,2.5vw,2.5rem)]'">{{ post.title }}</h4>
              <p v-if="index === 0 && post.description" class="mb-0 mt-5 max-w-xl border-t-[3px] border-[#171717] pt-4 text-sm font-semibold leading-relaxed sm:text-base">{{ post.description }}</p>
            </div>
          </NuxtLinkLocale>
        </li>
      </ol>
      <p v-else class="border-t-[3px] border-foreground-bold py-8 font-semibold">{{ $t("no_posts_found") }}</p>
    </section>

    <section class="grid gap-8 border-t-[5px] border-foreground-bold pt-10 sm:pt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12" aria-labelledby="music-heading">
      <div class="flex flex-col justify-between">
        <div>
          <span class="inline-block -rotate-2 bg-[#ef7659] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-[0.16em] text-[#171717]">02 / {{ $t("homepage.other.music") }}</span>
          <h3 id="music-heading" class="mt-7 max-w-xl text-[clamp(3rem,6.5vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.075em] text-foreground-bold">
            {{ $t("homepage.other.music") }}
          </h3>
          <p class="mt-6 max-w-md border-l-[5px] border-foreground-bold pl-5 text-lg font-semibold leading-snug text-foreground-bold">
            {{ $t("homepage.other.musicDescription") }}
          </p>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <a href="https://soundcloud.com/rastuharem" target="_blank" rel="noopener noreferrer" class="group flex min-h-72 flex-col justify-between border-[3px] border-foreground-bold bg-[#ef7659] p-6 text-[#171717] no-underline shadow-[7px_7px_0_var(--color-foreground-bold)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold sm:p-8">
          <span class="flex items-start justify-between gap-3">
            <span class="font-mono text-xs font-black uppercase tracking-[0.18em]">01 / {{ $t("homepage.other.make") }}</span>
            <Icon name="lucide:audio-lines" class="size-7 shrink-0" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-[clamp(2rem,3vw,3.4rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">{{ $t("homepage.other.make") }}</span>
            <span class="mt-4 block max-w-xs text-sm font-semibold leading-snug">{{ $t("homepage.other.makeDescription") }}</span>
            <span class="mt-8 flex items-center justify-between border-t-[3px] border-[#171717] pt-3 font-mono text-xs font-black uppercase tracking-[0.12em]">
              SoundCloud <Icon name="lucide:arrow-up-right" class="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </a>

        <a href="https://www.last.fm/user/rastuhacode" target="_blank" rel="noopener noreferrer" class="group flex min-h-72 flex-col justify-between border-[3px] border-foreground-bold bg-[#72afc8] p-6 text-[#171717] no-underline shadow-[7px_7px_0_var(--color-foreground-bold)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold sm:p-8">
          <span class="flex items-start justify-between gap-3">
            <span class="font-mono text-xs font-black uppercase tracking-[0.18em]">02 / {{ $t("homepage.other.listen") }}</span>
            <Icon name="lucide:headphones" class="size-7 shrink-0" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-[clamp(2rem,3vw,3.4rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">{{ $t("homepage.other.listen") }}</span>
            <span class="mt-4 block max-w-xs text-sm font-semibold leading-snug">{{ $t("homepage.other.listenDescription") }}</span>
            <span class="mt-8 flex items-center justify-between border-t-[3px] border-[#171717] pt-3 font-mono text-xs font-black uppercase tracking-[0.12em]">
              Last.fm <Icon name="lucide:arrow-up-right" class="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </a>
      </div>
    </section>
  </div>
</template>
