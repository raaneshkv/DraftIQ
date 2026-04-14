import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../App'
import { useAnalysis } from '../hooks/useAnalysis'
import DomainSelector from '../components/Analyzer/DomainSelector'
import DocumentInput from '../components/Analyzer/DocumentInput'
import LoadingOverlay from '../components/Analyzer/LoadingOverlay'
import ScoreOverview from '../components/Results/ScoreOverview'
import RadarChartPanel from '../components/Results/RadarChart'
import SectionIntelligence from '../components/Results/SectionIntelligence'
import ImpactTable from '../components/Results/ImpactTable'
import GuidedCorrection from '../components/Results/GuidedCorrection'
import BeforeAfter from '../components/Results/BeforeAfter'
import ReviewChecklist from '../components/Results/ReviewChecklist'
import LearningProfile from '../components/Results/LearningProfile'
import { AlertCircle, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react'

export default function AnalyzerPage() {
  const [domain, setDomain] = useState('General')
  const { analysisHistory, apiKey, setShowApiModal, setHasAnalysis } = useApp()
  const { state, results, error, visibleSections, analyze, reset } = useAnalysis()

  useEffect(() => {
    setHasAnalysis(state === 'results' || (state === 'analyzing' && results !== null))
  }, [state, results, setHasAnalysis])

  const handleAnalyze = (text) => {
    // API key check moved to useAnalysis/groqApi
    analyze(text, domain)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6"
    >
      <LoadingOverlay visible={state === 'analyzing'} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {(state === 'idle' || state === 'error') && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary mb-4 tracking-tight drop-shadow-md">
                Document <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">Analyzer</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Paste your document below, select the domain, and let DraftIQ's AI provide
                comprehensive scoring and guided corrections.
              </p>
            </motion.div>

            <DomainSelector selected={domain} onChange={setDomain} />
            <DocumentInput onAnalyze={handleAnalyze} domain={domain} isAnalyzing={state === 'analyzing'} onSmartDetect={setDomain} />

            {/* Error state */}
            {state === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 card-elegant p-6 border-danger/50"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-danger mb-1">Analysis Failed</h4>
                    <p className="text-sm text-text-secondary mb-3">{error}</p>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-secondary hover:text-text-primary hover:border-brand/30 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try Again
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Results Dashboard Layout */}
        {(state === 'results' || (state === 'analyzing' && results)) && results && (
          <div className="space-y-8 relative z-10 w-full max-w-6xl mx-auto mt-8">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={reset}
              className="group flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              New Analysis
            </motion.button>

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              {visibleSections.includes('score') && (
                <div className="lg:col-span-8">
                  <ScoreOverview
                    overallScore={results.overallScore}
                    previousScore={results.previousScore}
                    confidence={results.confidence}
                  />
                </div>
              )}
              {visibleSections.includes('learning') && (
                <div className="lg:col-span-4">
                  <LearningProfile
                    learningProfile={results.learningProfile}
                    analysisHistory={analysisHistory}
                  />
                </div>
              )}
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              {visibleSections.includes('radar') && (
                <div className="lg:col-span-4">
                  <RadarChartPanel scores={results.scores} />
                </div>
              )}
              {visibleSections.includes('sections') && (
                <div className="lg:col-span-8">
                  <SectionIntelligence sections={results.sections} />
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="space-y-6">
              {visibleSections.includes('issues') && (
                <ImpactTable issues={results.issues} />
              )}

              {visibleSections.includes('beforeAfter') && (
                <BeforeAfter beforeAfter={results.beforeAfter} />
              )}

              {visibleSections.includes('corrections') && (
                <GuidedCorrection issues={results.issues} />
              )}

              {visibleSections.includes('checklist') && (
                <ReviewChecklist checklist={results.checklist} />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
