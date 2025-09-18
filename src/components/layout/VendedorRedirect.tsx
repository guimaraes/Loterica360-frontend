import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useIsVendedor } from '../../hooks/usePermissions'

interface VendedorRedirectProps {
  children: React.ReactNode
}

export function VendedorRedirect({ children }: VendedorRedirectProps) {
  const isVendedor = useIsVendedor()
  const location = useLocation()

  // Se for vendedor e não estiver na página de vendas ou clientes, redireciona para vendas
  if (isVendedor) {
    const allowedPaths = ['/vendas', '/clientes', '/login']
    const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path))
    
    if (!isAllowedPath) {
      return <Navigate to="/vendas" replace />
    }
  }

  return <>{children}</>
}
