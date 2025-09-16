import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { VendaCaixaForm } from '../components/forms/VendaCaixaForm'
import { ContagemCaixaForm } from '../components/forms/ContagemCaixaForm'
import { Plus, Search, Trash2, DollarSign, Calculator } from 'lucide-react'
import { VendaCaixa, ContagemCaixa, TableColumn } from '../types'
import { formatCurrency } from '../utils/format'
import { vendaCaixaService } from '../services/vendaCaixaService'
import { contagemCaixaService } from '../services/contagemCaixaService'
import toast from 'react-hot-toast'

type TabType = 'vendas' | 'contagem'

export function VendasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vendas')
  
  // Estados para vendas
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [vendasLoading, setVendasLoading] = useState(false)
  const [vendasSearchTerm, setVendasSearchTerm] = useState('')
  const [vendasCurrentPage, setVendasCurrentPage] = useState(0)
  const [vendasPageSize, setVendasPageSize] = useState(10)
  const [vendasTotal, setVendasTotal] = useState(0)
  
  // Estados para contagem
  const [contagens, setContagens] = useState<ContagemCaixa[]>([])
  const [contagensLoading, setContagensLoading] = useState(false)
  const [contagensSearchTerm, setContagensSearchTerm] = useState('')
  const [contagensCurrentPage, setContagensCurrentPage] = useState(0)
  const [contagensPageSize, setContagensPageSize] = useState(10)
  const [contagensTotal, setContagensTotal] = useState(0)

  // Estados dos modais
  const [isVendaModalOpen, setIsVendaModalOpen] = useState(false)
  const [isContagemModalOpen, setIsContagemModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<VendaCaixa | ContagemCaixa | null>(null)
  const [deleteType, setDeleteType] = useState<'venda' | 'contagem'>('venda')

  const loadVendas = async () => {
    setVendasLoading(true)
    try {
      const response = await vendaCaixaService.getVendas(vendasCurrentPage, vendasPageSize)
      setVendas(response.content)
      setVendasTotal(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
      toast.error('Erro ao carregar vendas')
    } finally {
      setVendasLoading(false)
    }
  }

  const loadContagens = async () => {
    setContagensLoading(true)
    try {
      const response = await contagemCaixaService.getContagens(contagensCurrentPage, contagensPageSize)
      setContagens(response.content)
      setContagensTotal(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar contagens:', error)
      toast.error('Erro ao carregar contagens')
    } finally {
      setContagensLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'vendas') {
      loadVendas()
    } else {
      loadContagens()
    }
  }, [activeTab, vendasCurrentPage, vendasPageSize, contagensCurrentPage, contagensPageSize])

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      if (deleteType === 'venda') {
        await vendaCaixaService.deleteVenda(selectedItem.id)
        toast.success('Venda excluída com sucesso!')
        loadVendas()
      } else {
        await contagemCaixaService.deleteContagem(selectedItem.id)
        toast.success('Contagem excluída com sucesso!')
        loadContagens()
      }
      setIsDeleteModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      toast.error('Erro ao excluir item')
    }
  }

  const handleModalSuccess = () => {
    if (activeTab === 'vendas') {
      loadVendas()
    } else {
      loadContagens()
    }
    setIsVendaModalOpen(false)
    setIsContagemModalOpen(false)
  }

  const vendasColumns: TableColumn<VendaCaixa>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => <span className="font-mono text-sm">#{value.slice(-8)}</span>,
    },
    {
      key: 'numeroCaixa',
      label: 'Caixa',
      render: (value, venda) => (
        <span className="font-medium">
          Caixa {value} - {venda.descricaoCaixa || 'Sem descrição'}
        </span>
      ),
    },
    {
      key: 'nomeJogo',
      label: 'Jogo',
      render: (value, venda) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            R$ {venda.precoJogo.toFixed(2)} cada
          </div>
        </div>
      ),
    },
    {
      key: 'quantidade',
      label: 'Qtd',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'valorTotal',
      label: 'Valor Total',
      render: (value) => <span className="font-medium text-green-600">{formatCurrency(value)}</span>,
    },
    {
      key: 'dataVenda',
      label: 'Data',
      render: (value) => <span className="text-sm">{new Date(value).toLocaleDateString('pt-BR')}</span>,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, venda) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedItem(venda)
              setDeleteType('venda')
              setIsDeleteModalOpen(true)
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const contagensColumns: TableColumn<ContagemCaixa>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => <span className="font-mono text-sm">#{value.slice(-8)}</span>,
    },
    {
      key: 'numeroCaixa',
      label: 'Caixa',
      render: (value, contagem) => (
        <span className="font-medium">
          Caixa {value} - {contagem.descricaoCaixa || 'Sem descrição'}
        </span>
      ),
    },
    {
      key: 'totalGeral',
      label: 'Total',
      render: (value) => <span className="font-medium text-green-600">{formatCurrency(value)}</span>,
    },
    {
      key: 'totalNotas',
      label: 'Notas',
      render: (value) => <span className="text-sm">{formatCurrency(value)}</span>,
    },
    {
      key: 'totalMoedas',
      label: 'Moedas',
      render: (value) => <span className="text-sm">{formatCurrency(value)}</span>,
    },
    {
      key: 'dataContagem',
      label: 'Data',
      render: (value) => <span className="text-sm">{new Date(value).toLocaleDateString('pt-BR')}</span>,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, contagem) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedItem(contagem)
              setDeleteType('contagem')
              setIsDeleteModalOpen(true)
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas e Contagem</h1>
          <p className="text-muted-foreground">
            Gerencie vendas por caixa e contagem de cédulas/moedas
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'vendas' ? (
            <Button onClick={() => setIsVendaModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          ) : (
            <Button onClick={() => setIsContagemModalOpen(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Nova Contagem
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'vendas' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('vendas')}
          className="flex items-center space-x-2"
        >
          <DollarSign className="h-4 w-4" />
          <span>Vendas</span>
        </Button>
        <Button
          variant={activeTab === 'contagem' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('contagem')}
          className="flex items-center space-x-2"
        >
          <Calculator className="h-4 w-4" />
          <span>Contagem</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            {activeTab === 'vendas' ? 'Filtre as vendas' : 'Filtre as contagens'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={activeTab === 'vendas' ? 'Buscar vendas...' : 'Buscar contagens...'}
                  value={activeTab === 'vendas' ? vendasSearchTerm : contagensSearchTerm}
                  onChange={(e) => {
                    if (activeTab === 'vendas') {
                      setVendasSearchTerm(e.target.value)
                    } else {
                      setContagensSearchTerm(e.target.value)
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'vendas' ? 'Lista de Vendas' : 'Lista de Contagens'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'vendas' 
              ? `${vendasTotal} venda(s) encontrada(s)`
              : `${contagensTotal} contagem(ns) encontrada(s)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === 'vendas' ? (
            <Table
              data={vendas}
              columns={vendasColumns}
              loading={vendasLoading}
              pagination={{
                page: vendasCurrentPage,
                size: vendasPageSize,
                total: vendasTotal,
                onPageChange: setVendasCurrentPage,
                onSizeChange: setVendasPageSize,
              }}
            />
          ) : (
            <Table
              data={contagens}
              columns={contagensColumns}
              loading={contagensLoading}
              pagination={{
                page: contagensCurrentPage,
                size: contagensPageSize,
                total: contagensTotal,
                onPageChange: setContagensCurrentPage,
                onSizeChange: setContagensPageSize,
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isVendaModalOpen}
        onClose={() => setIsVendaModalOpen(false)}
        title="Nova Venda"
        size="xl"
      >
        <VendaCaixaForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsVendaModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isContagemModalOpen}
        onClose={() => setIsContagemModalOpen(false)}
        title="Nova Contagem"
        size="xl"
      >
        <ContagemCaixaForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsContagemModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Excluir ${deleteType === 'venda' ? 'Venda' : 'Contagem'}`}
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir esta {deleteType === 'venda' ? 'venda' : 'contagem'}?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}