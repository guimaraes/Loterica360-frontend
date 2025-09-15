import api from './api'
import { Turno, TurnoRequest, PaginatedResponse } from '../types'

export const turnoService = {
  async getTurnos(page = 0, size = 10, filters?: any): Promise<PaginatedResponse<Turno>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters,
    })
    
    const response = await api.get<PaginatedResponse<Turno>>(`/turnos?${params}`)
    return response.data
  },

  async getTurnoById(id: string): Promise<Turno> {
    const response = await api.get<Turno>(`/turnos/${id}`)
    return response.data
  },

  async getTurnoAtivo(): Promise<Turno | null> {
    try {
      const response = await api.get<Turno>('/turnos/ativo')
      return response.data
    } catch (error) {
      return null
    }
  },

  async abrirTurno(turno: TurnoRequest): Promise<Turno> {
    const response = await api.post<Turno>('/turnos/abrir', turno)
    return response.data
  },

  async fecharTurno(id: string, valorFinal: number): Promise<Turno> {
    const response = await api.post<Turno>(`/turnos/${id}/fechar`, { valorFinal })
    return response.data
  },

  async getTurnosByUsuario(usuarioId: string): Promise<Turno[]> {
    const response = await api.get<Turno[]>(`/turnos/usuario/${usuarioId}`)
    return response.data
  },
}
