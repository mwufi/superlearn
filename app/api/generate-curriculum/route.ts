import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== "string") {
      return Response.json({ error: "Invalid input provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: `Create a comprehensive learning curriculum for: "${input}"

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Learning [Subject]",
  "topics": [
    {
      "id": "1",
      "title": "Topic Title",
      "description": "Brief description of what will be learned"
    }
  ]
}

Create 8-12 topics that progress logically from beginner to advanced concepts. Each topic should be substantial enough for a focused learning session. Make sure the response is valid JSON only.`,
    })

    let curriculumData
    try {
      curriculumData = JSON.parse(text)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return Response.json({ error: "Failed to parse curriculum data" }, { status: 500 })
    }

    // Validate the structure
    if (!curriculumData.title || !Array.isArray(curriculumData.topics)) {
      return Response.json({ error: "Invalid curriculum structure" }, { status: 500 })
    }

    return Response.json(curriculumData)
  } catch (error) {
    console.error("Error generating curriculum:", error)
    return Response.json({ error: "Failed to generate curriculum" }, { status: 500 })
  }
}
