"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ChatInput } from "@/components/ui/chat-input"
import { Brain, BookOpen, Target, ChevronRight, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface CurriculumTopic {
  id: string
  title: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  subtopics: string[]
}

export default function StructuredPage() {
  const [topic, setTopic] = useState("")
  const [curriculum, setCurriculum] = useState<CurriculumTopic[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateCurriculum = async (message: string) => {
    setTopic(message)
    setIsGenerating(true)
    
    // TODO: Call API to generate curriculum
    setTimeout(() => {
      setCurriculum([
        {
          id: "1",
          title: "Introduction & Fundamentals",
          duration: "2 weeks",
          difficulty: "beginner",
          subtopics: ["Basic concepts", "Key terminology", "Historical context"]
        },
        {
          id: "2",
          title: "Core Concepts",
          duration: "3 weeks",
          difficulty: "intermediate",
          subtopics: ["Main principles", "Practical applications", "Common patterns"]
        },
        {
          id: "3",
          title: "Advanced Topics",
          duration: "4 weeks",
          difficulty: "advanced",
          subtopics: ["Complex scenarios", "Edge cases", "Best practices"]
        }
      ])
      setIsGenerating(false)
    }, 2000)
  }

  const difficultyColors = {
    beginner: "text-green-500 bg-green-500/10",
    intermediate: "text-yellow-500 bg-yellow-500/10",
    advanced: "text-red-500 bg-red-500/10"
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Structured Learning</h1>
              <p className="text-muted-foreground">
                Generate comprehensive learning paths for any topic
              </p>
            </div>

            {!curriculum && !isGenerating && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleGenerateCurriculum("Web Development")}
                    className="p-6 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <BookOpen className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Web Development</h3>
                    <p className="text-sm text-muted-foreground">Frontend, Backend, Databases</p>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateCurriculum("Machine Learning")}
                    className="p-6 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <Brain className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Machine Learning</h3>
                    <p className="text-sm text-muted-foreground">AI, Neural Networks, Data Science</p>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateCurriculum("Digital Marketing")}
                    className="p-6 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <Target className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Digital Marketing</h3>
                    <p className="text-sm text-muted-foreground">SEO, Social Media, Analytics</p>
                  </button>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-12 w-12 text-primary" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Generating your curriculum...</p>
              </div>
            )}

            {curriculum && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Learning Path: {topic}</h2>
                  <p className="text-muted-foreground">
                    Total duration: ~9 weeks • {curriculum.length} modules
                  </p>
                </div>

                <div className="space-y-4">
                  {curriculum.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            Module {index + 1}: {module.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {module.duration}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[module.difficulty]}`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-1">
                        {module.subtopics.map((subtopic, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {subtopic}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Start Learning
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="border-t border-border p-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput 
              onSubmit={handleGenerateCurriculum}
              placeholder="What would you like to learn? (e.g., 'Python programming', 'Photography basics')"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}