import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function bootstrap() {
      if (!authService.isAuthenticated()) {
        if (active) {
          setLoading(false)
        }
        return
      }

      const me = await authService.fetchMe()
      if (active) {
        setUser(me)
        setLoading(false)
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.isAdmin),
      async login(email, password) {
        const data = await authService.login(email, password)
        setUser(data.user ?? null)
        return data
      },
      async register(payload) {
        const data = await authService.register(payload)
        setUser(data.user ?? null)
        return data
      },
      logout() {
        authService.clearToken()
        setUser(null)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider')
  }

  return context
}
