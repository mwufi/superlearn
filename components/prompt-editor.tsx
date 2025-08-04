"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit2, Save, X, Plus, Trash2, FileText } from "lucide-react"
import { 
  PromptTemplate, 
  extractVariables, 
  fillTemplate,
  savePromptTemplate,
  loadPromptTemplates,
  deletePromptTemplate,
  DEFAULT_PROMPTS
} from "@/lib/prompt-templates"

interface PromptEditorProps {
  onSelectTemplate: (template: string, variables: Record<string, string>) => void
  initialValue?: string
}

export function PromptEditor({ onSelectTemplate, initialValue }: PromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [templateText, setTemplateText] = useState(initialValue || DEFAULT_PROMPTS.explain.template)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [templateName, setTemplateName] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    // Load templates from local storage and merge with defaults
    const storedTemplates = loadPromptTemplates()
    const defaultTemplatesList = Object.values(DEFAULT_PROMPTS)
    const mergedTemplates = [...defaultTemplatesList, ...storedTemplates]
    setTemplates(mergedTemplates)
    
    // Set initial template
    setSelectedTemplate(DEFAULT_PROMPTS.explain)
  }, [])

  const handleTemplateChange = (text: string) => {
    setTemplateText(text)
    const variables = extractVariables(text)
    const newValues: Record<string, string> = {}
    variables.forEach(v => {
      newValues[v] = variableValues[v] || ""
    })
    setVariableValues(newValues)
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name")
      return
    }

    const newTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      template: templateText,
      variables: extractVariables(templateText),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    }

    savePromptTemplate(newTemplate)
    setTemplates([...templates.filter(t => !t.isDefault), newTemplate, ...templates.filter(t => t.isDefault)])
    setSelectedTemplate(newTemplate)
    setTemplateName("")
    setIsEditing(false)
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deletePromptTemplate(id)
      setTemplates(templates.filter(t => t.id !== id))
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(DEFAULT_PROMPTS.explain)
        setTemplateText(DEFAULT_PROMPTS.explain.template)
      }
    }
  }

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setTemplateText(template.template)
    handleTemplateChange(template.template)
    setShowTemplates(false)
  }

  const handleSubmit = () => {
    const filledPrompt = fillTemplate(templateText, variableValues)
    onSelectTemplate(filledPrompt, variableValues)
  }

  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm">{selectedTemplate?.name || "Select template"}</span>
        </button>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title={isEditing ? "Cancel editing" : "Edit template"}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Template list */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-full max-w-md rounded-lg border border-border bg-background shadow-lg"
          >
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer group"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{template.name}</p>
                    {template.description && (
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                  {!template.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTemplate(template.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template editor */}
      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <textarea
              value={templateText}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Enter your prompt template. Use {{variable}} for dynamic values."
            />
            
            <div className="flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleSaveTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Variable inputs */}
            {extractVariables(templateText).map((variable) => (
              <div key={variable} className="space-y-1">
                <label className="text-sm text-muted-foreground capitalize">
                  {variable.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={variableValues[variable] || ""}
                  onChange={(e) => setVariableValues({
                    ...variableValues,
                    [variable]: e.target.value
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={`Enter ${variable}...`}
                />
              </div>
            ))}
            
            {/* Preview */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <p className="text-sm">{fillTemplate(templateText, variableValues)}</p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!Object.values(variableValues).every(v => v.trim())}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Use this prompt
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}