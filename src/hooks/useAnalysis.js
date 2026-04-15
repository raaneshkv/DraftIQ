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

  const analyze = useCallback(async (document, domain, goal) => {
    setState('analyzing')
    setError(null)
    setResults(null)
    setVisibleSections([])

    try {
      const prompt = buildAnalysisPrompt(document, domain, goal)
      const data = await analyzeDocument(null, document, domain, prompt)

      // Score Math calculation
      const { clarity = 0, structure = 0, impact = 0, grammar = 0, vocabulary = 0, relevance = 0 } = data.scores || {}
      const computedScore = Math.round(
        0.25 * clarity +
        0.20 * structure +
        0.20 * impact +
        0.15 * grammar +
        0.10 * vocabulary +
        0.10 * relevance
      )
      data.overallScore = computedScore

      // Fetch history for previous score
      try {
        const storedHistory = JSON.parse(localStorage.getItem(
          // Fetch from current valid storage matching AuthContext if possible, safely grab last
          localStorage.getItem('draftiq_user') ? `draftiq_history_${JSON.parse(localStorage.getItem('draftiq_user')).email}` : 'draftiq_history_guest'
        ) || '[]')
        if (storedHistory.length > 0) {
          data.previousScore = storedHistory[storedHistory.length - 1].overallScore
        }
      } catch (e) {
        // ignore
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
