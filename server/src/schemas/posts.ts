import { z } from "zod"

export const postSchema = z.object({
  id: z.string(),
  text: z.string(),
  user_id: z.string(),
  announcement_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export const postSchemaBody = z.object({
  text: postSchema.shape.text,
  announcement_date: postSchema.shape.announcement_date,
})

export type IPost = z.infer<typeof postSchema>
export type IPostBody = z.infer<typeof postSchemaBody>

