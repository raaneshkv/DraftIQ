import { motion } from 'framer-motion'
import { useApp } from '../App'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { TrendingUp, Flame, Trophy, BarChart3, Calendar } from 'lucide-react'

export default function ProgressPage() {
  const { analysisHistory } = useApp()

  const chartData = analysisHistory.map((entry, i) => ({
    review: `Review ${i + 1}`,
    score: entry.overallScore,
    date: new Date(entry.timestamp).toLocaleDateString(),
    domain: entry.domain,
  }))

  // Calculate stats
  const scores = analysisHistory.map(e => e.overallScore)
  const bestScore = scores.length ? Math.max(...scores) : 0
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const improvement = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : 0

  // Streak calculation (consecutive days)
  const streak = (() => {
    if (!analysisHistory.length) return 0
    let count = 1
    const days = analysisHistory.map(e => new Date(e.timestamp).toDateString())
    const unique = [...new Set(days)]
    for (let i = unique.length - 1; i > 0; i--) {
      const diff = new Date(unique[i]) - new Date(unique[i - 1])
      if (diff <= 86400000 * 1.5) count++
      else break
    }
    return count
  })()

  // Weak areas from latest analysis
  const latestScores = analysisHistory.length
    ? analysisHistory[analysisHistory.length - 1].scores
    : null
  const weakAreas = latestScores
    ? Object.entries(latestScores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
    : []

  const dimLabels = {
    clarity: 'Clarity',
    structure: 'Structure',
    completeness: 'Completeness',
    accuracy: 'Accuracy',
    professionalQuality: 'Professional Quality',
    audienceAlignment: 'Audience Alignment',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Progress <span className="text-brand">Tracker</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Track your document quality improvement over time.
          </p>
        </motion.div>

        {analysisHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elegant p-12 text-center"
          >
            <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Reviews Yet</h3>
            <p className="text-text-secondary mb-6">Analyze your first document to start tracking progress.</p>
            <a
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold btn-sweep"
            >
              Start First Analysis
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Trophy, label: 'Best Score', value: bestScore, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                { icon: BarChart3, label: 'Average', value: avgScore, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
                { icon: TrendingUp, label: 'Improvement', value: `${improvement > 0 ? '+' : ''}${improvement}`, color: '#5DCAA5', bg: 'rgba(93, 202, 165, 0.1)' },
                { icon: Flame, label: 'Day Streak', value: streak, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-elegant p-5"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Score Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elegant p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">Score History</h3>
              <p className="text-sm text-text-muted mb-6">Your improvement trajectory</p>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                    <XAxis
                      dataKey="review"
                      tick={{ fill: '#8b8b9e', fontSize: 12 }}
                      axisLine={{ stroke: '#2a2a3a' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#8b8b9e', fontSize: 12 }}
                      axisLine={{ stroke: '#2a2a3a' }}
                    />
                    <ReTooltip
                      content={({ payload }) => {
                        if (!payload?.length) return null
                        const d = payload[0].payload
                        return (
                          <div className="rounded-lg px-3 py-2 text-sm bg-surface-light border border-border">
                            <div className="text-text-primary font-medium">{d.review}</div>
                            <div className="text-brand font-bold">Score: {d.score}</div>
                            <div className="text-text-muted text-xs">{d.domain} • {d.date}</div>
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#a78bfa"
                      fill="url(#scoreGradient)"
                      strokeWidth={2}
                      dot={{ fill: '#a78bfa', strokeWidth: 0, r: 4 }}
                      activeDot={{ fill: '#a78bfa', strokeWidth: 2, stroke: '#fff', r: 6 }}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-elegant p-6"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-1">Areas to Improve</h3>
                <p className="text-sm text-text-muted mb-4">Your weakest dimensions from latest review</p>

                <div className="space-y-3">
                  {weakAreas.map(([key, score], i) => {
                    const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-sm text-text-secondary w-40 flex-shrink-0">
                          {dimLabels[key] || key}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-surface-lighter overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                        <span className="text-sm font-bold tabular-nums w-10 text-right" style={{ color }}>
                          {score}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Most improved badge */}
            {improvement > 10 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', damping: 15 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand/10 to-accent/10 border border-brand/20">
                  <Trophy className="w-6 h-6 text-warning" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-text-primary">Most Improved!</div>
                    <div className="text-xs text-text-muted">+{improvement} points since your first review</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
