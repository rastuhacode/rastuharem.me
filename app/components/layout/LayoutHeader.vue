<script setup lang="ts">
const { availableLocales } = useI18n();
</script>

<template>
  <header class="flex justify-between items-center p-5">
    <nav>
      <ul class="flex items-center gap-4">
        <li class="h-full flex items-center">
          <NuxtLinkLocale to="/">{{ $t("home") }}</NuxtLinkLocale>
        </li>
        <li class="h-full flex items-center">
          <NuxtLinkLocale to="/posts">{{ $t("blog") }}</NuxtLinkLocale>
        </li>
      </ul>
    </nav>

    <ClientOnly>
      <RDropdownMenu>
        <RDropdownMenuTrigger as-child>
          <CurrentLocaleButton />
        </RDropdownMenuTrigger>
        <RDropdownMenuContent>
          <RDropdownMenuItem
            v-for="locale in availableLocales"
            :key="locale"
            as-child
          >
            <LocaleSwitchLink :locale="locale" />
          </RDropdownMenuItem>
        </RDropdownMenuContent>
      </RDropdownMenu>
      <template #fallback>
        <CurrentLocaleButton />
      </template>
    </ClientOnly>
  </header>
</template>
