import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Venda } from '../../types'
import { vendaService } from '../../services/vendaService'
import toast from 'react-hot-toast'

const cancelVendaSchema = z.object({
  motivo: z.string().min(5, 'Motivo deve ter pelo menos 5 caracteres'),
})

type CancelVendaFormData = z.infer<typeof cancelVendaSchema>

interface CancelVendaModalProps {
  isOpen: boolean
  onClose: () => void
  venda: Venda | null
  onSuccess: () => void
}

export function CancelVendaModal({ isOpen, onClose, venda, onSuccess }: CancelVendaModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CancelVendaFormData>({
    resolver: zodResolver(cancelVendaSchema),
  })

  const onSubmit = async (data: CancelVendaFormData) => {
    if (!venda) return

    setIsLoading(true)
    try {
      await vendaService.cancelVenda(venda.id, data.motivo)
      toast.success('Venda cancelada com sucesso!')
      onSuccess()
      onClose()
      reset()
    } catch (error) {
      console.error('Erro ao cancelar venda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!venda) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cancelar Venda"
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Cancelando venda <strong>#{venda.id}</strong>
          </p>
          <p className="text-xs text-destructive">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <Input
          {...register('motivo')}
          label="Motivo do Cancelamento"
          placeholder="Digite o motivo do cancelamento"
          error={errors.motivo?.message}
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
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
