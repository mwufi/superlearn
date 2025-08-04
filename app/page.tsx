"use client"

import { MainLayout } from "@/components/main-layout"
import { ChatInput } from "@/components/ui/chat-input"
import { Sparkles, Brain, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  
  const handleSubmit = (message: string) => {
    console.log("Message submitted:", message)
    // TODO: Handle message submission
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl w-full space-y-8 text-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to Superlearn</h1>
              <p className="text-muted-foreground text-lg">
                Your AI-powered learning companion. Ask anything, learn everything.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <button 
                onClick={() => router.push('/explain')}
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                <Sparkles className="h-5 w-5 mb-2 text-primary" />
                <h3 className="font-medium">Quick Explain</h3>
                <p className="text-sm text-muted-foreground">Get simple explanations</p>
              </button>
              
              <button 
                onClick={() => router.push('/structured')}
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                <Brain className="h-5 w-5 mb-2 text-primary" />
                <h3 className="font-medium">Build Curriculum</h3>
                <p className="text-sm text-muted-foreground">Structured learning paths</p>
              </button>
              
              <button 
                onClick={() => router.push('/quiz')}
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                <HelpCircle className="h-5 w-5 mb-2 text-primary" />
                <h3 className="font-medium">Take a Quiz</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto">
          <ChatInput 
            onSubmit={handleSubmit}
            placeholder="What would you like to learn today?"
          />
        </div>
      </div>
    </MainLayout>
  )
}
