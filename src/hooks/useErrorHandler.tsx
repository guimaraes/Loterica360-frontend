import { useCallback } from 'react'
import toast from 'react-hot-toast'

interface ValidationError {
  field: string
  message: string
  rejectedValue?: any
}

interface ErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  errors?: ValidationError[]
  timestamp: string
}

export function useErrorHandler() {
  const handleError = useCallback((error: any) => {
    console.error('Error handled:', error)
    
    const errorResponse: ErrorResponse = error.response?.data
    
    if (!errorResponse) {
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.')
      return
    }

    // Handle specific error types
    switch (error.response?.status) {
      case 400:
        handleBadRequestError(errorResponse)
        break
      case 401:
        handleUnauthorizedError(errorResponse)
        break
      case 403:
        handleForbiddenError(errorResponse)
        break
      case 404:
        handleNotFoundError(errorResponse)
        break
      case 409:
        handleConflictError(errorResponse)
        break
      case 422:
        handleValidationError(errorResponse)
        break
      case 500:
      case 502:
      case 503:
      case 504:
        handleServerError(errorResponse)
        break
      default:
        handleGenericError(errorResponse)
    }
  }, [])

  const handleBadRequestError = (errorResponse: ErrorResponse) => {
    if (errorResponse.errors && errorResponse.errors.length > 0) {
      // Show validation errors
      errorResponse.errors.forEach((validationError) => {
        const fieldName = getFieldDisplayName(validationError.field)
        toast.error(`${fieldName}: ${validationError.message}`, {
          duration: 5000,
        })
      })
    } else {
      toast.error(errorResponse.detail || 'Dados inválidos enviados')
    }
  }

  const handleUnauthorizedError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Sessão expirada'
    toast.error(message)
    
    // Redirect to login if it's an authentication error
    if (errorResponse.type?.includes('invalid-credentials') || 
        errorResponse.type?.includes('account-disabled') ||
        errorResponse.type?.includes('account-locked')) {
      setTimeout(() => {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }, 2000)
    }
  }

  const handleForbiddenError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Você não tem permissão para realizar esta ação'
    toast.error(message, {
      duration: 4000,
    })
  }

  const handleNotFoundError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Recurso não encontrado'
    toast.error(message)
  }

  const handleConflictError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Conflito de dados. Este registro já existe.'
    toast.error(message, {
      duration: 5000,
    })
  }

  const handleValidationError = (errorResponse: ErrorResponse) => {
    if (errorResponse.errors && errorResponse.errors.length > 0) {
      errorResponse.errors.forEach((validationError) => {
        const fieldName = getFieldDisplayName(validationError.field)
        toast.error(`${fieldName}: ${validationError.message}`, {
          duration: 5000,
        })
      })
    } else {
      toast.error(errorResponse.detail || 'Erro de validação')
    }
  }

  const handleServerError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Erro interno do servidor. Tente novamente mais tarde.'
    toast.error(message, {
      duration: 6000,
    })
  }

  const handleGenericError = (errorResponse: ErrorResponse) => {
    const message = errorResponse.detail || 'Ocorreu um erro inesperado'
    toast.error(message)
  }

  const getFieldDisplayName = (fieldName: string): string => {
    const fieldMap: Record<string, string> = {
      'nome': 'Nome',
      'email': 'Email',
      'senha': 'Senha',
      'papel': 'Perfil',
      'ativo': 'Status',
      'preco': 'Preço',
      'descricao': 'Descrição',
      'cpf': 'CPF',
      'telefone': 'Telefone',
      'quantidade': 'Quantidade',
      'valor': 'Valor',
      'dataVenda': 'Data da Venda',
      'caixaId': 'Caixa',
      'jogoId': 'Jogo',
      'clienteId': 'Cliente',
      'usuarioId': 'Usuário',
      'concurso': 'Concurso',
      'cotasTotais': 'Total de Cotas',
      'valorCota': 'Valor da Cota',
      'dataSorteio': 'Data do Sorteio',
    }
    
    return fieldMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  }

  return {
    handleError,
  }
}
