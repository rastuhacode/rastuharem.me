<script setup lang="ts">
const { availableLocales } = useI18n();
</script>

<template>
  <header class="z-10 flex items-center justify-between px-5 py-5">
    <nav>
      <ul class="flex items-center gap-4">
        <li class="flex items-center">
          <NuxtLinkLocale
            :aria-label="$t('home')"
            to="/"
          >
            <RLogo class="size-8" />
          </NuxtLinkLocale>
        </li>
        <li class="flex items-center">
          <NuxtLinkLocale
            :aria-label="$t('blog')"
            to="/posts"
          >
            {{ $t("blog") }}
          </NuxtLinkLocale>
        </li>
      </ul>
    </nav>

    <div class="flex items-center gap-5">
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
