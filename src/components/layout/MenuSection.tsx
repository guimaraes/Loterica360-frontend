import { MenuSection as MenuSectionType, MenuItem } from '../../types/menu'
import { Submenu } from './Submenu'
import { cn } from '../../utils/cn'

interface MenuSectionProps {
  section: MenuSectionType
  sidebarOpen: boolean
}

export function MenuSection({ section, sidebarOpen }: MenuSectionProps) {
  return (
    <div className="space-y-1">
      {sidebarOpen && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </h3>
        </div>
      )}
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
