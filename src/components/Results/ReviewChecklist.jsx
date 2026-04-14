import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

export default function ReviewChecklist({ checklist }) {
  if (!checklist?.length) return null

  const passedCount = checklist.filter(c => c.passed).length
  const total = checklist.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="card-elegant p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Smart Review Checklist</h3>
          <p className="text-sm text-text-muted">Quality criteria assessment</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
          <span className="text-sm font-semibold text-brand">{passedCount}</span>
          <span className="text-xs text-text-muted">/ {total} passed</span>
        </div>
      </div>

      <div className="space-y-2">
        {checklist.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.08 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              item.passed ? 'bg-success/5' : 'bg-danger/5'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.9 + i * 0.08,
                type: 'spring',
                damping: 10,
                stiffness: 300
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.passed ? 'bg-success/15' : 'bg-danger/15'
              }`}
            >
              {item.passed ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <X className="w-3.5 h-3.5 text-danger" />
              )}
            </motion.div>
            <span className={`text-sm ${item.passed ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
              {item.item}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="w-full h-2 rounded-full bg-surface-lighter overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(passedCount / total) * 100}%` }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: passedCount / total >= 0.7
                ? 'linear-gradient(90deg, #22c55e, #5DCAA5)'
                : passedCount / total >= 0.4
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)'
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
