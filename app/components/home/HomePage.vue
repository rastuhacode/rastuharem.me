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
    <div class="site-container mx-auto pt-3 sm:pt-5"><HomeActivity /></div>

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
