import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Cliente, ClienteRequest } from '../../types'
import { clienteService } from '../../services/clienteService'
import toast from 'react-hot-toast'

const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().optional().refine((val) => {
    if (!val) return true
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/
    return cpfRegex.test(val)
  }, 'CPF deve ter 11 dígitos ou formato válido'),
  telefone: z.string().optional().refine((val) => {
    if (!val) return true
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$|^\d{10,11}$/
    return phoneRegex.test(val)
  }, 'Telefone deve ter formato válido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  consentimentoLgpd: z.boolean().refine((val) => val === true, 'Consentimento LGPD é obrigatório'),
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
  cliente?: Cliente
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

export function ClienteForm({ cliente, onSuccess, onCancel, isEditing = false }: ClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: cliente?.nome || '',
      cpf: cliente?.cpf || '',
      telefone: cliente?.telefone || '',
      email: cliente?.email || '',
      consentimentoLgpd: cliente?.consentimentoLgpd ?? false,
    },
  })


  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const onSubmit = async (data: ClienteFormData) => {
    setIsLoading(true)
    try {
      // Limpar formatação dos campos
      const clienteData: ClienteRequest = {
        nome: data.nome,
        cpf: data.cpf ? data.cpf.replace(/\D/g, '') : undefined,
        telefone: data.telefone ? data.telefone.replace(/\D/g, '') : undefined,
        email: data.email || undefined,
        consentimentoLgpd: data.consentimentoLgpd,
      }

      if (isEditing && cliente) {
        await clienteService.updateCliente(cliente.id, clienteData)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await clienteService.createCliente(clienteData)
        toast.success('Cliente criado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('nome')}
          label="Nome Completo"
          placeholder="Digite o nome completo"
          error={errors.nome?.message}
          disabled={isLoading}
        />

        <Input
          {...register('cpf')}
          label="CPF"
          placeholder="000.000.000-00"
          error={errors.cpf?.message}
          disabled={isLoading}
          onChange={(e) => {
            const formatted = formatCPF(e.target.value)
            e.target.value = formatted
            register('cpf').onChange(e)
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('telefone')}
          label="Telefone"
          placeholder="(00) 00000-0000"
          error={errors.telefone?.message}
          disabled={isLoading}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value)
            e.target.value = formatted
            register('telefone').onChange(e)
          }}
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Digite o email"
          error={errors.email?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            {...register('consentimentoLgpd')}
            type="checkbox"
            id="consentimentoLgpd"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="consentimentoLgpd" className="text-sm text-muted-foreground">
            Consentimento LGPD - Autorizo o tratamento dos meus dados pessoais
          </label>
        </div>
        {errors.consentimentoLgpd && (
          <p className="text-sm text-destructive">{errors.consentimentoLgpd.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
