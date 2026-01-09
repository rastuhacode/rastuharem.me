import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-10",
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint", "@vueuse/nuxt"],
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  devtools: { enabled: true },
});
