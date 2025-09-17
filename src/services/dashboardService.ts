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
  },

  // Análise de desempenho por período
  getPerformanceAnalysis: async (dataInicio: string, dataFim: string, tipoComparacao?: string) => {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      ...(tipoComparacao && { tipoComparacao })
    })
    const response = await api.get(`/dashboard/performance-analysis?${params}`)
    return response.data
  },

  // Comparação mês a mês
  getMonthlyComparison: async () => {
    const response = await api.get('/dashboard/monthly-comparison')
    return response.data
  },

  // Comparação ano a ano
  getYearlyComparison: async () => {
    const response = await api.get('/dashboard/yearly-comparison')
    return response.data
  },

  // Análise de tendências
  getTrendAnalysis: async () => {
    const response = await api.get('/dashboard/trend-analysis')
    return response.data
  }
}
