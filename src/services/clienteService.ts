import api from './api'
import { Cliente, ClienteRequest, PaginatedResponse } from '../types'

export const clienteService = {
  async getClientes(page = 0, size = 10, search?: string): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    })
    
    const response = await api.get<PaginatedResponse<Cliente>>(`/clientes?${params}`)
    return response.data
  },

  async getClienteById(id: string): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`)
    return response.data
  },

  async createCliente(cliente: ClienteRequest): Promise<Cliente> {
    const response = await api.post<Cliente>('/clientes', cliente)
    return response.data
  },

  async updateCliente(id: string, cliente: Partial<ClienteRequest>): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, cliente)
    return response.data
  },

  async searchClientes(search: string): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>(`/clientes/search?q=${encodeURIComponent(search)}`)
    return response.data
  },
}
