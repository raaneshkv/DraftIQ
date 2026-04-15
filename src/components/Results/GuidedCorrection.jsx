import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageSquare, Lightbulb, Target, ListTodo, Clock, CheckCircle } from 'lucide-react'

const steps = [
  { key: 'identify', label: 'IDENTIFY', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: Search, desc: "What's wrong" },
  { key: 'explain', label: 'EXPLAIN', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: MessageSquare, desc: 'Why it matters' },
  { key: 'reflect', label: 'REFLECT', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: Lightbulb, desc: 'Think about this' },
  { key: 'suggest', label: 'SUGGEST', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', icon: Target, desc: 'What to change' },
  { key: 'task', label: 'TASK', color: '#5DCAA5', bg: 'rgba(93, 202, 165, 0.1)', icon: ListTodo, desc: 'Specific instruction' },
  { key: 'deadline', label: 'DEADLINE', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', icon: Clock, desc: 'Timeline' },
]

export default function GuidedCorrection({ issues }) {
  const [expanded, setExpanded] = useState(null)
  const [completed, setCompleted] = useState({})

  if (!issues?.length) return null

  const handleComplete = (issueIdx, stepKey, e) => {
    e.stopPropagation()
    const key = `${issueIdx}-${stepKey}`
    const newCompleted = { ...completed, [key]: !completed[key] }
    setCompleted(newCompleted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card-elegant p-6"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-1">Guided Correction Engine</h3>
      <p className="text-sm text-text-muted mb-4">Step-by-step fixes for each issue</p>

      <div className="space-y-3">
        {issues.map((issue, i) => {
          const isExpanded = expanded === i
          const correction = issue.correction || {}

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="rounded-xl border border-border overflow-hidden"
              style={{ background: 'rgba(17, 17, 24, 0.5)' }}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-light/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    (issue.scoreImpactValue >= 8) ? 'bg-danger/15 text-danger' :
                    (issue.scoreImpactValue >= 4) ? 'bg-warning/15 text-warning' :
                    'bg-blue-500/15 text-blue-400'
                  }`}>
                    {issue.scoreImpactValue ? `+${issue.scoreImpactValue} Score` : 'Issue'}
                  </span>
                  <span className="text-sm text-text-primary font-medium">{issue.issue}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Steps */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-2">
                      {steps.map((step) => {
                        const content = correction[step.key]
                        if (!content) return null
                        const isCompleted = completed[`${i}-${step.key}`]
                        const StepIcon = step.icon

                        return (
                          <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * steps.indexOf(step) }}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${isCompleted ? 'opacity-50' : ''}`}
                            style={{ background: step.bg }}
                          >
                            <StepIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: step.color }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>
                                  {step.label}
                                </span>
                                <span className="text-xs text-text-muted">— {step.desc}</span>
                              </div>
                              <p className={`text-sm text-text-secondary leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                                {content}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleComplete(i, step.key, e)}
                              className="flex-shrink-0 mt-0.5"
                            >
                              <CheckCircle
                                className={`w-5 h-5 transition-colors ${
                                  isCompleted ? 'text-accent' : 'text-text-muted/30 hover:text-text-muted'
                                }`}
                              />
                            </button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
