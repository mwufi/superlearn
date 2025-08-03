import { streamObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for content structure
const contentSchema = z.object({
  content: z.object({
    overview: z.string(),
    keyConcepts: z.array(z.string()),
    practicalExamples: z.array(z.string()),
    importantPoints: z.array(z.string()),
    exercises: z.array(z.string()),
  })
})

export async function POST(req: Request) {
  try {
    const { topic, curriculumTitle } = await req.json()

    const result = await streamObject({
      model: openai("gpt-4o"),
      schema: contentSchema,
      prompt: `Create detailed learning content for the topic: "${topic}"

Context: This is part of a curriculum for learning "${curriculumTitle}"

Provide comprehensive content with:
- overview: A clear introduction and overview of the topic (2-3 paragraphs)
- keyConcepts: 5-8 key concepts that students need to understand
- practicalExamples: 3-5 practical examples that illustrate the concepts
- importantPoints: 4-6 important points students should remember
- exercises: 3-4 suggested exercises or practice activities

Make the content engaging, educational, and appropriate for the learning level.`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating content:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
