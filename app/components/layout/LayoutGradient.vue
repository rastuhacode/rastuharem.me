<script setup lang="ts">
const props = withDefaults(defineProps<{ grainy?: boolean }>(), {
  grainy: false,
})
</script>

<template>
  <div class="-z-10">
    <div
      class="slide-enter absolute -top-[180px] left-[50px] h-[150px] w-[600px] rotate-0 transform rounded-full bg-linear-to-tl from-slate-800 via-pink-800 to-zinc-400 blur-[200px]"
      :style="{
        '--enter-initial': '500ms',
      }"
    />

    <div
      class="slide-enter absolute -top-[180px] right-[50px] h-[150px] w-[600px] rotate-0 transform rounded-full bg-linear-to-tl from-slate-800 via-violet-500 to-zinc-400 blur-[200px]"
      :style="{
        '--enter-initial': '1000ms',
      }"
    />
    <div
      v-if="props.grainy"
      class="fixed h-full top-0 left-0 right-0 bg-background"
      style="
        width: 100%;
        height: 100%;
        background-size: 109px;
        background-repeat: repeat;
        background-image: url('/grain.png');
        opacity: 0.03;
        border-radius: 0px;
      "
    >
      <div class="absolute left-0 right-0 bottom-0 h-[300px]" />
    </div>
  </div>
</template>
