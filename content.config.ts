import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    // English content collection
    content_en: defineCollection({
      type: "page",
      source: {
        include: "en/**",
        prefix: "",
      },
    }),
    // Russian content collection
    content_ru: defineCollection({
      type: "page",
      source: {
        include: "ru/**",
        prefix: "",
      },
    }),
  },
});
