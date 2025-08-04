"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSubmit?: (message: string) => void
  placeholder?: string
  className?: string
}

export function ChatInput({ onSubmit, placeholder = "Ask anything...", className }: ChatInputProps) {
  const [value, setValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && onSubmit) {
      onSubmit(value.trim())
      setValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={false}
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn("relative w-full", className)}
    >
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px var(--ring), 0 4px 16px -2px rgba(0, 0, 0, 0.1)"
            : "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-end rounded-2xl bg-background border border-input overflow-hidden"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground min-h-[48px] max-h-[200px]"
          style={{ height: "auto" }}
        />
        <motion.button
          type="submit"
          disabled={!value.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "m-2 p-2 rounded-lg transition-colors",
            value.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </motion.form>
  )
}