import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MenuItem } from '../types/menu'

interface MenuState {
  expandedMenus: Set<string>
  setExpandedMenus: React.Dispatch<React.SetStateAction<Set<string>>>
  toggleMenu: (menuId: string) => void
  collapseAll: () => void
  expandActiveMenu: (item: MenuItem) => void
}

export function useMenuState(): MenuState {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const location = useLocation()

  // Função para verificar se um item de menu está ativo
  const isActive = (menuItem: MenuItem): boolean => {
    if (menuItem.href && location.pathname === menuItem.href) {
      return true
    }
    
    if (menuItem.children) {
      return menuItem.children.some(child => isActive(child))
    }
    
    return false
  }

  // Função para expandir automaticamente menus que contêm itens ativos
  const expandActiveMenu = (item: MenuItem) => {
    if (item.children) {
      const hasActiveChild = item.children.some(child => isActive(child))
      if (hasActiveChild) {
        // Comportamento de accordion: fecha todos os outros e abre apenas este
        setExpandedMenus(new Set([item.id]))
      }
    }
  }

  // Toggle de um menu específico com comportamento de accordion
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      
      // Se o menu já está expandido, apenas colapsa
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        // Se o menu não está expandido, fecha todos os outros e abre apenas este
        newSet.clear()
        newSet.add(menuId)
      }
      
      return newSet
    })
  }

  // Colapsar todos os menus
  const collapseAll = () => {
    setExpandedMenus(new Set())
  }

  return {
    expandedMenus,
    setExpandedMenus,
    toggleMenu,
    collapseAll,
    expandActiveMenu
  }
}
