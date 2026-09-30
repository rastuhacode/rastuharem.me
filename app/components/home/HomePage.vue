<script setup lang="ts">
import HomeContactPanel from "./HomeContactPanel.vue";

type Focus = "engineering" | "photography" | "other";
const route = useRoute();
const router = useRouter();

const focus = computed<Focus>({
  get() {
    const segment = route.query.segment;
    return segment === "photography" || segment === "other" ? segment : "engineering";
  },
  set(segment) {
    if (route.query.segment === segment) return;
    router.push({ query: { ...route.query, segment }, hash: route.hash });
  },
});
</script>

<template>
  <div class="not-prose w-full overflow-x-clip pb-10">
    <div class="site-container mx-auto pt-3 sm:pt-5">
      <a href="https://www.google.com/maps/search/?api=1&amp;query=Yerevan%2C%20Armenia" target="_blank" rel="noopener noreferrer" class="group inline-flex h-14 min-w-0 max-w-full items-center gap-2 border-2 border-foreground-bold bg-background/80 px-3 py-2 text-xs text-foreground-bold no-underline shadow-[4px_4px_0_var(--color-foreground-bold)] backdrop-blur-lg transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:gap-3">
        <Icon name="lucide:map-pin" class="size-5 shrink-0 text-[#ef7659]" aria-hidden="true" />
        <span class="min-w-0 leading-tight">
          <span class="block text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">{{ $t("homepage.location.basedIn") }}</span>
          <span class="block font-semibold">{{ $t("homepage.location.name") }}</span>
        </span>
        <Icon name="lucide:arrow-up-right" class="size-4 shrink-0 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </div>

    <header class="site-container relative mx-auto mt-10 grid gap-8 border-l-[5px] border-foreground-bold pl-5 text-foreground-bold sm:pl-9 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
      <div class="min-w-0">
        <p class="inline-block -rotate-2 bg-[#f5e536] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#171717]">
          {{ $t("homepage.hero.eyebrow") }}
        </p>
        <h1 class="mt-6 max-w-4xl text-[clamp(2.8rem,8.5vw,7.5rem)] font-black uppercase leading-[0.84] tracking-tighter">
          {{ $t("homepage.hero.name") }}<span aria-hidden="true" class="typing-cursor text-[#ef7659]">|</span>
        </h1>
      </div>
      <div class="flex flex-col gap-4">
        <span class="pointer-events-none hidden font-mono text-6xl whitespace-nowrap font-black leading-none text-foreground lg:block text-center" aria-hidden="true">
          {{`/ᐠ｡ꞈ｡ᐟ\\`}}
        </span>
        <div class="max-w-lg border-t-[3px] border-foreground-bold pt-5 lg:mb-1">
          <p class="text-lg font-semibold leading-snug sm:text-xl">
            {{ $t("homepage.hero.description") }}
          </p>
        </div>
      </div>
      
    </header>

    <HomeViewSelector v-model:focus="focus" />

    <div class="site-container mx-auto pt-14 sm:pt-24">
      <Transition mode="out-in" enter-active-class="transition duration-400 ease-out" enter-from-class="translate-y-5 opacity-0" leave-active-class="transition duration-200 ease-in" leave-to-class="-translate-y-3 opacity-0">
        <HomeFocusContent :key="focus" :focus="focus" />
      </Transition>
    </div>

    <HomeContactPanel :focus="focus" />
  </div>
</template>
