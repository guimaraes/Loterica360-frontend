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
    
    const errorResponse = error.response?.data
    
    // Handle different error types based on the new error structure
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      const message = errorResponse?.detail || 'Você não tem permissão para realizar esta ação'
      toast.error(message)
    } else if (error.response?.status >= 500) {
      const message = errorResponse?.detail || 'Erro interno do servidor. Tente novamente mais tarde.'
      toast.error(message)
    } else if (errorResponse?.detail) {
      // Use the friendly error message from backend
      toast.error(errorResponse.detail)
      
      // Handle validation errors with specific field messages
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        errorResponse.errors.forEach((validationError: any) => {
          if (validationError.field && validationError.message) {
            toast.error(`${validationError.field}: ${validationError.message}`, {
              duration: 4000,
            })
          }
        })
      }
    } else if (error.response?.data?.message) {
      // Fallback to old message format
      toast.error(error.response.data.message)
    } else {
      toast.error('Ocorreu um erro inesperado')
    }
    
    return Promise.reject(error)
  }
)

export default api
