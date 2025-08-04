"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, Calculator, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { ToolCall } from "@/lib/tools/types"

interface ToolExecutionProps {
  toolCalls: ToolCall[]
}

const toolIcons: Record<string, React.ReactNode> = {
  academic_search: <Search className="h-4 w-4" />,
  web_search: <Globe className="h-4 w-4" />,
  calculator: <Calculator className="h-4 w-4" />
}

export function ToolExecution({ toolCalls }: ToolExecutionProps) {
  if (toolCalls.length === 0) return null

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {toolCalls.map((call) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex-shrink-0">
              {call.status === 'pending' && (
                <div className="text-muted-foreground">
                  {toolIcons[call.tool] || <Loader2 className="h-4 w-4" />}
                </div>
              )}
              {call.status === 'running' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-primary"
                >
                  <Loader2 className="h-4 w-4" />
                </motion.div>
              )}
              {call.status === 'completed' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {call.status === 'failed' && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {call.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {call.status === 'pending' && 'Waiting...'}
                {call.status === 'running' && 'Processing...'}
                {call.status === 'completed' && call.result?.metadata?.duration && 
                  `Completed in ${call.result.metadata.duration}ms`}
                {call.status === 'failed' && (call.result?.error || 'Failed')}
              </p>
            </div>
            
            {call.result?.metadata?.sources && (
              <div className="flex-shrink-0 text-xs text-muted-foreground">
                {call.result.metadata.sources.length} sources
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}