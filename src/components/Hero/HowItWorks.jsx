import { motion } from 'framer-motion'
import { FileText, Cpu, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: '1. Input & Context',
    desc: 'Paste your raw draft or drop a document. The engine instantly detects your professional domain.',
    color: '#3b82f6'
  },
  {
    icon: Cpu,
    title: '2. Algorithmic Parsing',
    desc: 'Deep structural scans target wordy phrasing, grammatical density, and sentence variance.',
    color: '#8b5cf6'
  },
  {
    icon: CheckCircle,
    title: '3. Actionable Mastery',
    desc: 'Review impact priority tables and apply deterministic fixes to elevate your final piece.',
    color: '#10b981'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-32 relative z-20">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">The Analysis Workflow</h2>
        <p className="text-lg text-text-secondary max-w-xl mx-auto">A transparent, step-by-step pipeline ensuring your documentation arrives at its maximum potential.</p>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6">
        
        {/* Connecting Background Line - Responsive */}
        <div className="absolute left-[39px] md:left-10 md:right-10 top-0 bottom-0 md:top-1/2 md:-translate-y-1/2 w-0.5 md:w-auto md:h-0.5 border-l-2 md:border-l-0 md:border-t-2 border-dashed border-[#27272a] -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            className="flex flex-row md:flex-col items-center md:text-center w-full md:w-1/3 relative group"
          >
            {/* Hover Glow Behind Icon */}
            <div className="absolute top-0 md:top-auto w-20 h-20 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none blur-2xl" style={{ backgroundColor: step.color }} />

            {/* Step Icon Node */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#09090b] border border-[#27272a] flex items-center justify-center mb-0 md:mb-8 shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500" style={{
              boxShadow: `0 0 15px ${step.color}15, inset 0 0 0 1px ${step.color}30`
            }}>
              <step.icon className="w-8 h-8 text-text-primary group-hover:text-white transition-colors" style={{ filter: `drop-shadow(0 0 10px ${step.color}80)` }} />
            </div>

            {/* Step Text Data */}
            <div className="ml-6 md:ml-0 flex-1">
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
            
          </motion.div>
        ))}
      </div>
    </section>
  )
}
