import { motion } from 'framer-motion'
import { FileText, GraduationCap, FlaskConical, Briefcase, Globe } from 'lucide-react'

const domains = [
  { id: 'Technical Report', icon: FileText, label: 'Technical Report' },
  { id: 'Essay', icon: GraduationCap, label: 'Essay' },
  { id: 'Research Paper', icon: FlaskConical, label: 'Research Paper' },
  { id: 'Business Report', icon: Briefcase, label: 'Business Report' },
  { id: 'General', icon: Globe, label: 'General' },
]

export default function DomainSelector({ selected, onChange }) {
  return (
    <div className="mb-10">
      <label className="block text-base font-semibold text-text-primary mb-4 ml-1">
        Select Document Domain
      </label>
      <div className="flex flex-wrap gap-3">
        {domains.map((domain) => {
          const Icon = domain.icon
          const isActive = selected === domain.id
          return (
            <motion.button
              key={domain.id}
              onClick={() => onChange(domain.id)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-brand/20 to-brand-dark/20 text-white border-2 border-brand/50 shadow-[0_4px_20px_rgba(0,210,255,0.25)]'
                  : 'bg-surface-light text-text-secondary border-2 border-border hover:border-brand/30 hover:text-text-primary hover:bg-surface-lighter'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : ''}`} />
              {domain.label}
              {isActive && (
                <motion.div
                  layoutId="domain-indicator"
                  className="absolute -bottom-px left-3 right-3 h-0.5 bg-brand rounded-full"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      {selected && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-brand mt-4 ml-1 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(176,91,255,0.6)]" />
          Scoring weights adjusted for {selected}
        </motion.p>
      )}
    </div>
  )
}
