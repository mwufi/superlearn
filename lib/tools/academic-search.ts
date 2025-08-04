import { Tool, ToolResult } from './types'

export const academicSearchTool: Tool = {
  name: 'academic_search',
  description: 'Search for peer-reviewed academic papers and research',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query for academic papers'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return',
        default: 5
      }
    },
    required: ['query']
  },
  
  async execute(params: { query: string; limit?: number }): Promise<ToolResult> {
    try {
      const response = await fetch('/api/tools/academic-search', {
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
          sources: data.sources,
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