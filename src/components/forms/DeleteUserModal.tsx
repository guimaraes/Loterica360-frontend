import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { User } from '../../types'
import { userService } from '../../services/userService'
import toast from 'react-hot-toast'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSuccess: () => void
}

export function DeleteUserModal({ isOpen, onClose, user, onSuccess }: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await userService.deleteUser(user.id)
      toast.success('Usuário excluído com sucesso!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Exclusão"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir o usuário <strong>{user.nome}</strong>?
        </p>
        <p className="text-xs text-destructive">
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
