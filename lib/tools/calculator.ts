import { Tool, ToolResult } from './types'

export const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate (e.g., "2 + 2 * 3")'
      }
    },
    required: ['expression']
  },
  
  async execute(params: { expression: string }): Promise<ToolResult> {
    try {
      // For security, we should use a proper math parser in production
      // This is a simplified example
      const response = await fetch('/api/tools/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Calculation failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        success: true,
        data: data.result,
        metadata: {
          expression: params.expression,
          steps: data.steps
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