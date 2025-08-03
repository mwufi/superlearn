"use client"

import { useState } from "react"
import type { ChangeEvent } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { curriculumSchema } from "./api/generate-curriculum/schema"
import { contentSchema } from "./api/generate-content/schema"

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
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [view, setView] = useState<"input" | "curriculum" | "learning">("input")
  
  // Use AI SDK hooks for streaming
  const { object: curriculum, submit: submitCurriculum, isLoading: loadingCurriculum } = useObject({
    api: "/api/generate-curriculum",
    schema: curriculumSchema,
  })
  
  const { object: contentData, submit: submitContent, isLoading: loadingContent } = useObject({
    api: "/api/generate-content",
    schema: contentSchema,
  })

  const handleGenerateCurriculum = async () => {
    if (!input.trim()) return
    
    setView("curriculum")
    await submitCurriculum({ input })
  }

  const generateTopicContent = async (topic: Topic) => {
    setCurrentTopic(topic)
    setView("learning")
    
    await submitContent({
      topic: topic.title,
      curriculumTitle: curriculum?.title,
    })
  }

  const formatContent = (content: any) => {
    if (!content) return ""
    
    let formatted = `## Overview\n\n${content.overview}\n\n`
    
    if (content.keyConcepts?.length > 0) {
      formatted += `## Key Concepts\n\n`
      content.keyConcepts.forEach((concept: string) => {
        formatted += `• ${concept}\n`
      })
      formatted += "\n"
    }
    
    if (content.practicalExamples?.length > 0) {
      formatted += `## Practical Examples\n\n`
      content.practicalExamples.forEach((example: string, index: number) => {
        formatted += `${index + 1}. ${example}\n\n`
      })
    }
    
    if (content.importantPoints?.length > 0) {
      formatted += `## Important Points\n\n`
      content.importantPoints.forEach((point: string) => {
        formatted += `⚡ ${point}\n`
      })
      formatted += "\n"
    }
    
    if (content.exercises?.length > 0) {
      formatted += `## Exercises\n\n`
      content.exercises.forEach((exercise: string, index: number) => {
        formatted += `**Exercise ${index + 1}:** ${exercise}\n\n`
      })
    }
    
    return formatted
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
              <h1 className="text-2xl font-light text-gray-900 mb-2">{currentTopic?.title || "Loading..."}</h1>
              <p className="text-gray-500 text-sm">{curriculum?.title || ""}</p>
            </div>

            <div className="prose prose-gray max-w-none">
              {loadingContent ? (
                <div className="text-gray-400">generating content...</div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {contentData?.content ? formatContent(contentData.content) : currentTopic?.content || ""}
                </div>
              )}
            </div>

            {curriculum?.topics && (
              <div className="pt-8 border-t border-gray-100">
                <div className="text-sm text-gray-400 mb-4">next topics</div>
                <div className="space-y-2">
                  {curriculum.topics
                    .filter((t) => t.id !== currentTopic?.id)
                    .slice(0, 3)
                    .map((topic) => (
                      <button
                        key={topic?.id || index}
                        onClick={() => generateTopicContent(topic)}
                        className="block text-left text-gray-600 hover:text-gray-900 transition-colors"
                        disabled={!topic?.title}
                      >
                        {topic?.title || "Loading..."}
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

  if (view === "curriculum") {
    // Show curriculum as it's being generated or after completion
    if (curriculum || loadingCurriculum) {
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
                <h1 className="text-2xl font-light text-gray-900 mb-8">
                  {curriculum?.title || "Loading..."}
                </h1>
                {curriculum?.topics && curriculum.topics.length > 0 && (
                  <button
                    onClick={() => generateTopicContent(curriculum.topics[0])}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    start learning →
                  </button>
                )}
              </div>

              {curriculum?.topics && curriculum.topics.length > 0 ? (
                <div className="space-y-6">
                  {curriculum.topics.map((topic, index) => (
                    <div key={topic?.id || index} className="group animate-fadeIn">
                      <button
                        onClick={() => generateTopicContent(topic)}
                        className="block w-full text-left space-y-2 hover:bg-gray-50 p-4 -m-4 rounded transition-colors"
                        disabled={!topic?.title}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-400 font-mono">{String(index + 1).padStart(2, "0")}</span>
                          <h3 className="text-gray-900 group-hover:text-black transition-colors">{topic?.title || ""}</h3>
                        </div>
                        <p className="text-sm text-gray-500 ml-8">{topic?.description || ""}</p>
                      </button>
                    </div>
                  ))}
                  {loadingCurriculum && (
                    <div className="text-gray-400 text-sm animate-pulse">loading more topics...</div>
                  )}
                </div>
              ) : loadingCurriculum ? (
                <div className="text-gray-400">generating topics...</div>
              ) : (
                <div className="text-gray-400">No topics generated. Please try again.</div>
              )}
            </div>
          </div>
        </div>
      )
    }
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
              disabled={loadingCurriculum}
            />

            <div className="flex items-center space-x-8">
              <button
                onClick={handleGenerateCurriculum}
                disabled={loadingCurriculum || !input.trim()}
                className="text-gray-600 hover:text-gray-900 transition-colors disabled:text-gray-300"
              >
                {loadingCurriculum ? "generating..." : "generate curriculum →"}
              </button>

              <div className="text-gray-400">or</div>

              <label className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                upload file
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf"
                  className="hidden"
                  disabled={loadingCurriculum}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
