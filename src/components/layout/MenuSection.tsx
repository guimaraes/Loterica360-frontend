import { MenuSection as MenuSectionType, MenuItem } from '../../types/menu'
import { Submenu } from './Submenu'
import { CollapsedMenuIcon } from './CollapsedMenuIcon'
import { cn } from '../../utils/cn'
import { useMenuState } from '../../hooks/useMenuState'
import { useMenuIndicator } from './MenuIndicator'

interface MenuSectionProps {
  section: MenuSectionType
  sidebarOpen: boolean
}

export function MenuSection({ section, sidebarOpen }: MenuSectionProps) {
  const { collapseAll } = useMenuState()

  // Se a sidebar estiver fechada, mostrar apenas ícones
  if (!sidebarOpen) {
    return (
      <div className="space-y-2">
        <div className="space-y-2">
          {section.items.map((item) => {
            const { isActive } = useMenuIndicator({ item })
            return (
              <CollapsedMenuIcon
                key={item.id}
                item={item}
                isActive={isActive}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section.title}
        </h3>
      </div>
      <div className="space-y-1">
        {section.items.map((item) => (
          <Submenu
            key={item.id}
            item={item}
            isOpen={sidebarOpen}
            sidebarOpen={sidebarOpen}
          />
        ))}
      </div>
    </div>
  )
}
