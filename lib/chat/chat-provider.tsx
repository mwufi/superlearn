"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatConfig, ChatToolConfig } from './chat-config'
import { 
  Chat as ChatType, 
  Message,
  createNewChat,
  saveChat,
  loadChat,
  addMessageToChat 
} from '../chat-storage'
import { ToolCall } from '../tools/types'

interface ChatContextValue {
  // Chat state
  messages: any[]
  isLoading: boolean
  error?: Error
  
  // Chat management
  currentChat: ChatType | null
  chatConfig: ChatConfig
  
  // Actions
  sendMessage: (content: string) => void
  addToolResult: (result: any) => void
  clearMessages: () => void
  createNewChatSession: () => void
  loadChatSession: (chatId: string) => void
  
  // Tool execution
  activeToolCalls: ToolCall[]
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: React.ReactNode
  config: ChatConfig
  chatId?: string
  onChatCreated?: (chat: ChatType) => void
}

export function ChatProvider({ 
  children, 
  config, 
  chatId,
  onChatCreated 
}: ChatProviderProps) {
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null)
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([])
  
  // Initialize AI SDK chat
  const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading, error } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${config.id}`,
    }),
    
    // System prompt
    initialMessages: [{
      id: 'system',
      role: 'system',
      content: config.systemPrompt
    }],
    
    // Handle tool calls
    async onToolCall({ toolCall }) {
      const toolConfig = config.tools.find(t => t.name === toolCall.toolName)
      
      if (toolConfig?.execute) {
        // Execute client-side tool
        try {
          const result = await toolConfig.execute(toolCall.args)
          addToolResult({
            toolCallId: toolCall.toolCallId,
            result,
          })
        } catch (error) {
          addToolResult({
            toolCallId: toolCall.toolCallId,
            result: { error: error.message },
          })
        }
      }
    },
    
    // Save messages to storage
    onFinish(message) {
      if (currentChat) {
        const storageMessage: Message = {
          id: message.id,
          role: message.role as any,
          content: message.content,
          timestamp: new Date(),
          toolCalls: message.toolInvocations?.map(ti => ({
            id: ti.toolCallId,
            tool: ti.toolName,
            parameters: ti.args,
            status: 'completed' as const,
            result: ti.result
          }))
        }
        addMessageToChat(currentChat.id, storageMessage)
      }
    }
  })
  
  // Load or create chat
  useEffect(() => {
    if (chatId) {
      const chat = loadChat(chatId)
      if (chat) {
        setCurrentChat(chat)
        // TODO: Load messages into AI SDK chat
      }
    } else {
      const newChat = createNewChat(`${config.name} Session`)
      setCurrentChat(newChat)
      saveChat(newChat)
      onChatCreated?.(newChat)
    }
  }, [chatId, config.name, onChatCreated])
  
  const sendMessage = (content: string) => {
    if (!currentChat) return
    
    // Save user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }
    addMessageToChat(currentChat.id, userMessage)
    
    // Send to AI
    handleSubmit({ preventDefault: () => {} } as any, { data: { text: content } })
  }
  
  const createNewChatSession = () => {
    const newChat = createNewChat(`${config.name} Session`)
    setCurrentChat(newChat)
    saveChat(newChat)
    onChatCreated?.(newChat)
    // Clear AI SDK messages
    // TODO: Implement clear functionality
  }
  
  const loadChatSession = (chatId: string) => {
    const chat = loadChat(chatId)
    if (chat) {
      setCurrentChat(chat)
      // TODO: Load messages into AI SDK
    }
  }
  
  const clearMessages = () => {
    // TODO: Implement clear messages
  }
  
  const value: ChatContextValue = {
    messages,
    isLoading,
    error,
    currentChat,
    chatConfig: config,
    sendMessage,
    addToolResult,
    clearMessages,
    createNewChatSession,
    loadChatSession,
    activeToolCalls
  }
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}