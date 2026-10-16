import type {
  ContentEnCollectionItem,
  ContentRuCollectionItem,
} from "@nuxt/content";

export type Post = ContentEnCollectionItem | ContentRuCollectionItem;

export function isPostReleased(post: Post) {
  return new Date(post.date) <= new Date();
}

export function isPostNew(post: Pick<Post, "date">, now = Date.now()) {
  const age = now - new Date(post.date).getTime();
  return age >= 0 && age < 3 * 24 * 60 * 60 * 1000;
}
