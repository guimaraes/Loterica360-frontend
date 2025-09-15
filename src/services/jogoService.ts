import api from './api'
import { Jogo, PaginatedResponse } from '../types'

export const jogoService = {
  async getJogos(page = 0, size = 10, ativo = true): Promise<PaginatedResponse<Jogo>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ativo: ativo.toString(),
    })
    
    const response = await api.get<PaginatedResponse<Jogo>>(`/jogos?${params}`)
    return response.data
  },

  async getJogoById(id: string): Promise<Jogo> {
    const response = await api.get<Jogo>(`/jogos/${id}`)
    return response.data
  },

  async getAllJogosAtivos(): Promise<Jogo[]> {
    const response = await api.get<Jogo[]>('/jogos/ativos')
    return response.data
  },
}
