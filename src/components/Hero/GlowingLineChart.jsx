import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts'

const mockData = [
  { name: 'Mon', usage: 10 },
  { name: 'Tue', usage: 25 },
  { name: 'Wed', usage: 45 },
  { name: 'Thu', usage: 30 },
  { name: 'Fri', usage: 65 },
  { name: 'Sat', usage: 85 },
  { name: 'Sun', usage: 100 }
]

export default function GlowingLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-80 relative p-6 bg-[#0f0f11] border border-border shadow-2xl rounded-2xl overflow-hidden group hover:border-[#1e293b] transition-colors duration-500"
    >
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h4 className="text-white font-bold text-lg mb-1">Intelligence Flow</h4>
        <p className="text-text-secondary text-sm">Real-time analysis throughput</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData} margin={{ top: 60, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="neonGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            
            <linearGradient id="glowUnder" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="name" 
            hide={false}
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis hide={true} domain={[0, 120]} />
          
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#18181b] border border-[#27272a] px-4 py-2 rounded-lg shadow-2xl relative overflow-hidden group-hover:border-[#38bdf8] transition-colors duration-300">
                    <span className="text-white font-semibold flex items-center gap-2 relative z-10">
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8]" style={{ boxShadow: '0 0 10px #38bdf8' }} />
                      {payload[0].value} Units
                    </span>
                  </div>
                )
              }
              return null
            }}
          />

          <Area
            type="monotone"
            dataKey="usage"
            stroke="url(#neonGradient)"
            strokeWidth={4}
            fill="url(#glowUnder)"
            activeDot={{ r: 6, fill: '#fff', stroke: '#d946ef', strokeWidth: 3 }}
            style={{ filter: 'url(#neonGlow)' }}
            animationDuration={2500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
