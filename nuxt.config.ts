import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

// TODO: unlock nuxt version after issue is fixed
// https://github.com/nuxt/framework/issues/11642

export default defineNuxtConfig({
  compatibilityDate: "2026-04-03",
  modules: [
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
  ],
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@nuxtjs/mdc", "reka-ui", "clsx", "tailwind-merge"],
    },
  },
  components: [{ path: "~/components", pathPrefix: false }],
  app: {
    head: {
      meta: [{ name: "author", content: "Rasten Remizov" }],
      link: [
        // Favicon
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        // Font
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Manrope:wght@200..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap",
        },
      ],
    },
  },
  colorMode: { preference: "system", fallback: "dark" },
  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "ru", name: "Russian", language: "ru-RU", file: "ru.json" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
  },

  content: {
    build: { markdown: { remarkPlugins: { "remark-gfm": false } } },
    experimental: { sqliteConnector: "native" },
  },

  devtools: { enabled: false },
});
