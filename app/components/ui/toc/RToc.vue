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

const isHovered = ref(false);
const isExpanded = ref(false);
const isOpen = computed(() => isHovered.value || isExpanded.value);
const panelId = useId();
const navRef = useTemplateRef<HTMLElement>("navRef");
const triggerRef = useTemplateRef<HTMLButtonElement>("triggerRef");
let closeTimeout: ReturnType<typeof setTimeout> | undefined;

function collapse() {
  clearTimeout(closeTimeout);
  isHovered.value = false;
  isExpanded.value = false;
}

onClickOutside(navRef, collapse);
onScopeDispose(() => clearTimeout(closeTimeout));

function onEnter() {
  clearTimeout(closeTimeout);
  isHovered.value = true;
}

function onLeave() {
  closeTimeout = setTimeout(() => {
    if (navRef.value?.contains(document.activeElement)) isExpanded.value = true;
    isHovered.value = false;
  }, 300);
}

function close() {
  collapse();
  triggerRef.value?.focus({ preventScroll: true });
}

function onFocusOut(event: FocusEvent) {
  if (!navRef.value?.contains(event.relatedTarget as Node | null)) collapse();
}

function navigate(id: string) {
  collapse();
  const heading = document.getElementById(id);
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

function flatLinks(links: TocLink[]): TocLink[] {
  return links.flatMap(link => [link, ...flatLinks(link.children ?? [])]);
}

const flat = computed(() => flatLinks(props.links));
</script>

<template>
  <nav
    v-if="links.length"
    ref="navRef"
    :aria-label="$t('table_of_contents')"
    class="table-of-contents fixed left-5 top-20 z-50 hidden lg:flex flex-col w-fit max-w-50 items-start group/toc"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @keydown.esc.stop.prevent="close"
    @focusout="onFocusOut"
  >
    <button
      ref="triggerRef"
      type="button"
      class="rounded-md text-muted-foreground group-hover/toc:text-foreground transition-colors duration-200"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      :aria-label="$t('table_of_contents')"
      @click="isExpanded = !isExpanded"
    >
      <Icon name="lucide:align-left" class="size-5" aria-hidden="true" />
    </button>

    <ul
      :id="panelId"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
      class="mt-1 flex flex-col gap-2 text-sm max-h-[70vh] overflow-y-auto pr-2 transition-opacity duration-300"
      :class="isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
    >
      <li
        v-for="link in flat"
        :key="link.id"
        :style="{ paddingLeft: `${(link.depth - 2) * 16}px` }"
      >
        <a
          :href="`#${link.id}`"
          class="text-muted-foreground hover:text-foreground transition-colors duration-300 leading-relaxed"
          @click="navigate(link.id)"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
