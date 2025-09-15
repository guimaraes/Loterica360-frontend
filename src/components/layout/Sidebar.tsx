import { NavLink } from 'react-router-dom'
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  Receipt
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { cn } from '../../utils/cn'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Vendas', href: '/vendas', icon: ShoppingCart },
  { name: 'Bolões', href: '/boloes', icon: Users },
  { name: 'Turnos', href: '/turnos', icon: Clock },
  { name: 'Movimentos', href: '/movimentos', icon: Receipt },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Usuários', href: '/usuarios', icon: Settings },
]

export function Sidebar() {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-48'
      }`}
    >
      <nav className="flex h-full flex-col space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className={sidebarOpen ? 'opacity-100' : 'opacity-0'}>
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
