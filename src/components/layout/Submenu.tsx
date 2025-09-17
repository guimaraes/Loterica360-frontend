import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { MenuItem } from '../../types/menu'
import { useMenuIndicator } from './MenuIndicator'

// Importar ícones do Lucide React
import {
  Home,
  TrendingUp,
  Settings,
  UserCheck,
  Gamepad2,
  Users,
  ShoppingCart,
  Clock,
  Receipt,
  BarChart3
} from 'lucide-react'

// Mapear ícones por nome
const iconMap: Record<string, any> = {
  Home,
  TrendingUp,
  Settings,
  UserCheck,
  Gamepad2,
  Users,
  ShoppingCart,
  Clock,
  Receipt,
  BarChart3
}

// Função para obter o ícone
const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home
}

interface SubmenuProps {
  item: MenuItem
  isOpen: boolean
  sidebarOpen: boolean
}

export function Submenu({ item, isOpen, sidebarOpen }: SubmenuProps) {
  const { isActive, hasActiveChild } = useMenuIndicator({ item })
  const [isExpanded, setIsExpanded] = useState(hasActiveChild)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  if (!item.children || item.children.length === 0) {
    // Se não tem filhos, renderiza como link normal
    return (
      <NavLink
        to={item.href || '#'}
        className={({ isActive }) =>
          cn(
            'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )
        }
      >
        {(() => {
          const Icon = getIcon(item.icon)
          return <Icon className="h-5 w-5" />
        })()}
        <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {item.name}
        </span>
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive || hasActiveChild
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <div className="flex items-center space-x-3">
          {(() => {
            const Icon = getIcon(item.icon)
            return <Icon className="h-5 w-5" />
          })()}
          <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            {item.name}
          </span>
        </div>
        {sidebarOpen && (
          <div className="transition-transform duration-200">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </button>
      
      {isExpanded && sidebarOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child) => (
            <NavLink
              key={child.id}
              to={child.href || '#'}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
              <span>{child.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
