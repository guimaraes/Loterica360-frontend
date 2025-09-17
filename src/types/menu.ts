export interface MenuItem {
  id: string
  name: string
  href?: string
  icon: any
  children?: MenuItem[]
  badge?: string | number
  disabled?: boolean
}

export interface MenuSection {
  id: string
  title: string
  items: MenuItem[]
}

export const menuSections: MenuSection[] = [
  {
    id: 'dashboard',
    title: 'Principal',
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/',
        icon: 'Home'
      },
      {
        id: 'analise',
        name: 'Análise Avançada',
        href: '/analise',
        icon: 'TrendingUp'
      }
    ]
  },
  {
    id: 'cadastro',
    title: 'Cadastros',
    items: [
      {
        id: 'usuarios',
        name: 'Usuários',
        href: '/usuarios',
        icon: 'Settings'
      },
      {
        id: 'clientes',
        name: 'Clientes',
        href: '/clientes',
        icon: 'UserCheck'
      },
      {
        id: 'jogos',
        name: 'Jogos',
        href: '/jogos',
        icon: 'Gamepad2'
      },
      {
        id: 'boloes',
        name: 'Bolões',
        href: '/boloes',
        icon: 'Users'
      }
    ]
  },
  {
    id: 'operacional',
    title: 'Operacional',
    items: [
      {
        id: 'vendas',
        name: 'Vendas',
        href: '/vendas',
        icon: 'ShoppingCart'
      },
      {
        id: 'turnos',
        name: 'Turnos',
        href: '/turnos',
        icon: 'Clock'
      },
      {
        id: 'movimentos',
        name: 'Movimentos',
        href: '/movimentos',
        icon: 'Receipt'
      }
    ]
  },
  {
    id: 'relatorios',
    title: 'Relatórios',
    items: [
      {
        id: 'relatorios-gerais',
        name: 'Relatórios Gerais',
        icon: 'BarChart3',
        children: [
          {
            id: 'relatorios-vendas',
            name: 'Relatório de Vendas',
            href: '/relatorios/vendas',
            icon: 'ShoppingCart'
          },
          {
            id: 'relatorios-financeiro',
            name: 'Relatório Financeiro',
            href: '/relatorios/financeiro',
            icon: 'Receipt'
          }
        ]
      }
    ]
  }
]
