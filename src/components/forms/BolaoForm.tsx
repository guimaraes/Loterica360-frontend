import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'
import { Bolao, BolaoRequest, BolaoUpdateRequest, Jogo } from '../../types'
import { bolaoService } from '../../services/bolaoService'
import { jogoService } from '../../services/jogoService'
import toast from 'react-hot-toast'

interface BolaoFormProps {
  bolao?: Bolao // Optional for editing
  onSuccess: () => void
  onCancel: () => void
}

export function BolaoForm({ bolao, onSuccess, onCancel }: BolaoFormProps) {
  const [formData, setFormData] = useState<BolaoRequest | BolaoUpdateRequest>({
    jogoId: '',
    concurso: '',
    descricao: '',
    cotasTotais: 0,
    valorCota: 0,
    dataSorteio: '',
  })
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadJogos()
    if (bolao) {
      setFormData({
        jogoId: bolao.jogo.id,
        concurso: bolao.concurso,
        descricao: bolao.descricao || '',
        cotasTotais: bolao.cotasTotais,
        valorCota: bolao.valorCota,
        dataSorteio: bolao.dataSorteio,
        status: bolao.status,
      })
    }
  }, [bolao])

  const loadJogos = async () => {
    try {
      const jogosAtivos = await jogoService.getAllJogosAtivos()
      setJogos(jogosAtivos)
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      toast.error('Erro ao carregar jogos')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'cotasTotais' || name === 'valorCota' 
        ? parseFloat(value) || 0 
        : value 
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (bolao) {
        // Update existing bolao
        await bolaoService.updateBolao(bolao.id, formData as BolaoUpdateRequest)
        toast.success('Bolão atualizado com sucesso!')
      } else {
        // Create new bolao
        await bolaoService.createBolao(formData as BolaoRequest)
        toast.success('Bolão criado com sucesso!')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar bolão')
      console.error('Erro ao salvar bolão:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="jogoId">Jogo</Label>
        <Select
          value={formData.jogoId}
          onChange={(e) => handleSelectChange('jogoId', e.target.value)}
          options={jogos.map((jogo) => ({ value: jogo.id, label: jogo.nome }))}
          placeholder="Selecione um jogo"
        />
      </div>

      <div>
        <Label htmlFor="concurso">Concurso</Label>
        <Input
          id="concurso"
          name="concurso"
          value={formData.concurso}
          onChange={handleInputChange}
          placeholder="Ex: 1234"
          required
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleInputChange}
          placeholder="Descrição do bolão (opcional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cotasTotais">Total de Cotas</Label>
          <Input
            id="cotasTotais"
            name="cotasTotais"
            type="number"
            min="1"
            value={formData.cotasTotais}
            onChange={handleInputChange}
            placeholder="100"
            required
          />
        </div>

        <div>
          <Label htmlFor="valorCota">Valor da Cota (R$)</Label>
          <Input
            id="valorCota"
            name="valorCota"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.valorCota}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dataSorteio">Data do Sorteio</Label>
        <Input
          id="dataSorteio"
          name="dataSorteio"
          type="date"
          value={formData.dataSorteio}
          onChange={handleInputChange}
          required
        />
      </div>

      {bolao && 'status' in formData && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            options={[
              { value: 'ABERTO', label: 'Aberto' },
              { value: 'ENCERRADO', label: 'Encerrado' },
              { value: 'CANCELADO', label: 'Cancelado' }
            ]}
            placeholder="Selecione o status"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
