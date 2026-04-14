import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Shield } from 'lucide-react'

function getScoreColor(score) {
  if (score <= 40) return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
  if (score <= 65) return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
  return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' }
}

export default function ScoreOverview({ overallScore, previousScore, confidence }) {
  const [displayScore, setDisplayScore] = useState(0)
  const animationRef = useRef()
  const color = getScoreColor(overallScore)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * overallScore)
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
      className="card-elegant p-8 h-full flex flex-col justify-center"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        
        {/* Score Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">Overall Score</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-lg leading-relaxed">
            {overallScore >= 80
              ? 'Excellent quality. High structural integrity and clarity apparent throughout the document.'
              : overallScore >= 60
              ? 'Solid foundation. Targeted improvements will elevate the standard to professional.'
              : overallScore >= 40
              ? 'Needs rework. Follow the guided corrections below to improve flow.'
              : 'Major issues detected. A structural rewrite is strongly recommended.'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {/* Delta */}
            {delta !== null && (
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

            {/* Confidence */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-light border border-border">
              <Shield className="w-4 h-4 text-brand" />
              <span className="text-sm font-semibold text-text-primary">
                Confidence: {confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Circular Score */}
        <div className="relative flex-shrink-0 order-first md:order-last">
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="100" cy="100" r="80"
              fill="none"
              stroke="#27272a"
              strokeWidth="12"
            />
            {/* Score ring */}
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
            <span className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-widest">Score</span>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
