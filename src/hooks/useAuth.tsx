import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { getCurrentUser } from '../store/slices/authSlice'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  console.log('AuthProvider - user:', user, 'isAuthenticated:', isAuthenticated, 'loading:', loading, 'error:', error)

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('AuthProvider - token:', token, 'user:', user)
    if (token && !user && !loading) {
      console.log('AuthProvider - Fazendo getCurrentUser')
      dispatch(getCurrentUser())
    }
  }, [dispatch, user, loading])

  // Log quando o estado muda
  useEffect(() => {
    console.log('AuthProvider - Estado mudou:', { user, isAuthenticated, loading, error })
  }, [user, isAuthenticated, loading, error])

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
