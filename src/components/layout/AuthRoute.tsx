import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface AuthRouteProps {
  children: ReactNode
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  console.log('AuthRoute - isAuthenticated:', isAuthenticated, 'loading:', loading)

  if (loading) {
    console.log('AuthRoute - Loading...')
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('AuthRoute - Redirecionando para login')
    return <Navigate to="/login" replace />
  }

  console.log('AuthRoute - Renderizando children')
  return <>{children}</>
}
