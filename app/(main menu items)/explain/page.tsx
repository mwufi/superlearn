"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { ChatInput } from "@/components/ui/chat-input"
import { PromptEditor } from "@/components/prompt-editor"
import { ToolExecution } from "@/components/tool-execution"
import { Sparkles, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import LoadingSpinner from "./LoadingSpinner"
import { 
  Chat, 
  Message, 
  createNewChat, 
  loadChat, 
  saveChat, 
  addMessageToChat 
} from "@/lib/chat-storage"
import { ToolCall } from "@/lib/tools/types"
import { getTool } from "@/lib/tools"

export default function ExplainPage() {
  const searchParams = useSearchParams()
  const chatId = searchParams.get('chat')
  
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([])

  // Load or create chat
  useEffect(() => {
    if (chatId) {
      const chat = loadChat(chatId)
      if (chat) {
        setCurrentChat(chat)
        setMessages(chat.messages)
      }
    } else {
      const newChat = createNewChat("Explain Session")
      setCurrentChat(newChat)
      setMessages([])
    }
  }, [chatId])

  const handlePromptSelect = async (prompt: string, variables: Record<string, string>) => {
    if (!currentChat) return
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    addMessageToChat(currentChat.id, userMessage)
    setShowPromptEditor(false)
    setIsLoading(true)
    
    // Simulate tool execution
    const toolCall: ToolCall = {
      id: `tool-${Date.now()}`,
      tool: 'academic_search',
      parameters: { query: variables.topic || prompt, limit: 3 },
      status: 'pending'
    }
    
    setActiveToolCalls([toolCall])
    
    // Execute tool
    setTimeout(async () => {
      toolCall.status = 'running'
      setActiveToolCalls([{ ...toolCall }])
      
      const tool = getTool('academic_search')
      if (tool) {
        const result = await tool.execute(toolCall.parameters)
        toolCall.status = result.success ? 'completed' : 'failed'
        toolCall.result = result
        toolCall.completedAt = new Date()
        setActiveToolCalls([{ ...toolCall }])
      }
      
      // Generate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `I'll explain ${variables.topic || 'that'} in a simple way! Based on my research, here's what you need to know...`,
          toolCalls: [toolCall],
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        addMessageToChat(currentChat.id, assistantMessage)
        setIsLoading(false)
        setActiveToolCalls([])
      }, 1000)
    }, 500)
  }

  const handleDirectSubmit = async (message: string) => {
    handlePromptSelect(message, { topic: message })
  }

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
              <button
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <Settings className="h-3 w-3" />
                Customize Prompt
              </button>
            </div>

            <AnimatePresence>
              {showPromptEditor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 rounded-lg border border-border bg-background"
                >
                  <PromptEditor onSelectTemplate={handlePromptSelect} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                      : "bg-muted max-w-[80%]"
                  }`}
                >
                  {message.content}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <ToolExecution toolCalls={message.toolCalls} />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <>
                  {activeToolCalls.length > 0 && (
                    <div className="max-w-[80%]">
                      <ToolExecution toolCalls={activeToolCalls} />
                    </div>
                  )}
                  <LoadingSpinner />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSubmit={handleDirectSubmit}
              placeholder="What would you like me to explain?"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}