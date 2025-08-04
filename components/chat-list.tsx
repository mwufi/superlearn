"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import { Chat, loadChats, deleteChat } from "@/lib/chat-storage"
import { motion, AnimatePresence } from "framer-motion"

interface ChatListProps {
  currentChatId?: string
  onNewChat?: () => void
}

export function ChatList({ currentChatId, onNewChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadedChats = loadChats()
    setChats(loadedChats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))
  }, [pathname]) // Reload when pathname changes

  const handleSelectChat = (chatId: string) => {
    // Navigate to the chat
    const currentPath = pathname.split('/')[1] // Get the current section (explain, structured, etc)
    router.push(`/${currentPath}?chat=${chatId}`)
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    if (confirm("Delete this chat?")) {
      deleteChat(chatId)
      setChats(chats.filter(c => c.id !== chatId))
      if (currentChatId === chatId && onNewChat) {
        onNewChat()
      }
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Recent Chats
        </h3>
        <button
          onClick={onNewChat}
          className="p-1 hover:bg-accent rounded transition-colors"
          title="New chat"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      
      <div className="space-y-1 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {chats.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No chats yet
            </p>
          ) : (
            chats.map((chat, index) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full group flex items-start gap-2 p-2 rounded-lg hover:bg-accent transition-colors text-left ${
                  currentChatId === chat.id ? 'bg-accent' : ''
                }`}
              >
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(chat.updatedAt)} · {chat.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}