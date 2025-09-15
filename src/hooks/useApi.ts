import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

interface UseApiOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  retry?: number
}

export function useApi() {
  const queryClient = useQueryClient()

  const useQueryWrapper = <T>(
    queryKey: string[],
    queryFn: () => Promise<T>,
    options: UseApiOptions = {}
  ) => {
    return useQuery({
      queryKey,
      queryFn,
      enabled: options.enabled ?? true,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      retry: options.retry ?? 1,
    })
  }

  const useMutationWrapper = <TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: {
      onSuccess?: (data: TData) => void
      onError?: (error: any) => void
      invalidateQueries?: string[][]
      successMessage?: string
    } = {}
  ) => {
    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        if (options.onSuccess) {
          options.onSuccess(data)
        }
        if (options.invalidateQueries) {
          options.invalidateQueries.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey })
          })
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Ocorreu um erro inesperado'
        toast.error(message)
        if (options.onError) {
          options.onError(error)
        }
      },
    })
  }

  return {
    useQuery: useQueryWrapper,
    useMutation: useMutationWrapper,
    queryClient,
  }
}
