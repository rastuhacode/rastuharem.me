import { z } from 'zod'
import { postTagsSchema } from './tags'
import { postDateSchema } from './date'

/**
 * Schema for posts
 */
export const postMetaSchema = z.object({
  title: z.string(),
  date: postDateSchema,
  duration: z.string(),
  description: z.string().optional(),
  toc: z.boolean().optional(),
  tags: z.array(postTagsSchema).optional(),
})

export type PostMeta = z.infer<typeof postMetaSchema>

export { postTagsSchema, postDateSchema }
export type { PostTags } from './tags'
