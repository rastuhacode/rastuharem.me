import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

// TODO: make fully external via environment variables
// For now it's enough as we have only one host instance
const siteUrl = "https://rastuharem.netlify.app";

export default defineNuxtConfig({

  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "nuxt-link-checker",
    "nuxt-site-config",
    "@vueuse/nuxt",
  ],
  components: [{ path: "~/components", pathPrefix: false }],

  devtools: { enabled: import.meta.env.DEV },
  app: {
    head: {
      meta: [
        { name: "author", content: "Rasten Remizov" },
        // Google Search Console
        {
          name: "google-site-verification",
          content: "0BnEFP6qxfy4OTBGiuGNWTOSdTSV9qGl62KuslVUs7I",
        },
      ],
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
  css: ["~/assets/css/main.css"],
  site: {
    url: siteUrl,
    name: "Rasten Remizov",
  },
  colorMode: { preference: "system", fallback: "dark" },

  content: {
    build: { markdown: { remarkPlugins: { "remark-gfm": false } } },
    experimental: { sqliteConnector: "native" },
  },
  compatibilityDate: "2026-04-03",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["reka-ui", "clsx", "tailwind-merge", "pixi.js"],
    },
  },
  i18n: {
    baseUrl: siteUrl,
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "ru", name: "Russian", language: "ru-RU", file: "ru.json" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
  },
  sitemap: { zeroRuntime: true },
});
