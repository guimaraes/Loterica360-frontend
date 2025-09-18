import { useAuth } from './useAuth'

export interface Permissions {
  canAccessDashboard: boolean
  canAccessAnalysis: boolean
  canManageUsers: boolean
  canManageClients: boolean
  canManageGames: boolean
  canManageBoloes: boolean
  canManageSales: boolean
  canManageShifts: boolean
  canManageMovements: boolean
  canAccessReports: boolean
  canOnlyAccessSales: boolean // Para vendedores
}

export function usePermissions(): Permissions {
  const { user } = useAuth()

  if (!user) {
    return {
      canAccessDashboard: false,
      canAccessAnalysis: false,
      canManageUsers: false,
      canManageClients: false,
      canManageGames: false,
      canManageBoloes: false,
      canManageSales: false,
      canManageShifts: false,
      canManageMovements: false,
      canAccessReports: false,
      canOnlyAccessSales: false,
    }
  }

  const { papel } = user

  switch (papel) {
    case 'ADMIN':
      return {
        canAccessDashboard: true,
        canAccessAnalysis: true,
        canManageUsers: true,
        canManageClients: true,
        canManageGames: true,
        canManageBoloes: true,
        canManageSales: true,
        canManageShifts: true,
        canManageMovements: true,
        canAccessReports: true,
        canOnlyAccessSales: false,
      }
    
    case 'GERENTE':
      return {
        canAccessDashboard: true,
        canAccessAnalysis: true,
        canManageUsers: false,
        canManageClients: true,
        canManageGames: true,
        canManageBoloes: true,
        canManageSales: true,
        canManageShifts: true,
        canManageMovements: true,
        canAccessReports: true,
        canOnlyAccessSales: false,
      }
    
    case 'VENDEDOR':
      return {
        canAccessDashboard: false,
        canAccessAnalysis: false,
        canManageUsers: false,
        canManageClients: true, // Necessário para vendas
        canManageGames: false,
        canManageBoloes: false,
        canManageSales: true,
        canManageShifts: false,
        canManageMovements: false,
        canAccessReports: false,
        canOnlyAccessSales: true, // Vendedor só pode acessar vendas
      }
    
    case 'AUDITOR':
      return {
        canAccessDashboard: true,
        canAccessAnalysis: true,
        canManageUsers: false,
        canManageClients: true, // Apenas leitura
        canManageGames: false,
        canManageBoloes: false,
        canManageSales: false,
        canManageShifts: false,
        canManageMovements: false,
        canAccessReports: true,
        canOnlyAccessSales: false,
      }
    
    default:
      return {
        canAccessDashboard: false,
        canAccessAnalysis: false,
        canManageUsers: false,
        canManageClients: false,
        canManageGames: false,
        canManageBoloes: false,
        canManageSales: false,
        canManageShifts: false,
        canManageMovements: false,
        canAccessReports: false,
        canOnlyAccessSales: false,
      }
  }
}

// Hook específico para verificar se o usuário é vendedor
export function useIsVendedor(): boolean {
  const { user } = useAuth()
  return user?.papel === 'VENDEDOR'
}

// Hook para obter menu filtrado por permissões
export function useFilteredMenu() {
  const permissions = usePermissions()
  
  // Se for vendedor, retorna apenas o menu de vendas
  if (permissions.canOnlyAccessSales) {
    return [
      {
        id: 'vendas',
        title: 'Vendas',
        items: [
          {
            id: 'vendas-geral',
            name: 'Sistema de Vendas',
            icon: 'ShoppingCart',
            children: [
              {
                id: 'vendas',
                name: 'Vendas',
                href: '/vendas',
                icon: 'ShoppingCart'
              },
              {
                id: 'clientes',
                name: 'Clientes',
                href: '/clientes',
                icon: 'UserCheck'
              }
            ]
          }
        ]
      }
    ]
  }
  
  // Para outros perfis, retorna o menu completo filtrado
  const filteredSections = [
    // Dashboard
    {
      id: 'dashboard',
      title: 'Principal',
      items: [
        {
          id: 'dashboard-geral',
          name: 'Dashboard Geral',
          icon: 'Home',
          children: [
            ...(permissions.canAccessDashboard ? [{
              id: 'dashboard',
              name: 'Dashboard Principal',
              href: '/',
              icon: 'Home'
            }] : []),
            ...(permissions.canAccessAnalysis ? [{
              id: 'analise',
              name: 'Análise Avançada',
              href: '/analise',
              icon: 'TrendingUp'
            }] : [])
          ]
        }
      ]
    },
    
    // Cadastros
    {
      id: 'cadastro',
      title: 'Cadastros',
      items: [
        {
          id: 'cadastros-gerais',
          name: 'Cadastros Gerais',
          icon: 'Settings',
          children: [
            ...(permissions.canManageUsers ? [{
              id: 'usuarios',
              name: 'Usuários',
              href: '/usuarios',
              icon: 'Settings'
            }] : []),
            ...(permissions.canManageClients ? [{
              id: 'clientes',
              name: 'Clientes',
              href: '/clientes',
              icon: 'UserCheck'
            }] : []),
            ...(permissions.canManageGames ? [{
              id: 'jogos',
              name: 'Jogos',
              href: '/jogos',
              icon: 'Gamepad2'
            }] : []),
            ...(permissions.canManageBoloes ? [{
              id: 'boloes',
              name: 'Bolões',
              href: '/boloes',
              icon: 'Users'
            }] : [])
          ]
        }
      ]
    },
    
    // Operacional
    {
      id: 'operacional',
      title: 'Operacional',
      items: [
        {
          id: 'operacional-geral',
          name: 'Operacional Geral',
          icon: 'ShoppingCart',
          children: [
            ...(permissions.canManageSales ? [{
              id: 'vendas',
              name: 'Vendas',
              href: '/vendas',
              icon: 'ShoppingCart'
            }] : []),
            ...(permissions.canManageShifts ? [{
              id: 'turnos',
              name: 'Turnos',
              href: '/turnos',
              icon: 'Clock'
            }] : []),
            ...(permissions.canManageMovements ? [{
              id: 'movimentos',
              name: 'Movimentos',
              href: '/movimentos',
              icon: 'Receipt'
            }] : [])
          ]
        }
      ]
    },
    
    // Relatórios
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
            },
            ...(permissions.canManageUsers ? [{
              id: 'relatorios-usuarios',
              name: 'Relatório de Usuários',
              href: '/relatorios/usuarios',
              icon: 'UserCheck'
            }] : []),
            ...(permissions.canManageGames ? [{
              id: 'relatorios-jogos',
              name: 'Relatório de Jogos',
              href: '/relatorios/jogos',
              icon: 'Gamepad2'
            }] : [])
          ]
        }
      ]
    }
  ].filter(section => section.items.some(item => item.children && item.children.length > 0))
  
  return filteredSections
}
