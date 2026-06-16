import type {
  ContentEnCollectionItem,
  ContentRuCollectionItem,
} from "@nuxt/content";

export type Post = ContentEnCollectionItem | ContentRuCollectionItem;

export function isPostReleased(post: Post) {
  return new Date(post.date) <= new Date();
}
