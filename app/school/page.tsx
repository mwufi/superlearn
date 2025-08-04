"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { GraduationCap, Book, Atom, Calculator, Globe, Palette, Music, Dumbbell, Search } from "lucide-react"
import { motion } from "framer-motion"

interface Subject {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  topics: number
  difficulty: string
  color: string
}

const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: <Calculator className="h-6 w-6" />,
    description: "Algebra, Calculus, Statistics, and more",
    topics: 156,
    difficulty: "All levels",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: "science",
    name: "Science",
    icon: <Atom className="h-6 w-6" />,
    description: "Physics, Chemistry, Biology",
    topics: 203,
    difficulty: "All levels",
    color: "bg-green-500/10 text-green-500"
  },
  {
    id: "literature",
    name: "Literature",
    icon: <Book className="h-6 w-6" />,
    description: "Classic & Modern Literature, Writing",
    topics: 89,
    difficulty: "All levels",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    id: "history",
    name: "History",
    icon: <Globe className="h-6 w-6" />,
    description: "World History, Civilizations, Wars",
    topics: 124,
    difficulty: "All levels",
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    id: "arts",
    name: "Arts",
    icon: <Palette className="h-6 w-6" />,
    description: "Visual Arts, Art History, Design",
    topics: 67,
    difficulty: "All levels",
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    id: "music",
    name: "Music",
    icon: <Music className="h-6 w-6" />,
    description: "Music Theory, Instruments, History",
    topics: 45,
    difficulty: "All levels",
    color: "bg-indigo-500/10 text-indigo-500"
  },
  {
    id: "pe",
    name: "Physical Education",
    icon: <Dumbbell className="h-6 w-6" />,
    description: "Sports, Health, Fitness",
    topics: 38,
    difficulty: "All levels",
    color: "bg-red-500/10 text-red-500"
  }
]

export default function SchoolPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="flex flex-col h-full p-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-8 text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">School Subjects</h1>
            <p className="text-muted-foreground">
              Traditional academic subjects with AI-enhanced learning
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject, index) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSubject(subject.id)}
                className="p-6 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${subject.color}`}>
                    {subject.icon}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {subject.topics} topics
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {subject.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {subject.difficulty}
                </p>
              </motion.button>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No subjects found matching your search.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              More subjects coming soon
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}