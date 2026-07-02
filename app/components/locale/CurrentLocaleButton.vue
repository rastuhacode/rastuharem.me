<script setup lang="ts">
import { useForwardProps, type PrimitiveProps, Primitive } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<
  PrimitiveProps & { class?: HTMLAttributes["class"] }
>();

const { locale } = useI18n();

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="cn('[&_span]:size-5 flex items-center', props.class)"
  >
    <slot :locale="locale">
      <Icon :name="LocaleToIcon[locale]" />
    </slot>
  </Primitive>
</template>
