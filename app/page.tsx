"use client"

import { useState } from "react"
import type { ChangeEvent } from "react"

interface Topic {
  id: string
  title: string
  description: string
  content?: string
}

interface Curriculum {
  title: string
  topics: Topic[]
}

export default function CurriculumGenerator() {
  const [input, setInput] = useState("")
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<"input" | "curriculum" | "learning">("input")

  const generateCurriculum = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/generate-curriculum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate curriculum")
      }

      const curriculumData = await response.json()

      // Validate the response structure
      if (!curriculumData || !curriculumData.topics || !Array.isArray(curriculumData.topics)) {
        throw new Error("Invalid curriculum data received")
      }

      setCurriculum(curriculumData)
      setView("curriculum")
    } catch (error) {
      console.error("Error generating curriculum:", error)
      // You could add a state for error messages here
    } finally {
      setLoading(false)
    }
  }

  const generateTopicContent = async (topic: Topic) => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.title,
          curriculumTitle: curriculum?.title,
        }),
      })

      const { content } = await response.json()
      const updatedTopic = { ...topic, content }
      setCurrentTopic(updatedTopic)
      setView("learning")
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setInput(`Based on this content: ${text.slice(0, 2000)}...`)
  }

  if (view === "learning" && currentTopic) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <nav className="mb-16">
            <button
              onClick={() => setView("curriculum")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← back to curriculum
            </button>
          </nav>

          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">{currentTopic.title}</h1>
              <p className="text-gray-500 text-sm">{curriculum?.title}</p>
            </div>

            <div className="prose prose-gray max-w-none">
              {loading ? (
                <div className="text-gray-400">generating content...</div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{currentTopic.content}</div>
              )}
            </div>

            {curriculum?.topics && (
              <div className="pt-8 border-t border-gray-100">
                <div className="text-sm text-gray-400 mb-4">next topics</div>
                <div className="space-y-2">
                  {curriculum.topics
                    .filter((t) => t.id !== currentTopic.id)
                    .slice(0, 3)
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => generateTopicContent(topic)}
                        className="block text-left text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {topic.title}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (view === "curriculum" && curriculum) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <nav className="mb-16">
            <button onClick={() => setView("input")} className="text-gray-400 hover:text-gray-600 transition-colors">
              ← new curriculum
            </button>
          </nav>

          <div className="space-y-12">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-8">{curriculum.title}</h1>
              <button
                onClick={() => generateTopicContent(curriculum.topics[0])}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                start learning →
              </button>
            </div>

            {curriculum?.topics?.length > 0 ? (
              <div className="space-y-6">
                {curriculum.topics.map((topic, index) => (
                  <div key={topic.id} className="group">
                    <button
                      onClick={() => generateTopicContent(topic)}
                      className="block w-full text-left space-y-2 hover:bg-gray-50 p-4 -m-4 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400 font-mono">{String(index + 1).padStart(2, "0")}</span>
                        <h3 className="text-gray-900 group-hover:text-black transition-colors">{topic.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-8">{topic.description}</p>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No topics generated. Please try again.</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-12">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">curriculum generator</h1>
            <p className="text-gray-500 text-sm">what would you like to learn?</p>
          </div>

          <div className="space-y-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="machine learning fundamentals, spanish conversation, react development..."
              className="w-full h-32 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none resize-none text-lg leading-relaxed"
              disabled={loading}
            />

            <div className="flex items-center space-x-8">
              <button
                onClick={generateCurriculum}
                disabled={loading || !input.trim()}
                className="text-gray-600 hover:text-gray-900 transition-colors disabled:text-gray-300"
              >
                {loading ? "generating..." : "generate curriculum →"}
              </button>

              <div className="text-gray-400">or</div>

              <label className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                upload file
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf"
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
