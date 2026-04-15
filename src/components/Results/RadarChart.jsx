import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts'

const dimensionLabels = {
  clarity: 'Clarity',
  coherence: 'Coherence',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  structure: 'Structure',
}

export default function RadarChartPanel({ scores, humanFeedback }) {
  const [selectedDim, setSelectedDim] = useState(null)

  const data = Object.entries(scores).map(([key, value]) => ({
    dimension: dimensionLabels[key] || key,
    score: value,
    fullMark: 100,
    key,
  }))

  const CustomTick = ({ payload, x, y, textAnchor }) => {
    const entry = data.find(d => d.dimension === payload.value)
    const score = entry?.score || 0
    const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

    return (
      <g
        onClick={() => setSelectedDim(entry?.key || null)}
        style={{ cursor: 'pointer' }}
      >
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          fill="#8b8b9e"
          fontSize={12}
          fontFamily="Inter"
          fontWeight={500}
        >
          {payload.value}
        </text>
        <text
          x={x}
          y={y + 16}
          textAnchor={textAnchor}
          fill={color}
          fontSize={11}
          fontFamily="Inter"
          fontWeight={700}
        >
          {score}%
        </text>
      </g>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="card-elegant p-6 h-full"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-1">Score Breakdown</h3>
      <p className="text-sm text-text-muted mb-4">Click any axis for details</p>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#2a2a3a" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={<CustomTick />}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#a78bfa"
              fill="#a78bfa"
              fillOpacity={0.15}
              strokeWidth={2}
              animationBegin={300}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="rounded-lg px-3 py-2 text-sm bg-surface-light border border-border" >
                    <span className="text-text-primary font-medium">{d.dimension}:</span>{' '}
                    <span className="text-brand font-bold">{d.score}%</span>
                  </div>
                )
              }}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>

      {selectedDim && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-surface border border-border"
        >
          <span className="text-sm text-text-secondary">
            <strong className="text-brand">{dimensionLabels[selectedDim]}</strong> scored{' '}
            <strong>{scores[selectedDim]}%</strong>.{' '}
            {humanFeedback?.[selectedDim] ? (
              <span className="block mt-2 font-medium text-white p-3 bg-brand/10 border border-brand/20 rounded-lg">
                "{humanFeedback[selectedDim]}"
              </span>
            ) : (
              <span className="block mt-2">
                {scores[selectedDim] < 60
                  ? 'This is below average. See the correction steps below for improvement guidance.'
                  : scores[selectedDim] < 80
                  ? 'Decent score with room for refinement. Check the suggestions below.'
                  : 'Strong performance! Minor polish may still be possible.'}
              </span>
            )}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
