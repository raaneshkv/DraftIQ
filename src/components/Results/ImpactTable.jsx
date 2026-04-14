import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

const severityConfig = {
  HIGH: { icon: AlertCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
  MEDIUM: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  LOW: { icon: Info, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)' },
}

export default function ImpactTable({ issues }) {
  if (!issues?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-elegant p-6"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-1">Impact Analysis</h3>
      <p className="text-sm text-text-muted mb-4">Your biggest differentiation opportunities</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Issue</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Severity</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Score Impact</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, i) => {
              const sev = severityConfig[issue.severity] || severityConfig.MEDIUM
              const SevIcon = sev.icon

              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-text-primary max-w-xs">
                    {issue.issue}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}
                    >
                      <SevIcon className="w-3 h-3" />
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                    {issue.scoreImpact}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${issue.confidence}%` }}
                          transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                          className="h-full rounded-full bg-brand"
                        />
                      </div>
                      <span className="text-xs text-text-muted tabular-nums">{issue.confidence}%</span>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
