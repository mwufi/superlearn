export interface Tool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
  execute: (params: any) => Promise<ToolResult>
}

export interface ToolResult {
  success: boolean
  data?: any
  error?: string
  metadata?: {
    duration?: number
    sources?: string[]
    [key: string]: any
  }
}

export interface ToolCall {
  id: string
  tool: string
  parameters: any
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: ToolResult
  startedAt?: Date
  completedAt?: Date
}