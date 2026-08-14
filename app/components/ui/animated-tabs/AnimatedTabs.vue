<script setup lang="ts">
import type { AnimatedTab } from "./types";
import { motion } from "motion-v";

const props = withDefaults(
  defineProps<{
    tabs: AnimatedTab[];
    modelValue?: string;
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
    stacked?: boolean;
    ariaLabel?: string;
  }>(),
  {
    containerClassName: "",
    activeTabClassName: "",
    tabClassName: "",
    contentClassName: "",
    modelValue: undefined,
    stacked: true,
    ariaLabel: "Tabs",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const uncontrolledValue = ref<string | null>(props.tabs[0]?.value ?? null);
const selectedValue = computed(() =>
  isControlled.value ? props.modelValue : uncontrolledValue.value,
);
const id = useId();
const pillLayoutId = computed(() => `animated-tabs-pill-${id}`);

const reorderTabs = (tabs: AnimatedTab[], value: string | null | undefined) => {
  const next = tabs.slice();
  if (!value) return next;

  const idx = next.findIndex((t) => t.value === value);
  if (idx <= 0) return next;

  const selected = next.splice(idx, 1)[0];
  if (!selected) return next;

  next.unshift(selected);
  return next;
};

const stackedTabs = ref<AnimatedTab[]>(reorderTabs(props.tabs, selectedValue.value));
const active = ref<AnimatedTab | null>(stackedTabs.value[0] ?? null);
const pointerHovering = ref(false);
const programmaticHovering = ref(false);
const hovering = computed(() => pointerHovering.value || programmaticHovering.value);

let programmaticHoverTimer: ReturnType<typeof setTimeout> | null = null;
const triggerProgrammaticHover = () => {
  if (pointerHovering.value) return;

  programmaticHovering.value = true;
  if (programmaticHoverTimer) clearTimeout(programmaticHoverTimer);
  programmaticHoverTimer = setTimeout(() => {
    programmaticHoverTimer = null;
    // If the user moved the mouse onto the component while the timer was running,
    // keep the hover state driven by the pointer.
    if (!pointerHovering.value) programmaticHovering.value = false;
  }, 320);
};

onScopeDispose(() => {
  if (programmaticHoverTimer) clearTimeout(programmaticHoverTimer);
});

watch(
  [() => props.tabs, () => selectedValue.value],
  ([nextTabs, value]) => {
    const nextStack = reorderTabs(nextTabs, value);
    stackedTabs.value = nextStack;
    active.value = nextStack[0] ?? null;

    if (!isControlled.value) {
      // If the selected value disappears (tabs list replaced), keep internal state valid.
      if (!value || !nextTabs.some((t) => t.value === value)) {
        uncontrolledValue.value = nextStack[0]?.value ?? null;
      }
    }
  },
  { deep: false, immediate: true },
);

// When controlled externally, a modelValue change can happen without the pointer hovering
// over the tabs. Briefly simulate hover to match the "click while hovering" visuals.
watch(
  () => props.modelValue,
  (value, oldValue) => {
    if (!isControlled.value) return;
    if (value === undefined) return;
    if (oldValue === undefined) return; // skip initial mount
    if (value === oldValue) return;

    triggerProgrammaticHover();
  },
);

const selectTab = (idx: number) => {
  const selected = props.tabs[idx];
  if (!selected) return;

  if (isControlled.value) {
    emit("update:modelValue", selected.value);
    return;
  }

  uncontrolledValue.value = selected.value;
};

const handleTabKeydown = (event: KeyboardEvent, idx: number) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

  event.preventDefault();
  const lastIndex = props.tabs.length - 1;
  let nextIndex = idx;

  if (event.key === "ArrowLeft") nextIndex = idx === 0 ? lastIndex : idx - 1;
  if (event.key === "ArrowRight") nextIndex = idx === lastIndex ? 0 : idx + 1;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = lastIndex;

  selectTab(nextIndex);
  nextTick(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(`[data-animated-tabs-id="${id}"] [role="tab"]`);
    buttons[nextIndex]?.focus();
  });
};
</script>

<template>
  <div
    class="flex h-full w-full flex-col"
    @mouseenter="pointerHovering = true"
    @mouseleave="pointerHovering = false"
  >
    <div
      :data-animated-tabs-id="id"
      role="tablist"
      :aria-label="ariaLabel"
      :class="
        cn(
          'relative flex w-full max-w-full shrink-0 flex-row items-center justify-start overflow-auto [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] perspective-[1000px] scrollbar-none sm:overflow-visible [&::-webkit-scrollbar]:hidden',
          containerClassName,
        )
      "
    >
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.title"
        type="button"
        role="tab"
        :aria-selected="active?.value === tab.value"
        :tabindex="active?.value === tab.value ? 0 : -1"
        :class="cn('relative rounded-full px-4 py-2', tabClassName)"
        :style="{ transformStyle: 'preserve-3d' }"
        @click="selectTab(idx)"
        @keydown="handleTabKeydown($event, idx)"
      >
        <motion.div
          v-if="active?.value === tab.value"
          :layout-id="pillLayoutId"
          :transition="{ type: 'spring', bounce: 0.3, duration: 0.6 }"
          :class="
            cn(
              'pointer-events-none absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800',
              activeTabClassName,
            )
          "
        />

        <span
          :class="cn(
            'relative flex items-center gap-2 transition-colors duration-300',
            active?.value === tab.value ? 'text-foreground' : 'text-muted-foreground',
          )"
        >
          <slot
            name="tab"
            :tab="tab"
            :active="active?.value === tab.value"
          >
            {{ tab.title }}
          </slot>
        </span>
      </button>
    </div>

    <div :class="cn('relative min-h-0 flex-1', stacked ? 'mt-24' : 'mt-10')">
      <AnimatedTabsFadeInDiv
        :id="id"
        :key="active?.value ?? 'empty'"
        :tabs="stackedTabs"
        :active="active"
        :hovering="hovering"
        :stacked="stacked"
        :class-name="contentClassName"
      >
        <template #content="{ tab, active: slotActive, hovering: slotHovering }">
          <slot
            name="content"
            :tab="tab"
            :active="slotActive"
            :hovering="slotHovering"
          >
            <component
              :is="tab.content"
              v-if="tab.content"
              v-bind="tab.contentProps || {}"
              :tab="tab"
              :active="slotActive"
              :hovering="slotHovering"
            />
          </slot>
        </template>
      </AnimatedTabsFadeInDiv>
    </div>
  </div>
</template>
