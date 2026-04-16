import { useState, useCallback } from 'react'
import { analyzeDocument } from '../services/groqApi'
import { buildAnalysisPrompt, buildGrammarCorrectionPrompt } from '../services/prompts'
import DocumentClassifier from '../ml/DocumentClassifier'
import WritingScorer from '../ml/WritingScorer'
import ReadabilityModel from '../ml/ReadabilityModel'
import IntentAligner from '../ml/IntentAligner'
import PatternAnalyzer from '../ml/PatternAnalyzer'
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
      // 1. Run Local ML Document Classification
      const classificationData = DocumentClassifier.classify(document)

      const adjustedDomain = classificationData.domain || domain
      const enrichedGoal = `${goal}. Note: This document appears to be a ${classificationData.document_type || 'document'} aimed at a ${classificationData.audience || 'general'} audience.`

      // Execute Local Analytical Models
      const audienceAlignmentData = ReadabilityModel.evaluate(document, goal)
      const intentAlignmentData = IntentAligner.evaluate(document, adjustedDomain)
      const learningProfileData = PatternAnalyzer.evaluate(document)

      // 2. Run Deterministic Grammar Pipeline (LLM)
      let grammarData = null
      const analysisDocument = document // Ensure pristine data isn't corrupted
      try {
        const grammarPrompt = buildGrammarCorrectionPrompt(document)
        grammarData = await analyzeDocument(null, document, adjustedDomain, grammarPrompt)
        
        // Remove the dangerous pipeline overwrite. Grammar LLM can sometimes hallucinate
        // the prompt instructions. We do not want to feed a hallucinated prompt into 
        // the Main Analytics LLM.
      } catch (e) {
        console.warn('Deterministic Grammar Model failed', e)
      }

      // Calculate brutal math heuristics FIRST
      const scoringData = WritingScorer.evaluate(document)

      // 3. Run Main Analysis with Pristine Data (anchoring AI explanations to strict math)
      const prompt = buildAnalysisPrompt(analysisDocument, adjustedDomain, enrichedGoal, scoringData)
      const data = await analyzeDocument(null, analysisDocument, adjustedDomain, prompt)
      
      // Inject pipelined metadata into final results
      data.classification = classificationData
      data.grammarStats = grammarData
      data.audienceAlignment = audienceAlignmentData
      data.intentAlignment = intentAlignmentData
      data.learningProfile = learningProfileData

      // We scale the 0-20 dimensions by x5 to plot beautifully on the 0-100 UI Radar chart
      data.scores = {
        clarity: scoringData.clarity * 5,
        coherence: scoringData.coherence * 5,
        grammar: scoringData.grammar * 5,
        vocabulary: scoringData.vocabulary * 5,
        structure: scoringData.structure * 5
      }
      
      // The overall score is securely the sum of the strict 0-20 heuristics
      data.overallScore = scoringData.overall_score
      data.confidence = Math.round(scoringData.confidence * 100)

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
