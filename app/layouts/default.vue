<script setup lang="ts">
const mainRef = useTemplateRef("mainRef");

const { y: scrollY } = useScroll(mainRef);
const graphics = useGraphicsStore();

function toTop() {
  mainRef.value?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="size-screen flex flex-col">
    <FlowArtworkBg :interactive="graphics" />

    <main
      ref="mainRef"
      class="grow overflow-y-auto overflow-x-hidden flex flex-col justify-between"
    >
      <LayoutHeader />
      <slot />
      <LayoutFooter />

      <button
        :title="$t('scroll_to_top')"
        :class="
          cn(
            'fixed bottom-3 right-3 flex items-center justify-center',
            'bg-background p-2 rounded-full transition-opacity duration-300',
            scrollY > 300
              ? 'opacity-50 hover:opacity-100'
              : 'pointer-events-none opacity-0',
          )
        "
        @click="toTop"
      >
        <Icon
          name="lucide:arrow-up"
          class="size-5 pointer-events-none"
        />
      </button>
    </main>
  </div>
</template>
