import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { topic, curriculumTitle } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: `Create detailed learning content for the topic: "${topic}"

Context: This is part of a curriculum for learning "${curriculumTitle}"

Provide comprehensive content that includes:
- Key concepts and explanations
- Practical examples
- Important points to remember
- Suggested exercises or practice

Format the content in clear, readable paragraphs with good structure.`,
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("Error generating content:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
