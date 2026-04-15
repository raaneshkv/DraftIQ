import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Eye, Lightbulb } from 'lucide-react'

export default function BeforeAfter({ beforeAfter }) {
  const [showChangesOnly, setShowChangesOnly] = useState(false)

  if (!beforeAfter?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="card-elegant p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Before & After Analysis</h3>
          <p className="text-sm text-text-secondary">Side-by-side syntax improvements with intelligent reasoning</p>
        </div>
        <button
          onClick={() => setShowChangesOnly(!showChangesOnly)}
          className={`flex flex-shrink-0 items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            showChangesOnly
              ? 'bg-brand/20 text-brand border border-brand/40'
              : 'bg-transparent text-text-secondary border border-border hover:border-text-muted hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {showChangesOnly ? 'Reading Mode' : 'Highlight Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {beforeAfter.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="flex flex-col border border-border rounded-xl overflow-hidden bg-body shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Before */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-border md:bg-[rgba(239,68,68,0.015)] transition-colors relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-danger/5 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Original Text</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed relative z-10 selection:bg-danger/20">
                  {item.before}
                </p>
              </div>

              {/* After */}
              <div className="p-5 bg-[rgba(16,185,129,0.02)] transition-colors mt-[-1px] md:mt-0 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-success drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                  <span className="text-xs font-bold text-success uppercase tracking-widest flex items-center gap-2">
                    Improved Version <SparklesIcon className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed relative z-10 selection:bg-success/20">
                  {item.after}
                </p>
              </div>
            </div>

            {/* AI Explanation Why Better */}
            <div className="px-5 py-4 border-t border-border/70 bg-surface/50 border-l-4 border-l-brand flex items-start gap-4">
              <div className="p-2 rounded-lg bg-surface border border-brand/20 shrink-0 mt-0.5 shadow-sm">
                <Lightbulb className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  Rewrite Intelligence
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.explanation_why_better || item.reason || "Structural optimizations implemented to establish clearer argument flow and stronger logical connections."}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="Mm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}
