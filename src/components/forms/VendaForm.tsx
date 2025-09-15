import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Venda, VendaRequest, Jogo, Bolao, Cliente, Turno } from '../../types'
import { vendaService } from '../../services/vendaService'
import { jogoService } from '../../services/jogoService'
import { bolaoService } from '../../services/bolaoService'
import { clienteService } from '../../services/clienteService'
import { turnoService } from '../../services/turnoService'
import { formatCurrency } from '../../utils/format'
import toast from 'react-hot-toast'
import { Plus, Trash2, Search } from 'lucide-react'

const vendaSchema = z.object({
  turnoId: z.string().min(1, 'Turno é obrigatório'),
  tipoVenda: z.enum(['JOGO_INDIVIDUAL', 'BOLAO'], {
    required_error: 'Selecione o tipo de venda',
  }),
  jogoId: z.string().optional(),
  bolaoId: z.string().optional(),
  clienteId: z.string().optional(),
  numerosJogados: z.string().optional(),
  cotasCompradas: z.number().min(1).optional(),
  valorTotal: z.number().min(0.01, 'Valor deve ser maior que zero'),
  pagamentos: z.array(z.object({
    metodoPagamento: z.enum(['DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO']),
    valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  })).min(1, 'Pelo menos um pagamento é obrigatório'),
}).refine((data) => {
  if (data.tipoVenda === 'JOGO_INDIVIDUAL' && !data.jogoId) {
    return false
  }
  if (data.tipoVenda === 'BOLAO' && !data.bolaoId) {
    return false
  }
  return true
}, {
  message: 'Jogo ou Bolão é obrigatório conforme o tipo de venda',
  path: ['tipoVenda'],
})

type VendaFormData = z.infer<typeof vendaSchema>

interface VendaFormProps {
  venda?: Venda
  onSuccess: () => void
  onCancel: () => void
  isEditing?: boolean
}

const tipoVendaOptions = [
  { value: 'JOGO_INDIVIDUAL', label: 'Jogo Individual' },
  { value: 'BOLAO', label: 'Bolão' },
]

const metodoPagamentoOptions = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'PIX', label: 'PIX' },
  { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
]

export function VendaForm({ venda, onSuccess, onCancel, isEditing = false }: VendaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [, setTurnoAtivo] = useState<Turno | null>(null)
  const [clienteSearch, setClienteSearch] = useState('')
  const [showClienteSearch, setShowClienteSearch] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<VendaFormData>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      turnoId: venda?.turnoId || '',
      tipoVenda: venda?.tipoVenda || 'JOGO_INDIVIDUAL',
      jogoId: venda?.jogoId || '',
      bolaoId: venda?.bolaoId || '',
      clienteId: venda?.clienteId || '',
      numerosJogados: venda?.numerosJogados || '',
      cotasCompradas: venda?.cotasCompradas || 1,
      valorTotal: venda?.valorTotal || 0,
      pagamentos: venda?.pagamentos?.map(p => ({
        metodoPagamento: p.metodoPagamento,
        valor: p.valor,
      })) || [{ metodoPagamento: 'DINHEIRO', valor: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pagamentos',
  })

  const watchedTipoVenda = watch('tipoVenda')
  const watchedPagamentos = watch('pagamentos')

  // Calcular valor total dos pagamentos
  const valorTotalPagamentos = watchedPagamentos.reduce((sum, pagamento) => sum + (pagamento.valor || 0), 0)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (watchedTipoVenda === 'JOGO_INDIVIDUAL') {
      loadJogos()
    } else if (watchedTipoVenda === 'BOLAO') {
      loadBoloes()
    }
  }, [watchedTipoVenda])

  useEffect(() => {
    setValue('valorTotal', valorTotalPagamentos)
  }, [valorTotalPagamentos, setValue])

  const loadInitialData = async () => {
    try {
      const [turnoAtivoData, turnosData] = await Promise.all([
        turnoService.getTurnoAtivo(),
        turnoService.getTurnos(0, 10, { status: 'ABERTO' }),
      ])
      
      setTurnoAtivo(turnoAtivoData)
      setTurnos(turnosData.content)
      
      if (turnoAtivoData && !venda) {
        setValue('turnoId', turnoAtivoData.id)
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
    }
  }

  const loadJogos = async () => {
    try {
      const jogosData = await jogoService.getAllJogosAtivos()
      setJogos(jogosData)
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
    }
  }

  const loadBoloes = async () => {
    try {
      const boloesData = await bolaoService.getBoloes(0, 50, { status: 'ABERTO' })
      setBoloes(boloesData.content)
    } catch (error) {
      console.error('Erro ao carregar bolões:', error)
    }
  }

  const searchClientes = async (search: string) => {
    if (search.length < 2) return
    
    try {
      const clientesData = await clienteService.searchClientes(search)
      setClientes(clientesData)
      setShowClienteSearch(true)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const handleClienteSelect = (cliente: Cliente) => {
    setValue('clienteId', cliente.id)
    setClienteSearch(cliente.nome)
    setShowClienteSearch(false)
  }

  const addPagamento = () => {
    append({ metodoPagamento: 'DINHEIRO', valor: 0 })
  }

  const onSubmit = async (data: VendaFormData) => {
    setIsLoading(true)
    try {
      const vendaData: VendaRequest = {
        turnoId: data.turnoId,
        tipoVenda: data.tipoVenda,
        jogoId: data.jogoId,
        bolaoId: data.bolaoId,
        clienteId: data.clienteId,
        valorTotal: data.valorTotal,
        numerosJogados: data.numerosJogados,
        cotasCompradas: data.cotasCompradas,
        pagamentos: data.pagamentos,
      }

      if (isEditing && venda) {
        await vendaService.updateVenda(venda.id, vendaData)
        toast.success('Venda atualizada com sucesso!')
      } else {
        await vendaService.createVenda(vendaData)
        toast.success('Venda criada com sucesso!')
      }
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar venda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              {...register('turnoId')}
              label="Turno"
              options={turnos.map(t => ({ value: t.id, label: `Turno ${t.id} - ${new Date(t.dataAbertura).toLocaleDateString()}` }))}
              placeholder="Selecione o turno"
              error={errors.turnoId?.message}
              disabled={isLoading}
            />

            <Select
              {...register('tipoVenda')}
              label="Tipo de Venda"
              options={tipoVendaOptions}
              placeholder="Selecione o tipo"
              error={errors.tipoVenda?.message}
              disabled={isLoading}
            />
          </div>

          {watchedTipoVenda === 'JOGO_INDIVIDUAL' && (
            <div className="space-y-4">
              <Select
                {...register('jogoId')}
                label="Jogo"
                options={jogos.map(j => ({ value: j.id, label: `${j.nome} - ${formatCurrency(j.precoBase)}` }))}
                placeholder="Selecione o jogo"
                error={errors.jogoId?.message}
                disabled={isLoading}
              />

              <Input
                {...register('numerosJogados')}
                label="Números Jogados"
                placeholder="Ex: 01, 05, 12, 23, 35, 42"
                error={errors.numerosJogados?.message}
                disabled={isLoading}
              />
            </div>
          )}

          {watchedTipoVenda === 'BOLAO' && (
            <div className="space-y-4">
              <Select
                {...register('bolaoId')}
                label="Bolão"
                options={boloes.map(b => ({ 
                  value: b.id, 
                  label: `${b.jogo?.nome} - Concurso ${b.concurso} - ${formatCurrency(b.valorCota)}/cota` 
                }))}
                placeholder="Selecione o bolão"
                error={errors.bolaoId?.message}
                disabled={isLoading}
              />

              <Input
                {...register('cotasCompradas', { valueAsNumber: true })}
                type="number"
                label="Cotas Compradas"
                placeholder="Quantidade de cotas"
                error={errors.cotasCompradas?.message}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente (Opcional)</label>
            <div className="relative">
              <Input
                value={clienteSearch}
                onChange={(e) => {
                  setClienteSearch(e.target.value)
                  searchClientes(e.target.value)
                }}
                placeholder="Buscar cliente..."
                disabled={isLoading}
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              
              {showClienteSearch && clientes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleClienteSelect(cliente)}
                    >
                      <div className="font-medium">{cliente.nome}</div>
                      {cliente.cpf && <div className="text-sm text-gray-500">CPF: {cliente.cpf}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>
            Valor total: {formatCurrency(valorTotalPagamentos)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-4 items-end">
              <div className="flex-1">
                <Select
                  {...register(`pagamentos.${index}.metodoPagamento`)}
                  label="Método de Pagamento"
                  options={metodoPagamentoOptions}
                  placeholder="Selecione o método"
                  error={errors.pagamentos?.[index]?.metodoPagamento?.message}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`pagamentos.${index}.valor`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  label="Valor"
                  placeholder="0.00"
                  error={errors.pagamentos?.[index]?.valor?.message}
                  disabled={isLoading}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPagamento}
            disabled={isLoading}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pagamento
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Venda'}
        </Button>
      </div>
    </form>
  )
}
