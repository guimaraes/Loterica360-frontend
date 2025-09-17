import { api } from './api'
import { Bolao, BolaoRequest, BolaoUpdateRequest, PaginatedResponse } from '../types'

export const bolaoService = {
  // Listar bolões com paginação
  getBoloes: async (page: number = 0, size: number = 10, search?: string): Promise<PaginatedResponse<Bolao>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await api.get(`/boloes?${params}`)
    return response.data
  },

  // Listar todos os bolões ativos (sem paginação)
  getAllBoloesAtivos: async (): Promise<Bolao[]> => {
    const response = await api.get('/boloes/ativos')
    return response.data
  },

  // Buscar bolão por ID
  getBolaoById: async (id: string): Promise<Bolao> => {
    const response = await api.get(`/boloes/${id}`)
    return response.data
  },

  // Criar novo bolão
  createBolao: async (bolao: BolaoRequest): Promise<Bolao> => {
    const response = await api.post('/boloes', bolao)
    return response.data
  },

  // Atualizar bolão
  updateBolao: async (id: string, bolao: BolaoUpdateRequest): Promise<Bolao> => {
    const response = await api.put(`/boloes/${id}`, bolao)
    return response.data
  },

  // Alterar status do bolão
  toggleBolaoStatus: async (id: string): Promise<Bolao> => {
    const response = await api.patch(`/boloes/${id}/toggle-status`)
    return response.data
  },

  // Deletar bolão (se necessário)
  deleteBolao: async (id: string): Promise<void> => {
    await api.delete(`/boloes/${id}`)
  }
}
