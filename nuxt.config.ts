import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-10",
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
    // TODO: Fix types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ["reka-ui", "clsx", "tailwind-merge"],
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  app: {
    head: {
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
  colorMode: {
    preference: "system",
    fallback: "dark",
  },
  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "ru", name: "Russian", language: "ru-RU", file: "ru.json" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
  },

  content: {
    build: {
      markdown: {
        remarkPlugins: {
          "remark-gfm": false,
        },
      },
    },
  },

  devtools: { enabled: false },
});
