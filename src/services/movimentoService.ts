import api from './api'
import { MovimentoCaixa, MovimentoCaixaRequest, PaginatedResponse } from '../types'

export const movimentoService = {
  async getMovimentos(page = 0, size = 10, filters?: any): Promise<PaginatedResponse<MovimentoCaixa>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters,
    })
    
    const response = await api.get<PaginatedResponse<MovimentoCaixa>>(`/movimentos?${params}`)
    return response.data
  },

  async getMovimentoById(id: string): Promise<MovimentoCaixa> {
    const response = await api.get<MovimentoCaixa>(`/movimentos/${id}`)
    return response.data
  },

  async createMovimento(movimento: MovimentoCaixaRequest): Promise<MovimentoCaixa> {
    const response = await api.post<MovimentoCaixa>('/movimentos', movimento)
    return response.data
  },

  async getMovimentosByTurno(turnoId: string): Promise<MovimentoCaixa[]> {
    const response = await api.get<MovimentoCaixa[]>(`/movimentos/turno/${turnoId}`)
    return response.data
  },

  async getMovimentosByTipo(tipo: 'SANGRIA' | 'SUPRIMENTO'): Promise<MovimentoCaixa[]> {
    const response = await api.get<MovimentoCaixa[]>(`/movimentos/tipo/${tipo}`)
    return response.data
  },
}
