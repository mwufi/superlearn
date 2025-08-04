"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { contentSchema } from "@/app/api/generate-content/schema"
import { db, type Curriculum, type Topic } from "@/app/db/storage"
import Markdown from "react-markdown"

export default function TopicPage({
  params
}: {
  params: Promise<{ id: string; topicId: string }>
}) {
  const { id, topicId } = use(params)
  const router = useRouter()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [savedContent, setSavedContent] = useState<{
    overview: string
    keyConcepts: string[]
    practicalExamples: string[]
    importantPoints: string[]
    exercises: string[]
  } | null>(null)

  const { object: contentData, submit: submitContent, isLoading: loadingContent } = useObject({
    api: "/api/generate-content",
    schema: contentSchema,
  })

  useEffect(() => {
    const loadedCurriculum = db.curricula.getById(id)
    if (!loadedCurriculum) {
      router.push("/")
      return
    }

    const topic = loadedCurriculum.topics.find(t => t.id === topicId)
    if (!topic) {
      router.push(`/curricula/${id}`)
      return
    }

    setCurriculum(loadedCurriculum)
    setCurrentTopic(topic)

    // Load saved content if available
    const storedContent = db.content.getByTopicId(id, topicId)
    if (storedContent) {
      setSavedContent(storedContent.content)
    }
  }, [id, topicId, router])

  useEffect(() => {
    // Save content when it's generated
    if (contentData?.content && currentTopic) {
      // Check if all required properties are present
      const content = contentData.content
      if (content.overview !== undefined && 
          content.keyConcepts !== undefined && 
          content.practicalExamples !== undefined && 
          content.importantPoints !== undefined && 
          content.exercises !== undefined) {
        db.content.save({
          curriculumId: id,
          topicId: topicId,
          content: content as {
            overview: string
            keyConcepts: string[]
            practicalExamples: string[]
            importantPoints: string[]
            exercises: string[]
          }
        })
        setSavedContent(content as {
          overview: string
          keyConcepts: string[]
          practicalExamples: string[]
          importantPoints: string[]
          exercises: string[]
        })
      }
    }
  }, [contentData, currentTopic, id, topicId])

  const generateContent = async () => {
    if (!currentTopic) return

    await submitContent({
      topic: currentTopic.title,
      curriculumTitle: curriculum?.title,
    })
  }

  const formatContent = (content: {
    overview?: string
    keyConcepts?: string[]
    practicalExamples?: string[]
    importantPoints?: string[]
    exercises?: string[]
  } | null) => {
    if (!content) return ""

    let formatted = ""

    if (content.overview) {
      formatted += `## Overview\n\n${content.overview}\n\n`
    }

    if (content.keyConcepts && content.keyConcepts.length > 0) {
      formatted += `## Key Concepts\n\n`
      content.keyConcepts.forEach((concept: string) => {
        if (concept) formatted += `• ${concept}\n`
      })
      formatted += "\n"
    }

    if (content.practicalExamples && content.practicalExamples.length > 0) {
      formatted += `## Practical Examples\n\n`
      content.practicalExamples.forEach((example: string, index: number) => {
        if (example) formatted += `${index + 1}. ${example}\n\n`
      })
    }

    if (content.importantPoints && content.importantPoints.length > 0) {
      formatted += `## Important Points\n\n`
      content.importantPoints.forEach((point: string) => {
        if (point) formatted += `⚡ ${point}\n`
      })
      formatted += "\n"
    }

    if (content.exercises && content.exercises.length > 0) {
      formatted += `## Exercises\n\n`
      content.exercises.forEach((exercise: string, index: number) => {
        if (exercise) formatted += `**Exercise ${index + 1}:** ${exercise}\n\n`
      })
    }

    if (loadingContent && formatted) {
      formatted += "\n\n*Loading more content...*"
    }

    return formatted || "No content available"
  }

  const getNextTopics = () => {
    if (!curriculum) return []
    const currentIndex = curriculum.topics.findIndex(t => t.id === topicId)
    return curriculum.topics.slice(currentIndex + 1, currentIndex + 4)
  }

  if (!curriculum || !currentTopic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const displayContent = contentData?.content || savedContent

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-16">
          <Link
            href={`/curricula/${id}`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← back to curriculum
          </Link>
        </nav>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">{currentTopic.title}</h1>
            <p className="text-gray-500 text-sm">{curriculum.title}</p>
          </div>

          {!displayContent && !loadingContent ? (
            <div className="space-y-4">
              <p className="text-gray-500">{currentTopic.description}</p>
              <button
                onClick={generateContent}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                generate content →
              </button>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              {loadingContent && !displayContent ? (
                <div className="text-gray-400 animate-pulse">generating content...</div>
              ) : (
                <div className="animate-fadeIn prose prose-gray prose-p:whitespace-pre-wrap max-w-none
                      prose-headings:font-light prose-headings:text-gray-900
                      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-ul:text-gray-700 prose-ol:text-gray-700
                      prose-li:my-1 prose-li:marker:text-gray-400
                      [&_li_p]:my-0 [&_li_p:first-child]:mt-0 [&_li_p:last-child]:mb-0
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-gray-100 prose-pre:text-gray-800
                      prose-blockquote:text-gray-600 prose-blockquote:border-gray-300">
                  <Markdown
                  >
                    {formatContent(displayContent)}
                  </Markdown>
                </div>
              )}
            </div>
          )}

          {getNextTopics().length > 0 && (
            <div className="pt-8 border-t border-gray-100">
              <div className="text-sm text-gray-400 mb-4">next topics</div>
              <div className="space-y-2">
                {getNextTopics().map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/curricula/${id}/topics/${topic.id}`}
                    className="block text-left text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {topic.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}