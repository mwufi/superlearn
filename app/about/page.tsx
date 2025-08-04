"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | Superlearn"
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <nav className="mb-16">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            ← back to home
          </Link>
        </nav>

        <div className="space-y-8">
          <h1 className="text-2xl font-light text-gray-900">about superlearn</h1>
          
          <div className="text-lg text-gray-700 space-y-6 leading-relaxed">
            <p>
              We're building a tool for you to learn anything. To search the bounds of human knowledge & figure things out for you. Agentic learning. Built for the best.
            </p>

            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4">Our Vision</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">1. Source → Learning Goals → Customizable Curriculum</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>AI scans the source material (e.g., this neuroscience paper).</li>
                    <li>Generates a "Learning Goals" map: "By the end, you'll understand…" (e.g., vapor self-administration, reinforcement schedules, sex differences in addiction, experimental design).</li>
                    <li>Organizes as a navigable curriculum tree/graph (NOT just linear) that users can:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Expand for details ("What's a fixed ratio?")</li>
                        <li>Collapse/hide less relevant branches</li>
                        <li>Reorder, bookmark, or request new goals ("Add 'neurobiological basis of reinforcement'")</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">2. Concept Map, Not Just a Linear Path</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>Clickable, web-like map: Every topic/node can be clicked to:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Zoom in ("Deep Dive: Preclinical animal models")</li>
                        <li>Zoom out ("How does this fit into addiction science?")</li>
                        <li>Jump to related nodes ("THC vapor in rats" → "THC metabolism in humans")</li>
                      </ul>
                    </li>
                    <li>Contextual breadcrumbs: Always see "where you are" and "how you got here."</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">3. Dynamic, On-Demand Deep Dives</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>Every node has:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Core summary</li>
                        <li>Links to primary sources or figures</li>
                        <li>Option for "Explain Like I'm 5", "Show Details", or "Give Me a Real-World Example"</li>
                      </ul>
                    </li>
                    <li>Optional "See context"/"See prerequisites": ("Wait, what is 'operant conditioning'? → Click to drill down")</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">4. Active Practice & Feedback</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>Micro-quizzes: After any concept, try a 2-question check ("What does FR5 mean?").</li>
                    <li>Socratic prompts: "Why do you think pre-exposure mattered for the rats?"</li>
                    <li>Instant feedback: Not just right/wrong, but:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Detailed correction, hints, or explanation</li>
                        <li>Scaffolded follow-up if you get stuck</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">5. Cross-Linking & Transfer</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>Every concept cross-references:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Other uploaded sources ("SSA in this compiler paper" ↔ "SSA in this superoptimizer paper")</li>
                        <li>General foundational knowledge ("SSA" node links to a general "Compiler Concepts" topic)</li>
                      </ul>
                    </li>
                    <li>Allows transfer: See how a concept works in other contexts or fields.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">6. Interface and UX</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                    <li>Main screen: Interactive concept map (nodes = concepts, edges = dependencies/relationships).</li>
                    <li>Click node: Side panel pops up with summary, quiz, "deeper dive," links to paper, and related concepts.</li>
                    <li>Navigation bar: "Home," "My Learning Goals," "Bookmarks," "Recent Activity."</li>
                    <li>Feedback panel: AI comments on your answers in real time, with suggested resources or next steps.</li>
                    <li>User controls: Search bar, progress tracker, export options, history/back button, meta-layer to see your learning journey.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4">Current State</h2>
              <p className="text-gray-600">
                What we have now: Text → Curriculum. But it doesn't generate the curriculum well - and not entirely in the cloud either! We'll probably need to change that, so that it can run agents well.
              </p>
              <p className="text-gray-600 mt-4">
                We want to build something that takes a paper & analyzes it. The best fit for that is probably Gemini!
              </p>
            </div>

            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4">Future Functionality</h2>
              <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                <li>Create a new space</li>
                <li>Upload files to it → The AI will run over it & you'll get your results</li>
                <li>You can leave the page, even</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4">Minimum Viable Agent Set (for MVP)</h2>
              <p className="text-gray-600 mb-3">If you want to launch a prototype, focus first on:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-gray-600">
                <li>Source Analysis Agent</li>
                <li>Curriculum Designer Agent</li>
                <li>Interactive Tutor Agent</li>
                <li>Assessment & Personalization Agent</li>
              </ol>
              <p className="text-gray-600 mt-3">Add the Deep Dive and Meta-Map agents as you scale.</p>
            </div>

            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4">Example Interaction: All Agents in Action</h2>
              <ul className="list-disc list-inside ml-4 space-y-2 text-gray-600">
                <li>User uploads a paper → Source Analysis Agent breaks it down</li>
                <li>Curriculum Designer Agent proposes a concept map/learning path</li>
                <li>Interactive Tutor Agent begins teaching, adapting based on student interaction</li>
                <li>Assessment Agent gives micro-quizzes and tracks understanding</li>
                <li>If user gets stuck, Deep Dive Agent jumps in</li>
                <li>Meta-Map Agent lets the user see their knowledge network and progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}