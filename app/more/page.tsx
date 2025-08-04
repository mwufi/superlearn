"use client"

import { MainLayout } from "@/components/main-layout"
import { 
  MoreHorizontal, 
  Flashlight, 
  Gamepad2, 
  Languages, 
  Code2, 
  HeartHandshake,
  Briefcase,
  Lightbulb,
  Podcast,
  Video,
  Newspaper,
  MessageSquare
} from "lucide-react"
import { motion } from "framer-motion"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  comingSoon?: boolean
}

const features: Feature[] = [
  {
    id: "flashcards",
    title: "Smart Flashcards",
    description: "AI-generated flashcards with spaced repetition",
    icon: <Flashlight className="h-6 w-6" />,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    id: "games",
    title: "Learning Games",
    description: "Gamified learning experiences for better retention",
    icon: <Gamepad2 className="h-6 w-6" />,
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    id: "languages",
    title: "Language Learning",
    description: "Master new languages with AI conversation partners",
    icon: <Languages className="h-6 w-6" />,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: "coding",
    title: "Code Challenges",
    description: "Practice programming with AI-guided challenges",
    icon: <Code2 className="h-6 w-6" />,
    color: "bg-green-500/10 text-green-500"
  },
  {
    id: "mentor",
    title: "AI Mentor",
    description: "Get personalized guidance and career advice",
    icon: <HeartHandshake className="h-6 w-6" />,
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    id: "career",
    title: "Career Paths",
    description: "Discover and plan your ideal career journey",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-indigo-500/10 text-indigo-500"
  },
  {
    id: "brainstorm",
    title: "Brainstorming",
    description: "Creative idea generation with AI assistance",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "bg-yellow-500/10 text-yellow-500"
  },
  {
    id: "podcasts",
    title: "AI Podcasts",
    description: "Generated educational podcasts on any topic",
    icon: <Podcast className="h-6 w-6" />,
    color: "bg-red-500/10 text-red-500",
    comingSoon: true
  },
  {
    id: "videos",
    title: "Video Lessons",
    description: "AI-curated video content for visual learners",
    icon: <Video className="h-6 w-6" />,
    color: "bg-cyan-500/10 text-cyan-500",
    comingSoon: true
  },
  {
    id: "news",
    title: "Learning News",
    description: "Stay updated with educational content daily",
    icon: <Newspaper className="h-6 w-6" />,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    id: "community",
    title: "Study Groups",
    description: "Connect with learners around the world",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "bg-teal-500/10 text-teal-500",
    comingSoon: true
  }
]

export default function MorePage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-8 text-center">
            <MoreHorizontal className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">More Learning Tools</h1>
            <p className="text-muted-foreground">
              Discover additional ways to enhance your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                disabled={feature.comingSoon}
                className={`p-6 rounded-lg border border-border hover:border-primary transition-all text-left group relative ${
                  feature.comingSoon ? "opacity-60 cursor-not-allowed" : "hover:bg-accent/50"
                }`}
              >
                {feature.comingSoon && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-muted text-xs rounded-full">
                    Coming Soon
                  </div>
                )}
                
                <div className={`p-3 rounded-lg ${feature.color} w-fit mb-4`}>
                  {feature.icon}
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg border border-primary/20 bg-primary/5 text-center">
            <h3 className="text-lg font-semibold mb-2">Have an idea?</h3>
            <p className="text-muted-foreground mb-4">
              We're always looking for new ways to make learning better. Share your ideas with us!
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}