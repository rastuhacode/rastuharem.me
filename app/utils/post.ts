import type {
  ContentEnCollectionItem,
  ContentRuCollectionItem,
} from "@nuxt/content";

export type Post = ContentEnCollectionItem | ContentRuCollectionItem;

export function getPostDate(post: Post) {
  // TODO: Replace with schema typing
  return String(post.meta.date);
}

export function getPostDuration(post: Post) {
  // TODO: Replace with schema typing
  return String(post.meta.duration);
}

export function isPostReleased(post: Post) {
  return new Date(getPostDate(post)) <= new Date();
}

export function getTags(post: Post) {
  // TODO: fix types (guard or schema)
  const tags = (post.meta.tags as TPostTags[]) ?? [];
  return tags;
}
