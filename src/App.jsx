import { useState, createContext, useContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Layout/Navbar'
import HeroSection from './components/Hero/HeroSection'
import AnalyzerPage from './pages/AnalyzerPage'
import ProgressPage from './pages/ProgressPage'

export const AppContext = createContext()

export function useApp() {
  return useContext(AppContext)
}

function App() {
  const location = useLocation()
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('draftiq_history') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('draftiq_history', JSON.stringify(analysisHistory))
  }, [analysisHistory])

  const addToHistory = (result) => {
    setAnalysisHistory(prev => [...prev, { ...result, timestamp: Date.now() }])
  }

  const contextValue = {
    analysisHistory,
    addToHistory,
    hasAnalysis,
    setHasAnalysis
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-bg relative overflow-x-hidden">
        {/* Global Intense Background Mesh Gradient */}
        <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[150vw] h-[100vh] opacity-40 pointer-events-none z-0" style={{
          background: 'radial-gradient(circle at 40% 0%, rgba(59, 130, 246, 0.4) 0%, transparent 40%), radial-gradient(circle at 60% 0%, rgba(139, 92, 246, 0.4) 0%, transparent 40%)',
          filter: 'blur(100px)'
        }} />

        <Navbar />
        <div className="relative z-10 w-full h-full">
          <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HeroSection />} />
            <Route path="/analyze" element={<AnalyzerPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </AnimatePresence>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
