import { useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  name: string
  href?: string
}

export function Breadcrumb() {
  const location = useLocation()
  
  // Mapear rotas para nomes amigáveis
  const routeNames: Record<string, string> = {
    '/': 'Dashboard Principal',
    '/analise': 'Análise Avançada',
    '/usuarios': 'Usuários',
    '/clientes': 'Clientes',
    '/jogos': 'Jogos',
    '/boloes': 'Bolões',
    '/vendas': 'Vendas',
    '/turnos': 'Turnos',
    '/movimentos': 'Movimentos',
    '/relatorios': 'Relatórios',
    '/relatorios/vendas': 'Relatório de Vendas',
    '/relatorios/financeiro': 'Relatório Financeiro',
    '/relatorios/usuarios': 'Relatório de Usuários',
    '/relatorios/jogos': 'Relatório de Jogos'
  }

  // Gerar breadcrumb baseado na rota atual
  const generateBreadcrumb = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumb: BreadcrumbItem[] = []

    // Sempre incluir Dashboard como primeiro item se não estivermos na raiz
    if (location.pathname !== '/') {
      breadcrumb.push({ name: 'Dashboard', href: '/' })
    }

    // Construir breadcrumb baseado nos segmentos da URL
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      breadcrumb.push({
        name: routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath
      })
    })

    return breadcrumb
  }

  const breadcrumbItems = generateBreadcrumb()

  // Não mostrar breadcrumb na página inicial
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link 
        to="/" 
        className="flex items-center space-x-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Início</span>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link 
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {item.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
