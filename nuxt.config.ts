import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

// TODO: make fully external via environment variables
// For now it's enough as we have only one host instance
const siteUrl = "https://rastuharem.netlify.app";
const photoManifestPath = resolve("public/photo-index/manifest.json");
const photoManifest = existsSync(photoManifestPath)
  ? JSON.parse(readFileSync(photoManifestPath, "utf8")) as { pages: number }
  : { pages: 0 };
const photoIndexRoutes = ["/api/photo-index/manifest.json", ...Array.from(
  { length: Math.max(photoManifest.pages, 1) },
  (_, index) => `/api/photo-index/page-${String(index + 1).padStart(4, "0")}.json`,
)];
const photoPageRoutes = Array.from({ length: photoManifest.pages }, (_, index) => {
  const pagePath = resolve(`public/photo-index/page-${String(index + 1).padStart(4, "0")}.json`);
  const photos = JSON.parse(readFileSync(pagePath, "utf8")) as { fileName: string }[];
  return photos.flatMap(({ fileName }) => {
    const id = encodeURIComponent(fileName.replace(/\.[^.]+$/, ""));
    return [`/photography/${id}/`, `/ru/photography/${id}/`];
  });
}).flat();

export default defineNuxtConfig({

  typescript: {
    nodeTsConfig: { include: ["../scripts/**/*.ts"] },
  },

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

  icon: {
    clientBundle: { scan: true},
  },

  // Pixi's public entry registers features the artwork does not use. Keep the
  // internal imports in app/lib/pixi.ts and check them when upgrading PixiJS.
  // A bare alias lets Vite resolve the prebundled entries in development.
  alias: {
    "pixi-internal": dirname(fileURLToPath(import.meta.resolve("pixi.js"))),
  },

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
        // Preload the common Latin subset; other subsets load as needed.
        {
          rel: "preload",
          href: "/fonts/manrope/manrope-v23-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
      ],
    },
  },
  css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],
  site: {
    url: siteUrl,
    name: "Rasten Remizov",
    trailingSlash: true,
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
      include: [
        "reka-ui", "clsx", "tailwind-merge", "motion-v", "zod",
        // Prebundle the curated entries so Pixi's CommonJS dependencies (such as
        // eventemitter3) also work when Vite serves the internal ESM files.
        "pixi-internal/rendering/init",
        "pixi-internal/app/Application",
        "pixi-internal/scene/graphics/shared/Graphics",
      ],
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
    skipSettingLocaleOnNavigate: true,
  },
  sitemap: { zeroRuntime: true },
  nitro: { prerender: { routes: [...photoIndexRoutes, ...photoPageRoutes] } },
});
