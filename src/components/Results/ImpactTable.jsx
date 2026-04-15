import { motion } from 'framer-motion'
import { AlertCircle, FileSearch, ArrowRight, TrendingUp } from 'lucide-react'

export default function ImpactTable({ issues }) {
  if (!issues?.length) return null

  // Sort issues by scoreImpactValue if available, high to low
  const sortedIssues = [...issues].sort((a, b) => {
    const valA = a.scoreImpactValue || 0
    const valB = b.scoreImpactValue || 0
    return valB - valA
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-elegant p-6 md:p-8 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-2 relative z-10">Smart Impact Prioritization</h3>
      <p className="text-sm text-text-secondary mb-8 max-w-2xl relative z-10">
        We've analyzed the issues and ranked them by their potential positive impact on your final score. 
        Focus on the high-impact insights first.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {sortedIssues.map((issue, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className={`group flex flex-col p-5 rounded-xl border border-border bg-body/80 hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
              i === 0 ? 'border-l-4 border-l-brand md:col-span-2 bg-brand/5' : ''
            }`}
          >
            {/* Header: Score Impact and Issue Title */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   {issue.scoreImpactValue ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand font-bold text-xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{issue.scoreImpactValue} Score Impact
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-light border border-border/50 text-text-secondary font-semibold text-xs">
                         <AlertCircle className="w-3.5 h-3.5" />
                         Issue Detected
                      </span>
                    )}

                    {i === 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-accent/20 text-accent border border-accent/30">
                        Top Priority
                      </span>
                    )}
                </div>
                <h4 className="text-white font-medium text-base leading-snug group-hover:text-brand-light transition-colors">
                  {issue.issue}
                </h4>
              </div>
            </div>

            <div className="w-full h-px bg-border/50 my-3" />

            {/* Root Cause Analysis section */}
            {(issue.rootCause?.why || issue.rootCause?.causedBy) ? (
              <div className="mt-auto space-y-3">
                <div className="flex items-start gap-2">
                  <FileSearch className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-0.5">Root Cause</span>
                    <p className="text-sm text-text-muted font-medium bg-black/20 p-2 rounded border border-white/5">
                      {issue.rootCause.why} 
                      {issue.rootCause.causedBy && <span className="block mt-1 text-text-secondary opacity-80 border-t border-white/5 pt-1">Caused by: {issue.rootCause.causedBy}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-brand/80 block mb-0.5">Correction / Insight</span>
                    <p className="text-sm text-text-primary">
                      {issue.correction?.suggest || "Review and rewrite for clarity."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
               <div className="mt-auto pt-2">
                   <p className="text-sm text-text-secondary">
                      {issue.correction?.suggest || issue.correction?.explain || "Review and address this issue to improve flow."}
                   </p>
               </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
