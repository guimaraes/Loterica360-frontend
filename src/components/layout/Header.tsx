import { Menu, Bell, User, LogOut, ShoppingCart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useIsVendedor } from '../../hooks/usePermissions'

export function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const isVendedor = useIsVendedor()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Loteria360</h1>
          {isVendedor && (
            <div className="flex items-center space-x-2 text-primary">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-medium">Sistema de Vendas</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.nome}</p>
              <p className="text-xs text-muted-foreground">{user?.papel}</p>
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
