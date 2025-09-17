import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Jogo, JogoRequest, JogoUpdateRequest } from '../../types'
import { jogoService } from '../../services/jogoService'
import toast from 'react-hot-toast'

interface JogoFormProps {
  jogo?: Jogo
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

export function JogoForm({ jogo, onSuccess, onCancel, isEditing = false }: JogoFormProps) {
  const [formData, setFormData] = useState<JogoRequest>({
    nome: '',
    descricao: '',
    preco: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (jogo && isEditing) {
      setFormData({
        nome: jogo.nome,
        descricao: jogo.descricao || '',
        preco: jogo.preco
      })
    }
  }, [jogo, isEditing])

  const handleInputChange = (field: keyof JogoRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || formData.preco <= 0) {
      toast.error('Nome e preço são obrigatórios')
      return
    }

    try {
      setLoading(true)
      
      if (isEditing && jogo) {
        const updateData: JogoUpdateRequest = {
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          preco: formData.preco
        }
        await jogoService.updateJogo(jogo.id, updateData)
        toast.success('Jogo atualizado com sucesso!')
      } else {
        await jogoService.createJogo(formData)
        toast.success('Jogo criado com sucesso!')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar jogo:', error)
      toast.error('Erro ao salvar jogo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Jogo *
        </label>
        <Input
          id="nome"
          type="text"
          placeholder="Ex: Mega Sena"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          placeholder="Descrição do jogo..."
          value={formData.descricao}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
          Preço (R$) *
        </label>
        <Input
          id="preco"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={formData.preco}
          onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}
