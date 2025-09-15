import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response)
    return response
  },
  (error) => {
    console.log('API Error:', error)
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      toast.error('Você não tem permissão para realizar esta ação')
    } else if (error.response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Ocorreu um erro inesperado')
    }
    
    return Promise.reject(error)
  }
)

export default api
