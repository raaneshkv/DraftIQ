import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react'

const statusConfig = {
  PRESENT: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', label: 'Present' },
  WEAK: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', label: 'Weak' },
  MISSING: { icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', label: 'Missing' },
}

export default function SectionIntelligence({ sections }) {
  const [expanded, setExpanded] = useState(null)

  if (!sections?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-elegant p-6 h-full"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-1">Section Intelligence</h3>
      <p className="text-sm text-text-muted mb-4">Auto-detected document sections</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sections.map((section, i) => {
          const config = statusConfig[section.status] || statusConfig.PRESENT
          const Icon = config.icon
          const isExpanded = expanded === i

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setExpanded(isExpanded ? null : i)}
              className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                section.status === 'MISSING' ? 'pulse-red' : ''
              }`}
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: config.color }} />
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="text-sm font-medium text-text-primary">{section.name}</div>
              <div className="text-xs mt-1" style={{ color: config.color }}>{config.label}</div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-text-secondary mt-3 pt-3 border-t" style={{ borderColor: config.border }}>
                      {section.details}
                    </p>
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
