import { motion } from 'framer-motion'
import GlowingLineChart from './GlowingLineChart'

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-16 z-20 perspective-1000">
      
      {/* Mesh Gradient Backend */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-40 pointer-events-none z-0" style={{
        background: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, #8b5cf6 30%, transparent 70%)',
        filter: 'blur(100px)'
      }} />

      <motion.div
        initial={{ opacity: 0, rotateX: 10, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, type: 'spring', bounce: 0.2 }}
        className="relative z-10 w-full rounded-2xl bg-[#09090b] border border-[#27272a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Fake Mac Toolbar */}
        <div className="w-full h-10 border-b border-[#27272a] bg-[#18181b] flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Mockup Inside UI */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
          
          {/* Left Panel */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="h-24 w-full rounded-xl border border-[#3b82f6]/40 bg-[#18181b] shadow-[inset_0_0_20px_rgba(59,130,246,0.15)] p-4 flex items-center justify-between group cursor-pointer transition-colors hover:border-[#3b82f6]/80">
              <div>
                <div className="h-4 w-24 bg-[#27272a] rounded mb-2" />
                <div className="h-8 w-16 bg-[#3b82f6]/20 rounded border border-[#3b82f6]/40 text-center text-[#3b82f6] font-bold leading-8">94%</div>
              </div>
            </div>

            <div className="h-full min-h-[160px] w-full rounded-xl border border-[#27272a] bg-[#18181b] p-4 flex flex-col gap-3">
              <div className="h-4 w-1/2 bg-[#27272a] rounded" />
              <div className="h-3 w-full bg-[#27272a]/50 rounded" />
              <div className="h-3 w-3/4 bg-[#27272a]/50 rounded" />
              <div className="h-3 w-5/6 bg-[#27272a]/50 rounded" />
            </div>
          </div>

          {/* Right Main Chart (GlowingLineChart injected) */}
          <div className="md:col-span-8 h-full min-h-[280px]">
             {/* Wrap with special subtle blue border required by user */}
            <div className="w-full h-full rounded-2xl border border-[#3b82f6]/30 bg-[#18181b] shadow-[0_0_30px_rgba(59,130,246,0.1)] p-2 hover:border-[#3b82f6]/70 transition-colors duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]">
               <GlowingLineChart />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
