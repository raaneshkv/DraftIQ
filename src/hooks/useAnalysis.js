import { useState, useCallback } from 'react'
import { analyzeDocument } from '../services/groqApi'
import { buildAnalysisPrompt } from '../services/prompts'
import { useApp } from '../App'

export function useAnalysis() {
  const { addToHistory } = useApp()
  const [state, setState] = useState('idle') // idle | analyzing | results | error
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [visibleSections, setVisibleSections] = useState([])

  const analyze = useCallback(async (document, domain) => {
    setState('analyzing')
    setError(null)
    setResults(null)
    setVisibleSections([])

    try {
      const prompt = buildAnalysisPrompt(document, domain)
      const data = await analyzeDocument(null, document, domain, prompt)

      // Set previous score from history
      const storedHistory = JSON.parse(localStorage.getItem('draftiq_history') || '[]')
      if (storedHistory.length > 0) {
        data.previousScore = storedHistory[storedHistory.length - 1].overallScore
      }

      setResults(data)
      addToHistory({ overallScore: data.overallScore, domain, scores: data.scores })

      // Streaming effect: reveal sections one by one
      const sectionOrder = ['score', 'radar', 'sections', 'issues', 'corrections', 'beforeAfter', 'checklist', 'learning']
      for (let i = 0; i < sectionOrder.length; i++) {
        await new Promise(r => setTimeout(r, 300))
        setVisibleSections(prev => [...prev, sectionOrder[i]])
      }

      setState('results')
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
      setState('error')
    }
  }, [addToHistory])

  const reset = useCallback(() => {
    setState('idle')
    setResults(null)
    setError(null)
    setVisibleSections([])
  }, [])

  return { state, results, error, visibleSections, analyze, reset }
}
