/**
 * All tags which can be used in posts
 */
export const PostTags = {
  dev: "dev",
  vue: "vue",
  life: "life",
} as const;
export type TPostTags = (typeof PostTags)[keyof typeof PostTags];

export const isPostTag = (tag: string): tag is TPostTags =>
  Object.values(PostTags).includes(tag as unknown as TPostTags);
