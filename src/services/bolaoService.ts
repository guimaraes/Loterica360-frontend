import api from './api'
import { Bolao, BolaoRequest, PaginatedResponse } from '../types'

export const bolaoService = {
  async getBoloes(page = 0, size = 10, filters?: any): Promise<PaginatedResponse<Bolao>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters,
    })
    
    const response = await api.get<PaginatedResponse<Bolao>>(`/boloes?${params}`)
    return response.data
  },

  async getBolaoById(id: string): Promise<Bolao> {
    const response = await api.get<Bolao>(`/boloes/${id}`)
    return response.data
  },

  async createBolao(bolao: BolaoRequest): Promise<Bolao> {
    const response = await api.post<Bolao>('/boloes', bolao)
    return response.data
  },

  async updateBolao(id: string, bolao: Partial<BolaoRequest>): Promise<Bolao> {
    const response = await api.put<Bolao>(`/boloes/${id}`, bolao)
    return response.data
  },

  async closeBolao(id: string): Promise<Bolao> {
    const response = await api.post<Bolao>(`/boloes/${id}/fechar`)
    return response.data
  },

  async cancelBolao(id: string): Promise<Bolao> {
    const response = await api.post<Bolao>(`/boloes/${id}/cancelar`)
    return response.data
  },

  async getBoloesByJogo(jogoId: string): Promise<Bolao[]> {
    const response = await api.get<Bolao[]>(`/boloes/jogo/${jogoId}`)
    return response.data
  },
}
