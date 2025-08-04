import { Tool } from './types'
import { academicSearchTool } from './academic-search'
import { webSearchTool } from './web-search'
import { calculatorTool } from './calculator'

export const tools: Record<string, Tool> = {
  academic_search: academicSearchTool,
  web_search: webSearchTool,
  calculator: calculatorTool,
}

export function getTool(name: string): Tool | undefined {
  return tools[name]
}

export function getAllTools(): Tool[] {
  return Object.values(tools)
}

export * from './types'