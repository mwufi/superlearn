import { ToolCall } from './tools/types'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCall[]
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    model?: string
    temperature?: number
    [key: string]: any
  }
}

export interface AgentState {
  chatId: string
  currentStep: number
  totalSteps: number
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed'
  context: Record<string, any>
  checkpoints: Array<{
    step: number
    timestamp: Date
    state: Record<string, any>
  }>
}

// Local storage keys
const CHATS_KEY = 'superlearn_chats'
const AGENT_STATES_KEY = 'superlearn_agent_states'

// Chat functions
export function saveChat(chat: Chat): void {
  if (typeof window === 'undefined') return
  
  const chats = loadChats()
  const index = chats.findIndex(c => c.id === chat.id)
  
  if (index >= 0) {
    chats[index] = chat
  } else {
    chats.push(chat)
  }
  
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
}

export function loadChats(): Chat[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(CHATS_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored).map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }))
  } catch {
    return []
  }
}

export function loadChat(id: string): Chat | null {
  const chats = loadChats()
  return chats.find(c => c.id === id) || null
}

export function deleteChat(id: string): void {
  if (typeof window === 'undefined') return
  
  const chats = loadChats()
  const filtered = chats.filter(c => c.id !== id)
  localStorage.setItem(CHATS_KEY, JSON.stringify(filtered))
}

export function createNewChat(title?: string): Chat {
  return {
    id: `chat-${Date.now()}`,
    title: title || 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function addMessageToChat(chatId: string, message: Message): void {
  const chat = loadChat(chatId)
  if (!chat) return
  
  chat.messages.push(message)
  chat.updatedAt = new Date()
  
  // Auto-generate title from first user message if needed
  if (chat.title === 'New Chat' && message.role === 'user' && chat.messages.length === 1) {
    chat.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
  }
  
  saveChat(chat)
}

// Agent state functions
export function saveAgentState(state: AgentState): void {
  if (typeof window === 'undefined') return
  
  const states = loadAgentStates()
  const index = states.findIndex(s => s.chatId === state.chatId)
  
  if (index >= 0) {
    states[index] = state
  } else {
    states.push(state)
  }
  
  localStorage.setItem(AGENT_STATES_KEY, JSON.stringify(states))
}

export function loadAgentStates(): AgentState[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(AGENT_STATES_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored).map((state: any) => ({
      ...state,
      checkpoints: state.checkpoints.map((cp: any) => ({
        ...cp,
        timestamp: new Date(cp.timestamp)
      }))
    }))
  } catch {
    return []
  }
}

export function loadAgentState(chatId: string): AgentState | null {
  const states = loadAgentStates()
  return states.find(s => s.chatId === chatId) || null
}

export function deleteAgentState(chatId: string): void {
  if (typeof window === 'undefined') return
  
  const states = loadAgentStates()
  const filtered = states.filter(s => s.chatId !== chatId)
  localStorage.setItem(AGENT_STATES_KEY, JSON.stringify(filtered))
}

export function createCheckpoint(state: AgentState): void {
  state.checkpoints.push({
    step: state.currentStep,
    timestamp: new Date(),
    state: { ...state.context }
  })
  saveAgentState(state)
}