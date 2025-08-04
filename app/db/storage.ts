export interface Topic {
  id: string
  title: string
  description: string
  content?: {
    overview: string
    keyConcepts: string[]
    practicalExamples: string[]
    importantPoints: string[]
    exercises: string[]
  }
}

export interface Curriculum {
  id: string
  title: string
  topics: Topic[]
  createdAt: string
  updatedAt: string
}

export interface StoredContent {
  id: string
  curriculumId: string
  topicId: string
  content: {
    overview: string
    keyConcepts: string[]
    practicalExamples: string[]
    importantPoints: string[]
    exercises: string[]
  }
  createdAt: string
  updatedAt: string
}

const CURRICULA_KEY = 'curricula'
const CONTENT_KEY = 'content'

export const db = {
  curricula: {
    getAll: (): Curriculum[] => {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(CURRICULA_KEY)
      return data ? JSON.parse(data) : []
    },

    getById: (id: string): Curriculum | null => {
      const curricula = db.curricula.getAll()
      return curricula.find(c => c.id === id) || null
    },

    save: (curriculum: Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt'>): Curriculum => {
      const newCurriculum: Curriculum = {
        ...curriculum,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const curricula = db.curricula.getAll()
      curricula.push(newCurriculum)
      localStorage.setItem(CURRICULA_KEY, JSON.stringify(curricula))
      
      return newCurriculum
    },

    update: (id: string, updates: Partial<Curriculum>): Curriculum | null => {
      const curricula = db.curricula.getAll()
      const index = curricula.findIndex(c => c.id === id)
      
      if (index === -1) return null
      
      curricula[index] = {
        ...curricula[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(CURRICULA_KEY, JSON.stringify(curricula))
      return curricula[index]
    },

    delete: (id: string): boolean => {
      const curricula = db.curricula.getAll()
      const filtered = curricula.filter(c => c.id !== id)
      
      if (filtered.length === curricula.length) return false
      
      localStorage.setItem(CURRICULA_KEY, JSON.stringify(filtered))
      
      // Also delete associated content
      const allContent = db.content.getAll()
      const filteredContent = allContent.filter(c => c.curriculumId !== id)
      localStorage.setItem(CONTENT_KEY, JSON.stringify(filteredContent))
      
      return true
    }
  },

  content: {
    getAll: (): StoredContent[] => {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(CONTENT_KEY)
      return data ? JSON.parse(data) : []
    },

    getByTopicId: (curriculumId: string, topicId: string): StoredContent | null => {
      const allContent = db.content.getAll()
      return allContent.find(c => c.curriculumId === curriculumId && c.topicId === topicId) || null
    },

    save: (content: Omit<StoredContent, 'id' | 'createdAt' | 'updatedAt'>): StoredContent => {
      const existing = db.content.getByTopicId(content.curriculumId, content.topicId)
      
      if (existing) {
        return db.content.update(existing.id, { content: content.content })!
      }
      
      const newContent: StoredContent = {
        ...content,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const allContent = db.content.getAll()
      allContent.push(newContent)
      localStorage.setItem(CONTENT_KEY, JSON.stringify(allContent))
      
      return newContent
    },

    update: (id: string, updates: Partial<StoredContent>): StoredContent | null => {
      const allContent = db.content.getAll()
      const index = allContent.findIndex(c => c.id === id)
      
      if (index === -1) return null
      
      allContent[index] = {
        ...allContent[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(CONTENT_KEY, JSON.stringify(allContent))
      return allContent[index]
    },

    delete: (id: string): boolean => {
      const allContent = db.content.getAll()
      const filtered = allContent.filter(c => c.id !== id)
      
      if (filtered.length === allContent.length) return false
      
      localStorage.setItem(CONTENT_KEY, JSON.stringify(filtered))
      return true
    }
  }
}