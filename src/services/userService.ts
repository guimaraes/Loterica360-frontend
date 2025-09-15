import { api } from './api'
import { User, PaginatedResponse, ApiResponse } from '../types'

export interface UserRequest {
  nome: string
  email: string
  senha: string
  papel: 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'AUDITOR'
  ativo?: boolean
}

export interface UserUpdateRequest {
  nome?: string
  email?: string
  papel?: 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'AUDITOR'
  ativo?: boolean
}

export interface UserPasswordRequest {
  senhaAtual: string
  novaSenha: string
}

export const userService = {
  // Listar usuários com paginação
  async getUsers(page = 0, size = 10, search?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    })
    
    const response = await api.get<PaginatedResponse<User>>(`/usuarios?${params}`)
    return response.data
  },

  // Buscar usuário por ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/usuarios/${id}`)
    return response.data.data
  },

  // Criar novo usuário
  async createUser(userData: UserRequest): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/usuarios', userData)
    return response.data.data
  },

  // Atualizar usuário
  async updateUser(id: string, userData: UserUpdateRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/usuarios/${id}`, userData)
    return response.data.data
  },

  // Alterar senha do usuário
  async changePassword(id: string, passwordData: UserPasswordRequest): Promise<void> {
    await api.put(`/usuarios/${id}/senha`, passwordData)
  },

  // Ativar/Desativar usuário
  async toggleUserStatus(id: string, ativo: boolean): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`/usuarios/${id}/status`, { ativo })
    return response.data.data
  },

  // Excluir usuário
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },
}
