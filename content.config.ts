import { defineContentConfig, defineCollection } from "@nuxt/content";
import { defineRobotsSchema } from "@nuxtjs/robots/content";

import { postMetaSchema } from "./shared/types/posts";

const postSchema = postMetaSchema.extend({
  robots: defineRobotsSchema(),
});

export default defineContentConfig({
  collections: {
    // English content collection
    content_en: defineCollection({
      type: "page",
      source: {
        include: "en/**",
        prefix: "",
      },
      schema: postSchema,
    }),
    // Russian content collection
    content_ru: defineCollection({
      type: "page",
      source: {
        include: "ru/**",
        prefix: "",
      },
      schema: postSchema,
    }),
  },
});
