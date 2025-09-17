import { MenuItem } from '../../types/menu'
import { cn } from '../../utils/cn'

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

interface CollapsedMenuIconProps {
  item: MenuItem
  isActive: boolean
}

export function CollapsedMenuIcon({ item, isActive }: CollapsedMenuIconProps) {
  const Icon = getIcon(item.icon)
  
  return (
    <div className="relative group">
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-md">
        {item.name}
        {item.children && item.children.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {item.children.length} item(s)
          </div>
        )}
      </div>
    </div>
  )
}
