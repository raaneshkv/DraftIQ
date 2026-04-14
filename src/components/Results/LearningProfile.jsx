import { motion } from 'framer-motion'
import { BrainCircuit, TrendingUp, Lightbulb, Repeat, Award } from 'lucide-react'

export default function LearningProfile({ learningProfile }) {
  if (!learningProfile) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="card-elegant p-8 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-text-secondary" />
            User Intelligence
          </h3>
          <p className="text-xs text-text-secondary">AI-identified patterns</p>
        </div>
        
        {/* User Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-border">
          <Award className="w-4 h-4 text-brand" />
          <span className="text-[11px] font-semibold text-text-primary uppercase tracking-widest">
            {learningProfile.skillLevel || "Intermediate"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-grow justify-center">
        {/* Weak Area */}
        <div className="p-4 rounded-lg bg-surface-light/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-danger" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Area to Improve</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{learningProfile.needsFocus || learningProfile.weakArea}</p>
        </div>

        {/* Pattern */}
        <div className="p-4 rounded-lg bg-surface-light/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4 text-warning" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Writing Habit</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{learningProfile.dominantStyle || learningProfile.pattern}</p>
        </div>

        {/* Tip */}
        <div className="p-4 rounded-lg bg-surface-light/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Targeted Advice</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{learningProfile.tip || "Use more declarative statements for impact."}</p>
        </div>
      </div>
    </motion.div>
  )
}
