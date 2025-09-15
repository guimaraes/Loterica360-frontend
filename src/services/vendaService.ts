import api from './api'
import { Venda, VendaRequest, PaginatedResponse } from '../types'

export const vendaService = {
  async getVendas(page = 0, size = 10, filters?: any): Promise<PaginatedResponse<Venda>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters,
    })
    
    const response = await api.get<PaginatedResponse<Venda>>(`/vendas?${params}`)
    return response.data
  },

  async getVendaById(id: string): Promise<Venda> {
    const response = await api.get<Venda>(`/vendas/${id}`)
    return response.data
  },

  async createVenda(venda: VendaRequest): Promise<Venda> {
    const response = await api.post<Venda>('/vendas', venda)
    return response.data
  },

  async updateVenda(id: string, venda: Partial<VendaRequest>): Promise<Venda> {
    const response = await api.put<Venda>(`/vendas/${id}`, venda)
    return response.data
  },

  async cancelVenda(id: string, motivo?: string): Promise<Venda> {
    const response = await api.post<Venda>(`/vendas/${id}/cancelar`, { motivo })
    return response.data
  },

  async getVendasByTurno(turnoId: string): Promise<Venda[]> {
    const response = await api.get<Venda[]>(`/vendas/turno/${turnoId}`)
    return response.data
  },
}
