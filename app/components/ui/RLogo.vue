<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class'] }>(), {
  class: '',
})
</script>

<template>
  <svg
    :class="cn('text-foreground', props.class)"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <defs>
      <path
        id="logo-orbit"
        d="M 78,18 A 42,42 0 0 1 18,78 A 42,42 0 0 1 78,18"
      />
    </defs>
    <text
      x="48"
      y="74"
      text-anchor="middle"
      font-family="var(--font-manrope), system-ui, sans-serif"
      font-weight="600"
      font-size="70"
      fill="currentColor"
    >
      R
    </text>
    <circle
      r="4"
      fill="currentColor"
    >
      <animate
        attributeName="r"
        dur="5s"
        repeatCount="indefinite"
        values="4;7;4;4"
        keyTimes="0;0.03;0.06;1"
        calcMode="spline"
        keySplines="0.33 0 0.67 1;0.33 0 0.67 1;0 0 1 1"
      />
      <animateMotion
        dur="5s"
        repeatCount="indefinite"
        keyPoints="0;0;1;1"
        keyTimes="0;0.06;0.26;1"
        calcMode="spline"
        keySplines="0 0 1 1;0.42 0 0.58 1;0 0 1 1"
      >
        <mpath href="#logo-orbit" />
      </animateMotion>
    </circle>
  </svg>
</template>
