import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('draftiq_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('draftiq_all_users')
      return savedUsers ? JSON.parse(savedUsers) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('draftiq_all_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('draftiq_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('draftiq_user')
    }
  }, [currentUser])

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setCurrentUser({ email: user.email, name: user.name })
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' }
    }
    const newUser = { name, email, password }
    setUsers([...users, newUser])
    setCurrentUser({ email, name })
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
