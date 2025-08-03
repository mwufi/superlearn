import { streamObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for curriculum structure
const curriculumSchema = z.object({
  title: z.string(),
  topics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
})

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== "string") {
      return Response.json({ error: "Invalid input provided" }, { status: 400 })
    }

    const result = await streamObject({
      model: openai("gpt-4o"),
      schema: curriculumSchema,
      prompt: `Create a comprehensive learning curriculum for: "${input}"

Create 8-12 topics that progress logically from beginner to advanced concepts. Each topic should be substantial enough for a focused learning session.

The title should follow the format "Learning [Subject]".
Each topic should have:
- A unique sequential id starting from "1"
- A clear, descriptive title
- A brief description of what will be learned in that topic`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating curriculum:", error)
    return Response.json({ error: "Failed to generate curriculum" }, { status: 500 })
  }
}
