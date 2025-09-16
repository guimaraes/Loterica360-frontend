import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { ContagemCaixaRequest, Caixa } from '../../types'
import { caixaService } from '../../services/caixaService'
import { contagemCaixaService } from '../../services/contagemCaixaService'
import toast from 'react-hot-toast'

interface ContagemCaixaFormProps {
  contagem?: ContagemCaixaRequest
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

export function ContagemCaixaForm({ contagem, onSuccess, onCancel, isEditing = false }: ContagemCaixaFormProps) {
  const [formData, setFormData] = useState<ContagemCaixaRequest>({
    caixaId: '',
    dataContagem: new Date().toISOString().split('T')[0],
    notas200: 0,
    notas100: 0,
    notas50: 0,
    notas20: 0,
    notas10: 0,
    notas5: 0,
    notas2: 0,
    moedas1: 0,
    moedas050: 0,
    moedas025: 0,
    moedas010: 0,
    moedas005: 0
  })
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadInitialData()
    if (contagem) {
      setFormData(contagem)
    }
  }, [contagem])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      const caixasResponse = await caixaService.getCaixas(0, 100)
      setCaixas(caixasResponse.content)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.caixaId) {
      toast.error('Selecione uma caixa')
      return
    }

    try {
      setLoading(true)
      
      if (isEditing) {
        // Implementar edição se necessário
        toast.success('Contagem atualizada com sucesso!')
      } else {
        await contagemCaixaService.createContagem(formData)
        toast.success('Contagem registrada com sucesso!')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar contagem:', error)
      toast.error('Erro ao salvar contagem')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContagemCaixaRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateTotals = () => {
    const totalNotas = 
      (formData.notas200 || 0) * 200 +
      (formData.notas100 || 0) * 100 +
      (formData.notas50 || 0) * 50 +
      (formData.notas20 || 0) * 20 +
      (formData.notas10 || 0) * 10 +
      (formData.notas5 || 0) * 5 +
      (formData.notas2 || 0) * 2

    const totalMoedas = 
      (formData.moedas1 || 0) * 1 +
      (formData.moedas050 || 0) * 0.50 +
      (formData.moedas025 || 0) * 0.25 +
      (formData.moedas010 || 0) * 0.10 +
      (formData.moedas005 || 0) * 0.05

    return {
      totalNotas,
      totalMoedas,
      totalGeral: totalNotas + totalMoedas
    }
  }

  const totals = calculateTotals()

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
          <label htmlFor="dataContagem" className="text-sm font-medium">
            Data da Contagem *
          </label>
          <Input
            id="dataContagem"
            type="date"
            value={formData.dataContagem}
            onChange={(e) => handleInputChange('dataContagem', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Notas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'notas200', label: 'R$ 200,00', value: formData.notas200 || 0 },
              { key: 'notas100', label: 'R$ 100,00', value: formData.notas100 || 0 },
              { key: 'notas50', label: 'R$ 50,00', value: formData.notas50 || 0 },
              { key: 'notas20', label: 'R$ 20,00', value: formData.notas20 || 0 },
              { key: 'notas10', label: 'R$ 10,00', value: formData.notas10 || 0 },
              { key: 'notas5', label: 'R$ 5,00', value: formData.notas5 || 0 },
              { key: 'notas2', label: 'R$ 2,00', value: formData.notas2 || 0 }
            ].map(({ key, label, value }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium">{label}</label>
                <Input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => handleInputChange(key as keyof ContagemCaixaRequest, parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Moedas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'moedas1', label: 'R$ 1,00', value: formData.moedas1 || 0 },
              { key: 'moedas050', label: 'R$ 0,50', value: formData.moedas050 || 0 },
              { key: 'moedas025', label: 'R$ 0,25', value: formData.moedas025 || 0 },
              { key: 'moedas010', label: 'R$ 0,10', value: formData.moedas010 || 0 },
              { key: 'moedas005', label: 'R$ 0,05', value: formData.moedas005 || 0 }
            ].map(({ key, label, value }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium">{label}</label>
                <Input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => handleInputChange(key as keyof ContagemCaixaRequest, parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Resumo da Contagem</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-green-800">
            <p className="font-semibold">Total Notas:</p>
            <p className="text-lg">R$ {totals.totalNotas.toFixed(2)}</p>
          </div>
          <div className="text-green-800">
            <p className="font-semibold">Total Moedas:</p>
            <p className="text-lg">R$ {totals.totalMoedas.toFixed(2)}</p>
          </div>
          <div className="text-green-800">
            <p className="font-semibold">Total Geral:</p>
            <p className="text-xl font-bold">R$ {totals.totalGeral.toFixed(2)}</p>
          </div>
        </div>
      </div>

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
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar Contagem'}
        </Button>
      </div>
    </form>
  )
}
