import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Eye } from 'lucide-react'

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
          <h3 className="text-xl font-bold text-white mb-1">Before & After</h3>
          <p className="text-sm text-text-secondary">Side-by-side syntax improvements</p>
        </div>
        <button
          onClick={() => setShowChangesOnly(!showChangesOnly)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            showChangesOnly
              ? 'bg-surface-light text-brand border border-brand/30'
              : 'bg-transparent text-text-secondary border border-border hover:border-text-muted hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Highlight
        </button>
      </div>

      <div className="space-y-6">
        {beforeAfter.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="flex flex-col border border-border rounded-lg overflow-hidden bg-bg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Before */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-border md:bg-[rgba(239,68,68,0.01)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Original</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.before}
                </p>
              </div>

              {/* After */}
              <div className="p-4 bg-[rgba(16,185,129,0.02)] transition-colors mt-[-1px] md:mt-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs font-semibold text-success uppercase tracking-wider">Improved</span>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {item.after}
                </p>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="px-4 py-3 border-t border-border bg-surface-light/30 flex items-start gap-3">
              <div className="p-1.5 rounded bg-surface border border-border shrink-0 mt-0.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  <span className="text-white font-semibold mr-2">Reasoning:</span>
                  {item.reason || "Structural optimizations to improve clarity."}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
