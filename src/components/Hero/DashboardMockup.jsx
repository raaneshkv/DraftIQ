import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlowingLineChart from './GlowingLineChart'
import { ArrowLeftRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default function DashboardMockup() {
  const [score, setScore] = useState(65)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    // Loop the demonstration automatically
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeStep === 0) setScore(65)
    if (activeStep === 1) setScore(72)
    if (activeStep === 2) setScore(84)
    if (activeStep === 3) setScore(94)
  }, [activeStep])

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16 z-20 perspective-1000">
      {/* Intense Background Mesh Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-40 pointer-events-none z-0" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(139, 92, 246, 0.4) 30%, transparent 70%)',
        filter: 'blur(100px)'
      }} />

      <motion.div
        initial={{ opacity: 0, rotateX: 10, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, type: 'spring', bounce: 0.2 }}
        className="relative z-10 w-full rounded-2xl bg-[#09090b] border border-[#27272a] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(59,130,246,0.2)] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Fake Mac Toolbar */}
        <div className="w-full h-10 border-b border-[#27272a] bg-[#18181b] flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="mx-auto flex gap-2 w-48 h-5 bg-[#27272a] rounded-full opacity-60" />
        </div>

        {/* Mockup Inside UI */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 min-h-[400px]">
          
          {/* Left Panel: Score and Live Before/After */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Live Score Box */}
            <div className="p-5 rounded-xl border border-brand/30 bg-surface/80 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
              <div className="relative z-10">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Live Score</p>
                <motion.div 
                   key={score}
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand"
                >
                  {score}%
                </motion.div>
              </div>
              <div className="relative z-10 w-16 h-16 rounded-full border-[6px] border-brand/20 flex items-center justify-center">
                <motion.div 
                  initial={{ rotate: -90, strokeDasharray: "100 100" }}
                  animate={{ strokeDasharray: `${score} 100` }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 rounded-full border-[6px] border-brand"
                  style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: `rotate(${(score/100)*360}deg)` }}
                />
              </div>
            </div>

            {/* Live Before/After Simulation */}
            <div className="flex-1 rounded-xl border border-border bg-surface p-4 flex flex-col gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 bg-brand/10 rounded-bl-xl border-l border-b border-brand/20">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1">
                    <ArrowLeftRight className="w-3 h-3" /> Auto Improve
                  </span>
               </div>
               
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeStep}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   transition={{ duration: 0.5 }}
                   className="mt-6 flex flex-col gap-4 h-full"
                 >
                    {/* Before part */}
                    <div className={`p-3 rounded-lg border ${activeStep % 2 === 0 ? 'border-danger/30 bg-danger/5' : 'border-border bg-surface-light/50 opacity-40'}`}>
                       <p className="text-xs text-text-secondary mb-2 flex items-center gap-1 font-semibold uppercase">
                          {activeStep % 2 === 0 ? <AlertCircle className="w-3 h-3 text-danger" /> : null}
                          Original
                       </p>
                       <div className="h-2 w-3/4 bg-text-muted/30 rounded mb-2" />
                       <div className="h-2 w-full bg-text-muted/30 rounded mb-2" />
                       <div className="h-2 w-5/6 bg-text-muted/30 rounded" />
                    </div>

                    {/* After part */}
                    <div className={`p-3 rounded-lg border ${activeStep % 2 !== 0 ? 'border-success/30 bg-success/5' : 'border-border bg-surface-light/50 opacity-40'}`}>
                       <p className="text-xs text-text-secondary mb-2 flex items-center gap-1 font-semibold uppercase">
                          {activeStep % 2 !== 0 ? <CheckCircle2 className="w-3 h-3 text-success" /> : null}
                          Improved
                       </p>
                       <div className="h-2 w-full bg-text-primary/70 rounded mb-2" />
                       <div className="h-2 w-4/5 bg-text-primary/70 rounded mb-2" />
                       <div className="h-2 w-full bg-text-primary/70 rounded" />
                    </div>
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>

          {/* Right Main Chart (GlowingLineChart injected) */}
          <div className="md:col-span-7 h-full min-h-[300px]">
             {/* Wrap with special subtle blue border */}
            <div className="w-full h-full flex flex-col rounded-2xl border border-brand/30 bg-[#18181b] shadow-[0_0_30px_rgba(59,130,246,0.1)] p-4 hover:border-brand/70 transition-colors duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]">
               <div className="mb-4">
                  <h4 className="text-sm font-bold text-white">Improvement Trajectory</h4>
                  <p className="text-xs text-text-muted">Analyzing continuous fixes...</p>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent rounded-xl pointer-events-none z-0" />
                  <GlowingLineChart />
               </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
