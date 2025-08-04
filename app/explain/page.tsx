"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ChatInput } from "@/components/ui/chat-input"
import { Sparkles, Lightbulb, Zap, Smile } from "lucide-react"
import { motion } from "framer-motion"

export default function ExplainPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }])
    setIsLoading(true)
    
    // TODO: Call AI API for explanation
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'll explain that in a fun and easy way! This is where the AI explanation would go..." 
      }])
      setIsLoading(false)
    }, 1000)
  }

  const examplePrompts = [
    { icon: <Lightbulb className="h-4 w-4" />, text: "Why is the sky blue?" },
    { icon: <Zap className="h-4 w-4" />, text: "How does electricity work?" },
    { icon: <Smile className="h-4 w-4" />, text: "Explain quantum physics like I'm 5" },
  ]

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Explain to Me</h1>
              <p className="text-muted-foreground">
                Get simple, fun explanations for anything you're curious about
              </p>
            </div>

            {messages.length === 0 && (
              <div className="grid gap-3 mb-8">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Try one of these examples:
                </p>
                {examplePrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubmit(prompt.text)}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                  >
                    <span className="text-primary">{prompt.icon}</span>
                    <span>{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto max-w-[80%]" 
                      : "bg-muted max-w-[80%]"
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  <span>Thinking of a fun explanation...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border p-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput 
              onSubmit={handleSubmit}
              placeholder="What would you like me to explain?"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}