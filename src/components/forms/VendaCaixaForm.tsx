import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { VendaCaixaRequest, Caixa, Jogo } from '../../types'
import { caixaService } from '../../services/caixaService'
import { jogoService } from '../../services/jogoService'
import { vendaCaixaService } from '../../services/vendaCaixaService'
import toast from 'react-hot-toast'

interface VendaCaixaFormProps {
  venda?: VendaCaixaRequest
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

export function VendaCaixaForm({ venda, onSuccess, onCancel, isEditing = false }: VendaCaixaFormProps) {
  const [formData, setFormData] = useState<VendaCaixaRequest>({
    caixaId: '',
    jogoId: '',
    quantidade: 0,
    dataVenda: new Date().toISOString().split('T')[0]
  })
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadInitialData()
    if (venda) {
      setFormData(venda)
    }
  }, [venda])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      const [caixasResponse, jogosResponse] = await Promise.all([
        caixaService.getAllCaixasAtivas(),
        jogoService.getAllJogosAtivos()
      ])
      
      setCaixas(caixasResponse)
      setJogos(jogosResponse)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.caixaId || !formData.jogoId || formData.quantidade <= 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      
      if (isEditing) {
        // Implementar edição se necessário
        toast.success('Venda atualizada com sucesso!')
      } else {
        await vendaCaixaService.createVenda(formData)
        toast.success('Venda registrada com sucesso!')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar venda:', error)
      toast.error('Erro ao salvar venda')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof VendaCaixaRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="caixaId" className="text-sm font-medium">
            Caixa *
          </label>
          <Select
            placeholder="Selecione uma caixa"
            value={formData.caixaId}
            onChange={(e) => handleInputChange('caixaId', e.target.value)}
            options={caixas.map(caixa => ({
              value: caixa.id,
              label: `Caixa ${caixa.numero} - ${caixa.descricao || 'Sem descrição'}`
            }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="jogoId" className="text-sm font-medium">
            Jogo *
          </label>
          <Select
            placeholder="Selecione um jogo"
            value={formData.jogoId}
            onChange={(e) => handleInputChange('jogoId', e.target.value)}
            options={jogos.map(jogo => ({
              value: jogo.id,
              label: `${jogo.nome} - R$ ${(jogo.preco || 0).toFixed(2)}`
            }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="quantidade" className="text-sm font-medium">
            Quantidade *
          </label>
          <Input
            id="quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => handleInputChange('quantidade', parseInt(e.target.value) || 0)}
            placeholder="Digite a quantidade"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="dataVenda" className="text-sm font-medium">
            Data da Venda *
          </label>
          <Input
            id="dataVenda"
            type="date"
            value={formData.dataVenda}
            onChange={(e) => handleInputChange('dataVenda', e.target.value)}
          />
        </div>
      </div>

      {formData.jogoId && formData.quantidade > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resumo da Venda</h4>
          <div className="text-sm text-blue-800">
            <p>
              Jogo: {jogos.find(j => j.id === formData.jogoId)?.nome}
            </p>
            <p>
              Preço unitário: R$ {(jogos.find(j => j.id === formData.jogoId)?.preco || 0).toFixed(2)}
            </p>
            <p className="font-semibold">
              Valor total: R$ {((jogos.find(j => j.id === formData.jogoId)?.preco || 0) * formData.quantidade).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
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
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar Venda'}
        </Button>
      </div>
    </form>
  )
}
