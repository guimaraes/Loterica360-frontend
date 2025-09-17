import { useLocation } from 'react-router-dom'
import { MenuItem } from '../../types/menu'

interface MenuIndicatorProps {
  item: MenuItem
}

export function useMenuIndicator({ item }: MenuIndicatorProps) {
  const location = useLocation()
  
  // Verifica se o item atual está ativo
  const isActive = (menuItem: MenuItem): boolean => {
    if (menuItem.href && location.pathname === menuItem.href) {
      return true
    }
    
    // Verifica se algum filho está ativo
    if (menuItem.children) {
      return menuItem.children.some(child => isActive(child))
    }
    
    return false
  }
  
  return {
    isActive: isActive(item),
    hasActiveChild: item.children ? item.children.some(child => isActive(child)) : false
  }
}
