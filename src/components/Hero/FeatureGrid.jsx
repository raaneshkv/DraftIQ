import { motion } from 'framer-motion'
import { Sparkles, Brain, CheckCircle, Target, ArrowLeftRight, TrendingUp } from 'lucide-react'

const features = [
  {
    title: 'Structure Grading',
    desc: 'Mathematically calculates the flow and variance of your paragraph structures.',
    icon: Target,
    colSpan: 'md:col-span-2 md:row-span-2',
    accent: '#38bdf8' 
  },
  {
    title: 'Tone Mapping',
    desc: 'Measures alignment with your chosen domain.',
    icon: Sparkles,
    colSpan: 'md:col-span-1 md:row-span-1',
    accent: '#c084fc'
  },
  {
    title: 'Filler Pruning',
    desc: 'Automatically targets and extracts wordy phrasing.',
    icon: ArrowLeftRight,
    colSpan: 'md:col-span-1 md:row-span-1',
    accent: '#10b981'
  },
  {
    title: 'A.I. Rule Engine',
    desc: 'Procedural rules process metrics completely offline and securely.',
    icon: Brain,
    colSpan: 'md:col-span-1 md:row-span-2',
    accent: '#f43f5e'
  },
  {
    title: 'Impact Tables',
    desc: 'Priority queues for fixing the most severe issues first.',
    icon: TrendingUp,
    colSpan: 'md:col-span-2 md:row-span-1',
    accent: '#eab308'
  }
]

export default function FeatureGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Intelligence at scale.</h2>
        <p className="text-lg text-text-secondary">Designed for professionals to accelerate writing workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 auto-rows-[160px]">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={`group relative p-8 bg-[#09090b] border border-[#27272a] rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 ${f.colSpan}`}
          >
            {/* Subtle base glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
              background: `radial-gradient(circle at 100% 0%, ${f.accent}15 0%, transparent 60%)`
            }} />
            
            {/* Glowing Border Hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
              boxShadow: `inset 0 0 0 1px ${f.accent}50, 0 0 20px ${f.accent}20`
            }} />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{
                boxShadow: `0 0 15px ${f.accent}10`
              }}>
                <f.icon className="w-6 h-6 text-text-primary group-hover:text-white transition-colors" style={{ filter: `drop-shadow(0 0 8px ${f.accent}60)` }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed max-w-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
