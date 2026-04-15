import { motion } from 'framer-motion'
import { BrainCircuit, TrendingUp, TrendingDown, Lightbulb, Repeat, Award, Activity } from 'lucide-react'

export default function LearningProfile({ learningProfile, analysisHistory }) {
  if (!learningProfile) return null

  // Compute Trends if history is available
  let trends = []
  if (analysisHistory && analysisHistory.length >= 2) {
    const latest = analysisHistory[analysisHistory.length - 1].scores
    const previous = analysisHistory[analysisHistory.length - 2].scores
    
    if (latest && previous) {
      Object.keys(latest).forEach(key => {
        const diff = latest[key] - (previous[key] || 0)
        if (Math.abs(diff) >= 5) {
          trends.push({
            metric: key.charAt(0).toUpperCase() + key.slice(1),
            diff: diff
          })
        }
      })
    }
  }

  // Find lowest consistently scoring metric if we have a bit of history
  let consistentStruggle = null
  if (analysisHistory && analysisHistory.length >= 2) {
    const sums = {}
    analysisHistory.forEach(record => {
      if (!record.scores) return
      Object.entries(record.scores).forEach(([key, val]) => {
        sums[key] = (sums[key] || 0) + val
      })
    })
    
    let lowestMetric = ''
    let lowestAvg = Infinity
    Object.entries(sums).forEach(([key, sum]) => {
      const avg = sum / analysisHistory.length
      if (avg < lowestAvg) {
        lowestAvg = avg
        lowestMetric = key
      }
    })

    if (lowestAvg < 70) {
      consistentStruggle = `You consistently struggle with ${lowestMetric}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="card-elegant p-8 h-full flex flex-col relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-accent" />
            Learning Profile
          </h3>
          <p className="text-xs text-text-secondary">AI-identified patterns over time</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-grow justify-center relative z-10">
        
        {/* Dynamic Trends (if available) */}
        {trends.length > 0 && (
          <div className="p-4 rounded-xl bg-surface-light border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-brand-light" />
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Recent Trends</span>
            </div>
            <div className="space-y-2">
              {trends.map(t => (
                <div key={t.metric} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{t.metric}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface border border-border/50">
                    {t.diff > 0 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-danger" />
                    )}
                    <span className={`text-xs font-bold ${t.diff > 0 ? 'text-success' : 'text-danger'}`}>
                      {t.diff > 0 ? '+' : ''}{t.diff}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consistent Struggle */}
        {(consistentStruggle || learningProfile.weakArea) && (
          <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.05)] border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <span className="text-xs font-semibold text-warning uppercase tracking-wider">Area to Improve</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed decoration-warning/30 underline decoration-dashed underline-offset-4">
              {consistentStruggle || learningProfile.weakArea}
            </p>
          </div>
        )}

        {/* Pattern */}
        {learningProfile.pattern && (
          <div className="p-4 rounded-xl bg-body border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-brand" />
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Writing Habit Detected</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed font-medium">
              "{learningProfile.pattern}"
            </p>
          </div>
        )}

        {/* Tip */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand/10 to-transparent border border-brand/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-brand-light" />
            <span className="text-xs font-semibold text-brand-light uppercase tracking-wider">Targeted Advice</span>
          </div>
          <p className="text-sm text-white leading-relaxed font-semibold">
            {learningProfile.tip || "Use more declarative statements for impact."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
