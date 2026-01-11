<template>
  <div class="size-screen flex flex-col">
    <LayoutGradient />

    <LayoutHeader />
    <main class="grow overflow-y-auto overflow-x-hidden z-10">
      <slot />
    </main>
  </div>
</template>
