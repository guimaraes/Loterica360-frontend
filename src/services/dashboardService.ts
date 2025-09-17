import { api } from './api'

export const dashboardService = {
  // Obter métricas gerais do dashboard
  getDashboardMetrics: async () => {
    const response = await api.get('/dashboard/metrics')
    return response.data
  },

  // Obter resumo de vendas
  getSalesSummary: async (days: number = 7) => {
    const response = await api.get(`/dashboard/sales-summary?days=${days}`)
    return response.data
  },

  // Obter resumo de bolões
  getBoloesSummary: async () => {
    const response = await api.get('/dashboard/boloes-summary')
    return response.data
  },

  // Obter atividades recentes
  getRecentActivity: async () => {
    const response = await api.get('/dashboard/recent-activity')
    return response.data
  }
}
