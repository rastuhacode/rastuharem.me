<script setup lang="ts">
const scrollRef = useTemplateRef("scrollRef");
const mainRef = useTemplateRef("mainRef");

const { y: scrollY } = useScroll(scrollRef);
const { enabled: motionEnabled } = useMotionPreference();
const graphics = useGraphicsStore();

useRuntimeHook("page:finish", () => {
  scrollRef.value?.scrollTo({
    top: 0,
    behavior: "instant",
  });
});

function toTop() {
  scrollRef.value?.scrollTo({
    top: 0,
    behavior: motionEnabled.value ? "smooth" : "instant",
  });
}

function skipToContent() {
  mainRef.value?.focus({ preventScroll: true });
  mainRef.value?.scrollIntoView({ behavior: "instant", block: "start" });
}
</script>

<template>
  <div class="size-screen flex flex-col">
    <FlowArtworkBg :interactive="graphics && motionEnabled" />

    <div
      ref="scrollRef"
      class="min-h-0 grow overflow-y-auto overflow-x-hidden flex flex-col"
    >
      <a
        href="#main-content"
        class="sr-only fixed left-4 top-3 z-[100] focus:not-sr-only focus:rounded-sm focus:bg-background focus:px-4 focus:py-3 focus:text-foreground-bold focus:outline-2 focus:outline-offset-2"
        @click.prevent="skipToContent"
      >{{ $t('skip_to_content') }}</a>
      <LayoutHeader />
      <main id="main-content" ref="mainRef" tabindex="-1" class="flex grow flex-col focus:outline-none">
        <slot />
      </main>
      <LayoutFooter />

      <button
        v-if="scrollY > 300"
        type="button"
        :aria-label="$t('scroll_to_top')"
        :title="$t('scroll_to_top')"
        class="fixed bottom-3 right-3 flex size-11 items-center justify-center bg-background rounded-full opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 transition-opacity duration-300"
        @click="toTop"
      >
        <Icon
          name="lucide:arrow-up"
          class="size-5 pointer-events-none"
        />
      </button>
    </div>
  </div>
</template>
