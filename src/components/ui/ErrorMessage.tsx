import { AlertCircle, X, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface ErrorMessageProps {
  type?: 'error' | 'success' | 'warning' | 'info'
  title?: string
  message: string
  details?: string[]
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export function ErrorMessage({
  type = 'error',
  title,
  message,
  details = [],
  onClose,
  autoClose = true,
  duration = 5000,
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  // Auto close after duration
  if (autoClose && duration > 0) {
    setTimeout(() => {
      setIsVisible(false)
    }, duration)
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-red-50 border-red-200'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-800'
      case 'success':
        return 'text-green-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-red-800'
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full`}>
      <div className={`rounded-lg border p-4 shadow-lg ${getBgColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${getTextColor()}`}>
                {title}
              </h3>
            )}
            <div className={`mt-1 text-sm ${getTextColor()}`}>
              <p>{message}</p>
              {details.length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${getTextColor()} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-current`}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para usar o ErrorMessage de forma mais simples
export function useErrorMessage() {
  const [messages, setMessages] = useState<Array<ErrorMessageProps & { id: string }>>([])

  const showError = (message: string, details?: string[], title?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setMessages(prev => [...prev, {
      id,
      type: 'error',
      title: title || 'Erro',
      message,
      details,
      onClose: () => removeMessage(id),
    }])
  }

  const showSuccess = (message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setMessages(prev => [...prev, {
      id,
      type: 'success',
      title: title || 'Sucesso',
      message,
      onClose: () => removeMessage(id),
    }])
  }

  const showWarning = (message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setMessages(prev => [...prev, {
      id,
      type: 'warning',
      title: title || 'Atenção',
      message,
      onClose: () => removeMessage(id),
    }])
  }

  const showInfo = (message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setMessages(prev => [...prev, {
      id,
      type: 'info',
      title: title || 'Informação',
      message,
      onClose: () => removeMessage(id),
    }])
  }

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }

  const clearAll = () => {
    setMessages([])
  }

  const MessageContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <ErrorMessage
          key={message.id}
          type={message.type}
          title={message.title}
          message={message.message}
          details={message.details}
          onClose={message.onClose}
          autoClose={true}
          duration={5000}
        />
      ))}
    </div>
  )

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    clearAll,
    MessageContainer,
  }
}
