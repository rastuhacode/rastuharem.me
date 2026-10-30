<script setup lang="ts">
const { availableLocales } = useI18n();
</script>

<template>
  <header class="z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
    <nav :aria-label="$t('primary_navigation')">
      <ul class="flex items-center sm:gap-2">
        <li class="flex items-center">
          <NuxtLinkLocale
            :aria-label="$t('home')"
            class="flex size-11 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            to="/"
          >
            <RLogo class="size-8" />
          </NuxtLinkLocale>
        </li>
        <li class="flex items-center">
          <NuxtLinkLocale to="/photography" :aria-label="$t('homepage.photography.title')" class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm sm:px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
            <Icon name="lucide:camera" class="size-5 sm:hidden" aria-hidden="true" />
            <span class="hidden sm:inline">{{ $t("homepage.photography.title") }}</span>
          </NuxtLinkLocale>
        </li>
        <li class="flex items-center">
          <NuxtLinkLocale
            :aria-label="$t('blog')"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-1 sm:px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            to="/posts"
          >
            {{ $t("blog") }}
          </NuxtLinkLocale>
        </li>
      </ul>
    </nav>

    <div class="flex items-center sm:gap-1">
      <ClientOnly>
        <GraphicSwitch />
      </ClientOnly>
      <ColorModeButton />
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
    </div>
  </header>
</template>
