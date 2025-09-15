import api from './api'
import { RelatorioVendasResponse, RelatorioBoloesStatusResponse } from '../types'

export const relatorioService = {
  async getRelatorioVendas(
    dataInicio: string,
    dataFim: string,
    vendedorId?: string
  ): Promise<RelatorioVendasResponse> {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      ...(vendedorId && { vendedorId }),
    })
    
    const response = await api.get<RelatorioVendasResponse>(`/relatorios/vendas?${params}`)
    return response.data
  },

  async getRelatorioBoloesStatus(): Promise<RelatorioBoloesStatusResponse> {
    const response = await api.get<RelatorioBoloesStatusResponse>('/relatorios/boloes/status')
    return response.data
  },

  async getRelatorioPagamentos(dataInicio: string, dataFim: string): Promise<Record<string, number>> {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
    })
    
    const response = await api.get<Record<string, number>>(`/relatorios/pagamentos?${params}`)
    return response.data
  },
}
