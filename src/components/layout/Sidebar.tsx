import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { MenuSection } from './MenuSection'
import { useMenuState } from '../../hooks/useMenuState'
import { useFilteredMenu } from '../../hooks/usePermissions'
import { useEffect } from 'react'

// Importações de ícones removidas - não utilizadas

// Mapear ícones por nome (removido - não utilizado)

// Função para obter o ícone (removida - não utilizada)

export function Sidebar() {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)
  const { collapseAll } = useMenuState()
  const filteredMenuSections = useFilteredMenu()

  // Colapsar todos os menus quando a sidebar for fechada
  useEffect(() => {
    if (!sidebarOpen) {
      collapseAll()
    }
  }, [sidebarOpen, collapseAll])

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-48'
      }`}
    >
      <nav className={`flex h-full flex-col overflow-y-auto ${
        sidebarOpen ? 'space-y-6 p-4' : 'space-y-3 p-2'
      }`}>
        {filteredMenuSections.map((section) => (
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
