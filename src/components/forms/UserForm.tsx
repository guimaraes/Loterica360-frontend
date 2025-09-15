import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { User } from '../../types'
import { UserRequest, UserUpdateRequest } from '../../services/userService'
import { userService } from '../../services/userService'
import toast from 'react-hot-toast'

const userSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  papel: z.enum(['ADMIN', 'GERENTE', 'VENDEDOR', 'AUDITOR'], {
    required_error: 'Selecione um papel',
  }),
  ativo: z.boolean().default(true),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: User
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

const papelOptions = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GERENTE', label: 'Gerente' },
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'AUDITOR', label: 'Auditor' },
]

export function UserForm({ user, onSuccess, onCancel, isEditing = false }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      papel: user?.papel || 'VENDEDOR',
      ativo: user?.ativo ?? true,
    },
  })


  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && user) {
        const updateData: UserUpdateRequest = {
          nome: data.nome,
          email: data.email,
          papel: data.papel,
          ativo: data.ativo,
        }
        await userService.updateUser(user.id, updateData)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        const createData: UserRequest = {
          nome: data.nome,
          email: data.email,
          senha: data.senha || '',
          papel: data.papel,
          ativo: data.ativo,
        }
        await userService.createUser(createData)
        toast.success('Usuário criado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
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
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Digite o email"
          error={errors.email?.message}
          disabled={isLoading}
        />
      </div>

      {!isEditing && (
        <Input
          {...register('senha')}
          type="password"
          label="Senha"
          placeholder="Digite a senha"
          error={errors.senha?.message}
          disabled={isLoading}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          {...register('papel')}
          label="Papel"
          options={papelOptions}
          placeholder="Selecione o papel"
          error={errors.papel?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <div className="flex items-center space-x-2">
            <input
              {...register('ativo')}
              type="checkbox"
              id="ativo"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="ativo" className="text-sm text-muted-foreground">
              Usuário ativo
            </label>
          </div>
        </div>
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
