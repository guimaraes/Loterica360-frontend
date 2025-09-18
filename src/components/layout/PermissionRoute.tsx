import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '../../hooks/usePermissions'

interface PermissionRouteProps {
  children: ReactNode
  requiredPermissions: (permissions: ReturnType<typeof usePermissions>) => boolean
  fallbackPath?: string
}

export function PermissionRoute({ 
  children, 
  requiredPermissions, 
  fallbackPath = '/' 
}: PermissionRouteProps) {
  const permissions = usePermissions()

  if (!requiredPermissions(permissions)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

// Componentes específicos para diferentes tipos de permissão
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <PermissionRoute
      requiredPermissions={(permissions) => permissions.canManageUsers}
      fallbackPath="/vendas"
    >
      {children}
    </PermissionRoute>
  )
}

export function GerenteRoute({ children }: { children: ReactNode }) {
  return (
    <PermissionRoute
      requiredPermissions={(permissions) => 
        permissions.canManageGames || permissions.canManageBoloes
      }
      fallbackPath="/vendas"
    >
      {children}
    </PermissionRoute>
  )
}

export function VendedorRoute({ children }: { children: ReactNode }) {
  return (
    <PermissionRoute
      requiredPermissions={(permissions) => permissions.canManageSales}
      fallbackPath="/vendas"
    >
      {children}
    </PermissionRoute>
  )
}

export function AuditorRoute({ children }: { children: ReactNode }) {
  return (
    <PermissionRoute
      requiredPermissions={(permissions) => permissions.canAccessReports}
      fallbackPath="/vendas"
    >
      {children}
    </PermissionRoute>
  )
}
