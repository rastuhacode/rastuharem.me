<script setup lang="ts">
const { availableLocales, setLocale } = useI18n();

function handleLocaleChange(locale: NuxtLocale) {
  setLocale(locale);
}
</script>

<template>
  <header class="z-40 flex justify-between items-center p-5">
    <div>
      <a
        class="w-12 h-12 min-w-fit bg-linear-to-tl from-slate-800 via-violet-500 to-zinc-400 rounded-lg items-center justify-center flex p-1"
        href="/"
      >
        {{ $t("home") }}
      </a>
    </div>
    <nav>
      <ul class="flex items-center gap-4">
        <li class="h-full flex items-center">
          <a href="/posts">{{ $t("blog") }}</a>
        </li>
        <li class="h-full flex items-center">
          <RDropdownMenu>
            <RDropdownMenuTrigger>
              <CurrentLocaleButton />
            </RDropdownMenuTrigger>
            <RDropdownMenuContent>
              <RDropdownMenuItem
                v-for="locale in availableLocales"
                :key="locale"
              >
                <LocaleButton
                  :locale="locale"
                  @click="handleLocaleChange(locale)"
                />
              </RDropdownMenuItem>
            </RDropdownMenuContent>
          </RDropdownMenu>
        </li>
      </ul>
    </nav>
  </header>
</template>
