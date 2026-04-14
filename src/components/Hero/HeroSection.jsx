import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DashboardMockup from './DashboardMockup'
import FeatureGrid from './FeatureGrid'
import HowItWorks from './HowItWorks'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-32">

      {/* Hero Typography & CTA */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        {/* MICRO BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-light border border-border mb-8 shadow-2xl"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-xs font-semibold tracking-wide text-text-primary uppercase">DraftIQ Engine • Live Analysis Ready</span>
        </motion.div>

        {/* PRIMARY HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="relative group cursor-default flex flex-col items-center"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-6 transition-transform duration-500 group-hover:scale-[1.02]">
            <span className="relative inline-block mb-1">
              Write Better.
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-brand origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </span><br/>
            <span className="relative inline-block mb-1">
              Think Smarter.
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-accent origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
            </span><br/>
            <span className="relative inline-block">
              Elevate with AI.
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-brand origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </span>
          </h1>
        </motion.div>

        {/* SECONDARY HEADLINE */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-6"
        >
          Document Intelligence, Reimagined
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Get instant AI-powered feedback on clarity, structure, and impact — with precise scoring and actionable improvements.
        </motion.p>

        {/* CTA ZONE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-10"
        >
          {/* Primary CTA */}
          <button
            onClick={() => navigate('/analyze')}
            className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-white/20 hover:shadow-[0_0_50px_rgba(139,92,246,0.8)] hover:scale-105 active:scale-95"
          >
            Start Free Analysis
            <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Secondary CTA */}
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works')
              if (!el) return
              const targetPosition = el.getBoundingClientRect().top + window.scrollY
              const startPosition = window.scrollY
              const distance = targetPosition - startPosition
              const duration = 1200 // 1.2s ease instead of browser native instant smooth
              let start = null

              window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp
                const progress = timestamp - start
                // Ease in out cubic function
                const easeInOutCubic = progress / duration < 0.5 
                  ? 4 * Math.pow(progress / duration, 3) 
                  : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic)
                if (progress < duration) {
                  window.requestAnimationFrame(step)
                }
              })
            }}
            className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-transparent text-text-primary font-bold text-base transition-all border border-border hover:border-text-secondary hover:bg-surface hover:scale-105 active:scale-95"
          >
            See How It Works
          </button>
        </motion.div>

        {/* TRUST STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-text-muted mb-6"
        >
          <span>6 Dimensions</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>&lt;5s Analysis</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Real-Time Feedback</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>No Signup Required</span>
        </motion.div>
      </div>

      {/* Dashboard Vibe Mockup */}
      <DashboardMockup />

      {/* Feature Grid Bento Box */}
      <FeatureGrid />

      {/* Flowchart Workflow Section */}
      <HowItWorks />
    </div>
  )
}
