import { useState, createContext, useContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Layout/Navbar'
import HeroSection from './components/Hero/HeroSection'
import AnalyzerPage from './pages/AnalyzerPage'
import ProgressPage from './pages/ProgressPage'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/Auth/AuthModal'

export const AppContext = createContext()

export function useApp() {
  return useContext(AppContext)
}

function App() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  // Scope history to the current user
  const [analysisHistory, setAnalysisHistory] = useState(() => {
    try {
      const historyId = currentUser ? `draftiq_history_${currentUser.email}` : 'draftiq_history_guest'
      return JSON.parse(localStorage.getItem(historyId) || '[]')
    } catch { return [] }
  })

  // When user changes, reload history
  useEffect(() => {
    const historyId = currentUser ? `draftiq_history_${currentUser.email}` : 'draftiq_history_guest'
    try {
      setAnalysisHistory(JSON.parse(localStorage.getItem(historyId) || '[]'))
    } catch { setAnalysisHistory([]) }
  }, [currentUser])

  useEffect(() => {
    const historyId = currentUser ? `draftiq_history_${currentUser.email}` : 'draftiq_history_guest'
    localStorage.setItem(historyId, JSON.stringify(analysisHistory))
  }, [analysisHistory, currentUser])

  const addToHistory = (result) => {
    setAnalysisHistory(prev => [...prev, { ...result, timestamp: Date.now() }])
  }

  const contextValue = {
    analysisHistory,
    addToHistory,
    hasAnalysis,
    setHasAnalysis,
    setIsAuthModalOpen
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
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </AppContext.Provider>
  )
}

export default App
