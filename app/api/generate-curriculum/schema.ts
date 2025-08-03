import { z } from "zod"

export const curriculumSchema = z.object({
  title: z.string(),
  topics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
})