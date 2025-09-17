import api from './api'
import { Jogo, JogoRequest, JogoUpdateRequest, PaginatedResponse } from '../types'

export const jogoService = {
  async getJogos(page = 0, size = 10): Promise<PaginatedResponse<Jogo>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    
    const response = await api.get(`/jogos?${params}`)
    return response.data
  },

  async getJogosAtivosPaginado(page = 0, size = 10): Promise<PaginatedResponse<Jogo>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    
    const response = await api.get(`/jogos/ativos/paginado?${params}`)
    return response.data
  },

  async getJogoById(id: string): Promise<Jogo> {
    const response = await api.get(`/jogos/${id}`)
    return response.data
  },

  async getAllJogosAtivos(): Promise<Jogo[]> {
    const response = await api.get('/jogos/ativos')
    return response.data
  },

  async createJogo(jogo: JogoRequest): Promise<Jogo> {
    const response = await api.post('/jogos', jogo)
    return response.data
  },

  async updateJogo(id: string, jogo: JogoUpdateRequest): Promise<Jogo> {
    const response = await api.put(`/jogos/${id}`, jogo)
    return response.data
  },

  async toggleJogoStatus(id: string): Promise<Jogo> {
    const response = await api.patch(`/jogos/${id}/toggle-status`)
    return response.data
  },
}
