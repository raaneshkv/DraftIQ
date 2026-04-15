import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BrainCircuit, User, LogOut } from 'lucide-react'
import { useApp } from '../../App'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hasAnalysis, setIsAuthModalOpen } = useApp()
  const { currentUser, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative pb-1">
          <div className="flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-text-primary group-hover:scale-110 group-hover:text-brand transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,0,0,0)] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight transition-transform duration-300">
            DraftIQ
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <NavLink to="/analyze" active={location.pathname === '/analyze'}>
            Workspace
          </NavLink>
          <NavLink to="/progress" active={location.pathname === '/progress'}>
            Progress
          </NavLink>

          <div className="w-px h-4 bg-border mx-2" />

          {/* Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm border border-border px-3 py-1.5 rounded-full flex items-center gap-2 text-text-secondary bg-surface/50">
                <User className="w-4 h-4" />
                <span>{currentUser.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-text-secondary hover:text-danger transition-colors p-1"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-transparent border border-brand/50 text-brand hover:bg-brand/10 font-semibold text-sm transition-all"
            >
              Sign In
            </button>
          )}

          <div className="w-px h-4 bg-border mx-2 hidden sm:block" />

          {/* Primary CTA */}
          <button
            onClick={() => {
              if (hasAnalysis) {
                window.location.href = '/analyze' // Hard reset
              } else {
                navigate('/analyze')
              }
            }}
            className="px-4 py-1.5 rounded-md bg-text-primary text-bg font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] hidden sm:flex"
          >
            {hasAnalysis ? 'New Analysis' : 'Start Analysis'}
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 ${
        active
          ? 'text-text-primary'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      <span className="relative z-10">{children}</span>
      <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-brand origin-left transition-transform duration-300 ${
        active ? 'scale-x-100 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'scale-x-0'
      }`} />
    </Link>
  )
}
