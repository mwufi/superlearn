"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ChangeEvent } from "react"
import { db } from "@/app/db/storage"

export default function NewCurriculumPage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleGenerateCurriculum = async () => {
    if (!input.trim() || isCreating) return
    
    setIsCreating(true)
    
    // Create a placeholder curriculum and navigate to it
    const savedCurriculum = db.curricula.save({
      title: "Generating curriculum...",
      topics: []
    })
    
    // Store the input prompt in sessionStorage for the detail page to use
    sessionStorage.setItem(`curriculum-prompt-${savedCurriculum.id}`, input)
    
    router.push(`/curricula/${savedCurriculum.id}`)
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setInput(`Based on this content: ${text.slice(0, 2000)}...`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-16">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            ← back to all curricula
          </Link>
        </nav>

        <div className="space-y-12">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">create new curriculum</h1>
            <p className="text-gray-500 text-sm">what would you like to learn?</p>
          </div>

          <div className="space-y-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="machine learning fundamentals, spanish conversation, react development..."
              className="w-full h-32 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none resize-none text-lg leading-relaxed"
              disabled={isCreating}
              autoFocus
            />

            <div className="flex items-center space-x-8">
              <button
                onClick={handleGenerateCurriculum}
                disabled={isCreating || !input.trim()}
                className="text-gray-600 hover:text-gray-900 transition-colors disabled:text-gray-300"
              >
                {isCreating ? "creating..." : "generate curriculum →"}
              </button>

              <div className="text-gray-400">or</div>

              <label className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                upload file
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf"
                  className="hidden"
                  disabled={isCreating}
                />
              </label>
            </div>
          </div>

          {isCreating && (
            <div className="text-gray-400 animate-pulse">
              Creating your personalized curriculum...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}