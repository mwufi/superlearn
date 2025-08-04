import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { query, limit = 5 } = await req.json()
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Use Perplexity API for academic search
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY
    
    if (!PERPLEXITY_API_KEY) {
      // Fallback to mock data if no API key
      return NextResponse.json({
        results: [
          {
            title: "Sample Academic Paper on " + query,
            authors: ["Dr. Smith", "Dr. Johnson"],
            year: 2024,
            abstract: "This is a sample abstract for the academic search query...",
            url: "https://example.com/paper1",
            citations: 42
          }
        ],
        duration: 100,
        sources: ["Mock Database"],
        totalResults: 1
      })
    }

    const startTime = Date.now()
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an academic search assistant. Format your response as JSON with an array of papers.'
          },
          {
            role: 'user',
            content: `Find ${limit} peer-reviewed academic papers about: ${query}. Return as JSON with title, authors, year, abstract, url, and citations.`
          }
        ],
        search_filter: 'academic'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Perplexity API')
    }

    const data = await response.json()
    const duration = Date.now() - startTime

    // Parse the response and extract papers
    // This is simplified - in production you'd want more robust parsing
    const content = data.choices[0].message.content
    let papers = []
    
    try {
      papers = JSON.parse(content).papers || []
    } catch {
      // Fallback parsing if not valid JSON
      papers = [{
        title: query,
        abstract: content,
        authors: ["Various"],
        year: new Date().getFullYear(),
        url: "#",
        citations: 0
      }]
    }

    return NextResponse.json({
      results: papers.slice(0, limit),
      duration,
      sources: ['Perplexity Academic Search'],
      totalResults: papers.length
    })
    
  } catch (error) {
    console.error('Academic search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform academic search' },
      { status: 500 }
    )
  }
}