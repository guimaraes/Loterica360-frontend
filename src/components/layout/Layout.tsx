import { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumb } from './Breadcrumb'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className="p-6">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
