import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, ChevronDown } from 'lucide-react'

const GOALS = [
  'Score high',
  'Persuade',
  'Inform',
  'Entertain',
  'Professional',
  'Academic'
]

export default function GoalSelector({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl text-text-primary hover:border-brand/40 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-brand" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs text-text-secondary font-medium">Analysis Goal</span>
            <span className="font-semibold">{selected}</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface shadow-2xl border border-border rounded-xl z-50 overflow-hidden"
          >
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => {
                  onChange(g)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${
                  selected === g ? 'bg-brand/10 text-brand font-medium' : 'text-text-primary'
                }`}
              >
                {g}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
