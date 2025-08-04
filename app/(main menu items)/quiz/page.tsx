"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ChatInput } from "@/components/ui/chat-input"
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizState {
  topic: string
  questions: Question[]
  currentQuestion: number
  answers: number[]
  showResults: boolean
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateQuiz = async (topic: string) => {
    setIsGenerating(true)
    
    // TODO: Call API to generate quiz
    setTimeout(() => {
      setQuizState({
        topic,
        questions: [
          {
            id: "1",
            question: "What is the primary purpose of React hooks?",
            options: [
              "To style components",
              "To manage state and side effects in functional components",
              "To create class components",
              "To handle routing"
            ],
            correctAnswer: 1,
            explanation: "React hooks allow functional components to use state and other React features without writing a class."
          },
          {
            id: "2",
            question: "Which hook is used to perform side effects in React?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: 1,
            explanation: "useEffect is the hook designed to handle side effects like data fetching, subscriptions, or DOM updates."
          },
          {
            id: "3",
            question: "What does the dependency array in useEffect control?",
            options: [
              "The order of effects",
              "When the effect runs",
              "The return value",
              "The component props"
            ],
            correctAnswer: 1,
            explanation: "The dependency array determines when the effect should re-run based on value changes."
          }
        ],
        currentQuestion: 0,
        answers: [],
        showResults: false
      })
      setIsGenerating(false)
    }, 2000)
  }

  const handleAnswer = (answerIndex: number) => {
    if (!quizState) return

    const newAnswers = [...quizState.answers, answerIndex]
    
    if (quizState.currentQuestion === quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        answers: newAnswers,
        showResults: true
      })
    } else {
      setQuizState({
        ...quizState,
        answers: newAnswers,
        currentQuestion: quizState.currentQuestion + 1
      })
    }
  }

  const calculateScore = () => {
    if (!quizState) return 0
    return quizState.answers.filter((answer, index) => 
      answer === quizState.questions[index].correctAnswer
    ).length
  }

  const resetQuiz = () => {
    setQuizState(null)
  }

  const quickQuizTopics = [
    "JavaScript Basics",
    "Python Programming",
    "World History",
    "Basic Mathematics",
    "English Grammar",
    "General Science"
  ]

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {!quizState && !isGenerating && (
              <div className="space-y-8">
                <div className="text-center">
                  <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-2">Quiz Time</h1>
                  <p className="text-muted-foreground">
                    Test your knowledge with AI-generated quizzes
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Popular quiz topics:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickQuizTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleGenerateQuiz(topic)}
                        className="p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <HelpCircle className="h-12 w-12 text-primary" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Generating your quiz...</p>
              </div>
            )}

            {quizState && !quizState.showResults && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={quizState.currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">
                      Question {quizState.currentQuestion + 1} of {quizState.questions.length}
                    </p>
                    <div className="w-full bg-muted h-2 rounded-full mt-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((quizState.currentQuestion + 1) / quizState.questions.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      {quizState.questions[quizState.currentQuestion].question}
                    </h2>
                    
                    <div className="space-y-3">
                      {quizState.questions[quizState.currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="w-full p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-accent transition-all"
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>{" "}
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {quizState?.showResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-lg">
                    You scored {calculateScore()} out of {quizState.questions.length}
                  </p>
                </div>

                <div className="space-y-4">
                  {quizState.questions.map((question, index) => (
                    <div 
                      key={question.id}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-start gap-3">
                        {quizState.answers[index] === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Your answer: {question.options[quizState.answers[index]]}
                          </p>
                          {quizState.answers[index] !== question.correctAnswer && (
                            <p className="text-sm text-green-600 mb-2">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Take Another Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {!quizState && (
          <div className="border-t border-border p-6">
            <div className="max-w-3xl mx-auto">
              <ChatInput 
                onSubmit={handleGenerateQuiz}
                placeholder="What topic would you like to be quizzed on?"
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}