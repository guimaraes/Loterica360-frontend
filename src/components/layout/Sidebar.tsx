import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { menuSections } from '../../types/menu'
import { MenuSection } from './MenuSection'
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

export function Sidebar() {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-48'
      }`}
    >
      <nav className="flex h-full flex-col space-y-6 p-4 overflow-y-auto">
        {menuSections.map((section) => (
          <MenuSection
            key={section.id}
            section={section}
            sidebarOpen={sidebarOpen}
          />
        ))}
      </nav>
    </aside>
  )
}
