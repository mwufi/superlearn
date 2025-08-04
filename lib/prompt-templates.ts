export interface PromptTemplate {
  id: string
  name: string
  template: string
  description?: string
  variables: string[]
  createdAt: Date
  updatedAt: Date
  isDefault?: boolean
}

export const DEFAULT_PROMPTS: Record<string, PromptTemplate> = {
  explain: {
    id: 'explain-default',
    name: 'Simple Explanation',
    template: 'Explain {{topic}} in simple terms',
    description: 'Get a straightforward explanation of any topic',
    variables: ['topic'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true
  },
  explainLike5: {
    id: 'explain-like-5',
    name: 'Explain Like I\'m 5',
    template: 'Explain {{topic}} like I\'m 5 years old',
    description: 'Get explanations suitable for young children',
    variables: ['topic'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true
  },
  explainWithAnalogy: {
    id: 'explain-analogy',
    name: 'Explain with Analogies',
    template: 'Explain {{topic}} using simple analogies and everyday examples',
    description: 'Understand complex topics through relatable comparisons',
    variables: ['topic'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true
  }
}

export function extractVariables(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g
  const variables: string[] = []
  let match
  
  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }
  
  return variables
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
    return values[variable] || match
  })
}

// Local storage functions
const STORAGE_KEY = 'superlearn_prompt_templates'

export function savePromptTemplates(templates: PromptTemplate[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  }
}

export function loadPromptTemplates(): PromptTemplate[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored).map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    }))
  } catch {
    return []
  }
}

export function savePromptTemplate(template: PromptTemplate): void {
  const templates = loadPromptTemplates()
  const index = templates.findIndex(t => t.id === template.id)
  
  if (index >= 0) {
    templates[index] = template
  } else {
    templates.push(template)
  }
  
  savePromptTemplates(templates)
}

export function deletePromptTemplate(id: string): void {
  const templates = loadPromptTemplates()
  const filtered = templates.filter(t => t.id !== id)
  savePromptTemplates(filtered)
}