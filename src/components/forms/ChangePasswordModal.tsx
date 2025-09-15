import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { User } from '../../types'
import { userService } from '../../services/userService'
import toast from 'react-hot-toast'

const passwordSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(6, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'Senhas não coincidem',
  path: ['confirmarSenha'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSuccess: () => void
}

export function ChangePasswordModal({ isOpen, onClose, user, onSuccess }: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    if (!user) return

    setIsLoading(true)
    try {
      await userService.changePassword(user.id, {
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha,
      })
      toast.success('Senha alterada com sucesso!')
      onSuccess()
      onClose()
      reset()
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Alterar Senha"
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Alterando senha para: <strong>{user.nome}</strong>
          </p>
        </div>

        <Input
          {...register('senhaAtual')}
          type="password"
          label="Senha Atual"
          placeholder="Digite a senha atual"
          error={errors.senhaAtual?.message}
          disabled={isLoading}
        />

        <Input
          {...register('novaSenha')}
          type="password"
          label="Nova Senha"
          placeholder="Digite a nova senha"
          error={errors.novaSenha?.message}
          disabled={isLoading}
        />

        <Input
          {...register('confirmarSenha')}
          type="password"
          label="Confirmar Nova Senha"
          placeholder="Confirme a nova senha"
          error={errors.confirmarSenha?.message}
          disabled={isLoading}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
