import { z } from 'zod'

/**
 * All tags which can be used in posts
 */
export const postTagsSchema = z.enum(['life', 'dev', 'vue'])

export type PostTags = z.infer<typeof postTagsSchema>

export function isPostTag(tag: string): tag is PostTags {
  return postTagsSchema.safeParse(tag).success
}
