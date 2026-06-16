import { defineContentConfig, defineCollection } from "@nuxt/content";
import { defineRobotsSchema } from "@nuxtjs/robots/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";

import { postMetaSchema } from "./shared/types/posts";

const basePostSchema = postMetaSchema.extend({
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
      schema: basePostSchema.extend({
        sitemap: defineSitemapSchema(),
      }),
    }),
    // Russian content collection
    content_ru: defineCollection({
      type: "page",
      source: {
        include: "ru/**",
        prefix: "",
      },
      schema: basePostSchema.extend({
        sitemap: defineSitemapSchema({
          name: "content_ru",
          onUrl: (url) => {
            url.loc = url.loc === "/" ? "/ru" : "/ru" + url.loc;
          },
        }),
      }),
    }),
  },
});
