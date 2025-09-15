import api from './api'
import { User, LoginRequest, LoginResponse } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('authService.login - credentials:', credentials)
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    console.log('authService.login - response:', response.data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    console.log('authService.getCurrentUser - fazendo requisição')
    const response = await api.get<User>('/auth/me')
    console.log('authService.getCurrentUser - response:', response.data)
    return response.data
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/refresh')
    return response.data
  },
}
