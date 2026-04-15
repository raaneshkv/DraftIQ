import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login, signup } = useAuth()

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    let res;
    if (isLogin) {
      if (!formData.email || !formData.password) return setError('Please fill all fields')
      res = login(formData.email, formData.password)
    } else {
      if (!formData.name || !formData.email || !formData.password) return setError('Please fill all fields')
      res = signup(formData.name, formData.email, formData.password)
    }

    if (res.success) {
      onClose()
    } else {
      setError(res.error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface border border-white/10 shadow-2xl"
          >
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-light via-brand to-transparent blur-3xl" />
            
            <div className="relative z-10 p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-text-secondary text-sm">
                  {isLogin 
                    ? 'Sign in to access your analysis history and insights.' 
                    : 'Join to track your writing progress perfectly.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-body border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-body border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-body border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-brand to-brand-light hover:from-brand-light hover:to-brand text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-text-secondary hover:text-brand-light transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
