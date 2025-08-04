import { Tool, ToolResult } from './types'

export const webSearchTool: Tool = {
  name: 'web_search',
  description: 'Search the web for current information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results',
        default: 5
      }
    },
    required: ['query']
  },
  
  async execute(params: { query: string; limit?: number }): Promise<ToolResult> {
    try {
      const response = await fetch('/api/tools/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        success: true,
        data: data.results,
        metadata: {
          duration: data.duration,
          totalResults: data.totalResults
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}