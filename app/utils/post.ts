import type {
  ContentEnCollectionItem,
  ContentRuCollectionItem,
} from "@nuxt/content";

export type Post = ContentEnCollectionItem | ContentRuCollectionItem;

export function toPostDateTime(date: string) {
  // Content dates are validated as "YYYY-MM-DD HH:MM:SS UTC".
  return date.replace(" ", "T").replace(" UTC", "Z");
}

export function isPostReleased(post: Post) {
  return new Date(toPostDateTime(post.date)) <= new Date();
}

export function isPostNew(post: Pick<Post, "date">, now = Date.now()) {
  const age = now - new Date(toPostDateTime(post.date)).getTime();
  return age >= 0 && age < 3 * 24 * 60 * 60 * 1000;
}
