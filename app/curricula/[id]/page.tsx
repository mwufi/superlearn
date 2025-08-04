"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { curriculumSchema } from "@/app/api/generate-curriculum/schema"
import { db, type Curriculum } from "@/app/db/storage"

export default function CurriculumPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const router = useRouter()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)

  const { object: generatedCurriculum, submit: submitCurriculum, isLoading: loadingCurriculum } = useObject({
    api: "/api/generate-curriculum",
    schema: curriculumSchema,
  })

  useEffect(() => {
    const loadedCurriculum = db.curricula.getById(id)
    if (!loadedCurriculum) {
      router.push("/")
      return
    }
    setCurriculum(loadedCurriculum)

    // Check if we need to generate the curriculum
    const savedPrompt = sessionStorage.getItem(`curriculum-prompt-${id}`)
    if (savedPrompt && loadedCurriculum.topics.length === 0) {
      setPrompt(savedPrompt)
      sessionStorage.removeItem(`curriculum-prompt-${id}`)
      submitCurriculum({ input: savedPrompt })
    }
  }, [id, router, submitCurriculum])

  // Update curriculum when generation completes
  useEffect(() => {
    if (generatedCurriculum && generatedCurriculum.title && generatedCurriculum.topics) {
      const updatedCurriculum = db.curricula.update(id, {
        title: generatedCurriculum.title,
        topics: generatedCurriculum.topics.map((topic, index) => ({
          id: `topic-${index}`,
          title: topic?.title || "",
          description: topic?.description || ""
        }))
      })
      if (updatedCurriculum) {
        setCurriculum(updatedCurriculum)
      }
    }
  }, [generatedCurriculum, id])

  const handleStartLearning = () => {
    if (curriculum?.topics[0]) {
      router.push(`/curricula/${id}/topics/${curriculum.topics[0].id}`)
    }
  }

  const handleDeleteCurriculum = () => {
    if (confirm("Are you sure you want to delete this curriculum?")) {
      db.curricula.delete(id)
      router.push("/")
    }
  }

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const isGenerating = loadingCurriculum || (prompt && curriculum.topics.length === 0)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-16 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            ← back to all curricula
          </Link>
          <button
            onClick={handleDeleteCurriculum}
            className="text-gray-400 hover:text-red-600 transition-colors text-sm"
          >
            delete curriculum
          </button>
        </nav>

        <div className="space-y-12">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-8">
              {isGenerating ? "Generating curriculum..." : curriculum.title}
            </h1>
            {curriculum.topics.length > 0 && (
              <button
                onClick={handleStartLearning}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                start learning →
              </button>
            )}
          </div>

          {curriculum.topics.length > 0 ? (
            <div className="space-y-6">
              {curriculum.topics.map((topic, index) => (
                <div key={topic.id} className="group animate-fadeIn">
                  <Link
                    href={`/curricula/${id}/topics/${topic.id}`}
                    className="block w-full text-left space-y-2 hover:bg-gray-50 p-4 -m-4 rounded transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-gray-900 group-hover:text-black transition-colors">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">{topic.description}</p>
                  </Link>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="space-y-4">
              <div className="text-gray-400 animate-pulse">Creating your personalized curriculum...</div>
              {generatedCurriculum?.topics && generatedCurriculum.topics.length > 0 && (
                <div className="text-gray-400 text-sm">
                  Generating topic {generatedCurriculum.topics.length}...
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No topics in this curriculum</div>
          )}

          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created: {new Date(curriculum.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}