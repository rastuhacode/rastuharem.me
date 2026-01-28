<script setup lang="ts">
const { availableLocales } = useI18n();
</script>

<template>
  <header class="z-40 flex justify-between items-center p-5">
    <div>
      <NuxtLinkLocale
        class="w-12 h-12 min-w-fit bg-linear-to-tl from-slate-800 via-violet-500 to-zinc-400 rounded-lg items-center justify-center flex p-1"
        to="/"
      >
        {{ $t("home") }}
      </NuxtLinkLocale>
    </div>
    <nav>
      <ul class="flex items-center gap-4">
        <li class="h-full flex items-center">
          <NuxtLinkLocale to="/posts">{{ $t("blog") }}</NuxtLinkLocale>
        </li>
        <li class="h-full flex items-center">
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
        </li>
      </ul>
    </nav>
  </header>
</template>
