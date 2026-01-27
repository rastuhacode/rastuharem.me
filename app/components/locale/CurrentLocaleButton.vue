<script setup lang="ts">
import { useForwardProps, type PrimitiveProps, Primitive } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  PrimitiveProps & { class?: HTMLAttributes["class"] }
>();

const { locale } = useI18n();

const LocaleIcons = {
  en: "twemoji:flag-united-states",
  ru: "twemoji:flag-russia",
} as const;

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive v-bind="forwarded" :class="cn('size-5', props.class)">
    <slot :locale="locale">
      <Icon :name="LocaleIcons[locale]" />
    </slot>
  </Primitive>
</template>
