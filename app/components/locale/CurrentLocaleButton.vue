<script setup lang="ts">
import { useForwardProps, type PrimitiveProps, Primitive } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = withDefaults(defineProps<
  PrimitiveProps & { class?: HTMLAttributes["class"] }
>(), { as: "button", class: "" });

const { locale } = useI18n();

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-label="$t('change_language')"
    :class="cn('[&_span]:size-5 flex size-11 shrink-0 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground', props.class)"
  >
    <slot :locale="locale">
      <Icon :name="LocaleToIcon[locale]" />
    </slot>
  </Primitive>
</template>
