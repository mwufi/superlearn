import { z } from "zod"

export const contentSchema = z.object({
  content: z.object({
    overview: z.string(),
    keyConcepts: z.array(z.string()),
    practicalExamples: z.array(z.string()),
    importantPoints: z.array(z.string()),
    exercises: z.array(z.string()),
  })
})