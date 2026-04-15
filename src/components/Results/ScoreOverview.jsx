import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Shield, ChevronDown, CheckCircle2, ChevronRight, Calculator, FileText, Cpu } from 'lucide-react'

function getScoreColor(score) {
  if (score <= 40) return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
  if (score <= 65) return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
  return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' }
}

export default function ScoreOverview({ results }) {
  const { overallScore, previousScore, confidence, explainableAI, audienceAlignment, intentAlignment, writingStyle, documentType, benchmarking, scores } = results || {}
  
  const [displayScore, setDisplayScore] = useState(0)
  const [showFormula, setShowFormula] = useState(false)
  const [showExplainableAI, setShowExplainableAI] = useState(false)
  
  const animationRef = useRef()
  const color = getScoreColor(overallScore || 0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const startTime = Date.now()
    const target = overallScore || 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      setDisplayScore(current)
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [overallScore])

  const circumference = 2 * Math.PI * 80
  const strokeDashoffset = circumference - (displayScore / 100) * circumference
  const delta = previousScore ? overallScore - previousScore : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elegant p-8 h-full flex flex-col gap-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Part: Score Circle and Main Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        
        {/* Score Info */}
        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="mb-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
            {documentType && (
              <span className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-wider">
                {documentType}
              </span>
            )}
            {writingStyle?.tone && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-medium">
                Tone: {writingStyle.tone}
              </span>
            )}
            {audienceAlignment?.grade_level !== undefined && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs font-medium">
                Grade Level: {audienceAlignment.grade_level}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Overall Score</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-lg leading-relaxed">
            {overallScore >= 80
              ? 'Excellent quality. High structural integrity and clarity apparent throughout.'
              : overallScore >= 60
              ? 'Solid foundation. Targeted improvements will elevate the standard to professional.'
              : overallScore >= 40
              ? 'Needs rework. Follow the guided corrections below to improve flow.'
              : 'Major issues detected. A structural rewrite is strongly recommended.'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {delta !== null && delta !== 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-light border border-border">
                {delta >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-danger" />
                )}
                <span className="text-sm font-semibold text-text-primary">
                  {previousScore} → {overallScore}{' '}
                  <span className="text-text-secondary ml-1">{delta > 0 ? '+' : ''}{delta} pts</span>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-light border border-border cursor-help group relative">
              <Shield className="w-4 h-4 text-brand" />
              <span className="text-sm font-semibold text-text-primary">
                Confidence: {confidence}%
              </span>
            </div>

            {results?.grammarStats?.num_errors !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-light border border-border">
                <span className="text-sm font-semibold text-danger">
                  {results.grammarStats.num_errors} Errors Fixed
                </span>
                <span className="text-xs text-text-muted">
                  (Density: {results.grammarStats.error_density})
                </span>
              </div>
            )}

            {benchmarking?.percentBetterThan && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-accent/20 to-brand/20 border border-brand/30">
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">
                  Better than {benchmarking?.percentBetterThan}% of {benchmarking?.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Circular Score */}
        <div className="relative flex-shrink-0 order-first md:order-last cursor-pointer group" onClick={() => setShowFormula(!showFormula)}>
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90 shadow-2xl rounded-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#27272a" strokeWidth="12" />
            <motion.circle
              cx="100" cy="100" r="80"
              fill="none"
              stroke={color.text}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums" style={{ color: color.text }}>
              {displayScore}
            </span>
            <span className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-widest flex items-center gap-1 group-hover:text-brand transition-colors">
              Score <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Transparency Panels */}
      <div className="space-y-3 z-10 w-full mt-4">
        
        {/* Score Transparency Formula */}
        <div className="rounded-xl border border-border bg-surface/50 overflow-hidden">
          <button 
            onClick={() => setShowFormula(!showFormula)}
            className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-text-secondary hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand" />
              How this score was calculated
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFormula ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 text-sm"
              >
                <div className="p-4 rounded-lg bg-body/50 font-mono text-xs text-text-muted space-y-2 border border-border">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span>Mathematical Dimension</span>
                    <span>Local Evaluation</span>
                  </div>
                  <div className="flex justify-between hover:text-brand-light transition-colors">
                    <span>Clarity heuristics (0-20)</span>
                    <span>{Math.round((scores?.clarity || 0) / 5)} pts</span>
                  </div>
                  <div className="flex justify-between hover:text-brand-light transition-colors">
                    <span>Coherence mapping (0-20)</span>
                    <span>{Math.round((scores?.coherence || 0) / 5)} pts</span>
                  </div>
                  <div className="flex justify-between hover:text-brand-light transition-colors">
                    <span>Grammatical syntax (0-20)</span>
                    <span>{Math.round((scores?.grammar || 0) / 5)} pts</span>
                  </div>
                  <div className="flex justify-between hover:text-brand-light transition-colors">
                    <span>Vocabulary diversity (0-20)</span>
                    <span>{Math.round((scores?.vocabulary || 0) / 5)} pts</span>
                  </div>
                  <div className="flex justify-between hover:text-brand-light transition-colors">
                    <span>Structural framework (0-20)</span>
                    <span>{Math.round((scores?.structure || 0) / 5)} pts</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/50 text-white font-bold">
                    <span>Final Calculated Score</span>
                    <span>{overallScore}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Explainable AI Panel */}
        {explainableAI && (
          <div className="rounded-xl border border-border bg-surface/50 overflow-hidden mt-2">
            <button 
              onClick={() => setShowExplainableAI(!showExplainableAI)}
              className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-text-secondary hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Explainable AI Reasoning
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showExplainableAI ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showExplainableAI && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-sm"
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-brand/5 border border-brand/20">
                      <h4 className="font-semibold text-brand-light mb-1 text-xs uppercase tracking-wider">Model Reasoning</h4>
                      <p className="text-text-secondary">{explainableAI?.modelReasoning}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {audienceAlignment && (
                        <div className="p-4 rounded-lg bg-body/50 border border-border">
                          <h4 className="font-semibold text-brand-light mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            Audience Readability Evaluator
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md border ${audienceAlignment.audience_match ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
                              {audienceAlignment.audience_match ? 'Target Hit' : 'Target Missed'}
                            </span>
                            <span className="px-2 py-1 text-[10px] uppercase font-semibold border border-white/10 rounded-md">
                              Readability: {audienceAlignment.readability_score} / 100
                            </span>
                          </div>
                          <p className="text-text-secondary text-sm mb-3">
                            <strong className="text-white">Gap: {audienceAlignment.difficulty_gap > 0 ? '+' : ''}{audienceAlignment.difficulty_gap} levels.</strong> {audienceAlignment.feedback}
                          </p>
                          <ul className="space-y-1 mt-3 pt-3 border-t border-border">
                            {audienceAlignment.features?.map((f, i) => (
                              <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {intentAlignment && (
                        <div className="p-4 rounded-lg bg-body/50 border border-border">
                          <h4 className="font-semibold text-brand-light mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            Intent Alignment Expert Matrix
                          </h4>
                          <div className="space-y-2 text-sm text-text-secondary">
                            <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded">
                              <span>Tone Match</span>
                              <span className="font-mono text-white">{intentAlignment.tone_score}/25</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded">
                              <span>Structure Compliance</span>
                              <span className="font-mono text-white">{intentAlignment.structure_score}/25</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded">
                              <span>Content Relevance</span>
                              <span className="font-mono text-white">{intentAlignment.relevance_score}/25</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded">
                              <span>Purpose Fulfillment</span>
                              <span className="font-mono text-white">{intentAlignment.purpose_score}/25</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-border pt-2 mt-2 font-bold text-white">
                              <span>Total Vector Alignment</span>
                              <span>{intentAlignment.alignment_score}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 rounded-lg bg-body/50 border border-border">
                        <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                          Confidence Factors
                        </h4>
                        <p className="text-text-secondary text-sm">{explainableAI?.confidenceFactors}</p>
                        
                        {writingStyle && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <span className="text-xs font-semibold text-text-muted block mb-1">Tone Feedback</span>
                            <p className="text-xs text-text-secondary">{writingStyle.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
      </div>
    </motion.div>
  )
}
