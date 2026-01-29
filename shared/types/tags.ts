/**
 * All tags which can be used in posts
 */
export const PostTags = {
  development: "Development",
  vue: "Vue",
  life: "Life",
  other: "Other",
} as const;
export type TPostTags = (typeof PostTags)[keyof typeof PostTags];
