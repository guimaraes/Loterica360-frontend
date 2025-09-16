import api from './api'
import { Caixa, CaixaRequest, PaginatedResponse } from '../types'

export const caixaService = {
  async getCaixas(page = 0, size = 20): Promise<PaginatedResponse<Caixa>> {
    const response = await api.get(`/caixas?page=${page}&size=${size}`)
    return response.data
  },

  async getAllCaixasAtivas(): Promise<Caixa[]> {
    const response = await api.get('/caixas/ativas')
    return response.data
  },

  async getCaixaById(id: string): Promise<Caixa> {
    const response = await api.get(`/caixas/${id}`)
    return response.data
  },

  async createCaixa(caixa: CaixaRequest): Promise<Caixa> {
    const response = await api.post('/caixas', caixa)
    return response.data
  },

  async updateCaixa(id: string, caixa: CaixaRequest): Promise<Caixa> {
    const response = await api.put(`/caixas/${id}`, caixa)
    return response.data
  }
}
