<script lang="ts">
export interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

export interface RTocProps {
  links: TocLink[];
}
</script>

<script setup lang="ts">
const props = defineProps<RTocProps>();

const isOpen = ref(false);
let closeTimeout: ReturnType<typeof setTimeout> | undefined;

function onEnter() {
  clearTimeout(closeTimeout);
  isOpen.value = true;
}

function onLeave() {
  closeTimeout = setTimeout(() => {
    isOpen.value = false;
  }, 300);
}

function flatLinks(links: TocLink[]): TocLink[] {
  const result: TocLink[] = [];
  for (const link of links) {
    result.push(link);
    if (link.children?.length) {
      result.push(...flatLinks(link.children));
    }
  }
  return result;
}

const flat = computed(() => flatLinks(props.links));
</script>

<template>
  <nav
    v-if="links.length"
    class="table-of-contents fixed left-4 top-20 z-50 flex flex-col items-start"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <button
      class="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
      :aria-expanded="isOpen"
      aria-label="Table of contents"
    >
      <Icon name="lucide:align-left" class="size-5" />
    </button>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <ul
        v-show="isOpen"
        class="mt-1 flex flex-col gap-2 text-sm max-h-[70vh] overflow-y-auto pr-2"
      >
        <li
          v-for="link in flat"
          :key="link.id"
          :style="{ paddingLeft: `${(link.depth - 2) * 16}px` }"
        >
          <a
            :href="`#${link.id}`"
            class="text-muted-foreground hover:text-foreground transition-colors duration-300 leading-relaxed"
            @click="isOpen = false"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </Transition>
  </nav>
</template>
