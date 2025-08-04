"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db, type Curriculum } from "./db/storage"

export default function HomePage() {
  const [curricula, setCurricula] = useState<Curriculum[]>([])

  useEffect(() => {
    setCurricula(db.curricula.getAll())
  }, [])

  const handleDeleteCurriculum = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm("Are you sure you want to delete this curriculum?")) {
      db.curricula.delete(id)
      setCurricula(db.curricula.getAll())
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">your curricula</h1>
              <p className="text-gray-500 text-sm">continue learning or create something new</p>
            </div>
            <Link
              href="/curricula/new"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              new curriculum →
            </Link>
          </div>

          {curricula.length > 0 ? (
            <div className="space-y-6">
              {curricula.map((curriculum) => (
                <Link
                  key={curriculum.id}
                  href={`/curricula/${curriculum.id}`}
                  className="block group"
                >
                  <div className="p-6 border border-gray-100 rounded hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg text-gray-900 group-hover:text-black transition-colors">
                          {curriculum.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {curriculum.topics.length} topics • Created {new Date(curriculum.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteCurriculum(e, curriculum.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm opacity-0 group-hover:opacity-100"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6">no curricula yet</p>
              <Link
                href="/curricula/new"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                create your first curriculum →
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link 
            href="/about" 
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            This is not the Superlearn we're envisioning.{" "}
            <span className="underline">Learn more</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
