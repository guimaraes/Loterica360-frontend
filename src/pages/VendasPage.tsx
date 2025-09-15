import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { VendaForm } from '../components/forms/VendaForm'
import { CancelVendaModal } from '../components/forms/CancelVendaModal'
import { Plus, Search, Edit, X } from 'lucide-react'
import { Venda, TableColumn } from '../types'
import { formatCurrency, formatDateTime } from '../utils/format'
import toast from 'react-hot-toast'

export function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalVendas, setTotalVendas] = useState(0)
  const [sortKey, setSortKey] = useState<keyof Venda>('dataVenda')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null)

  const loadVendas = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (searchTerm) {
        filters.search = searchTerm
      }
      if (statusFilter) {
        filters.status = statusFilter
      }

      // Dados mock para demonstração
      const mockVendas: Venda[] = [
        {
          id: '1',
          turnoId: '1',
          jogoId: '1',
          tipoVenda: 'JOGO_INDIVIDUAL',
          valorTotal: 4.50,
          status: 'CONCLUIDA',
          dataVenda: '2024-01-15T10:30:00Z',
          numerosJogados: '01, 05, 12, 23, 35, 42',
          jogo: {
            id: '1',
            nome: 'Mega-Sena',
            codigo: 'MS',
            precoBase: 4.50,
            regrasJson: {},
            ativo: true,
          },
        },
        {
          id: '2',
          turnoId: '1',
          bolaoId: '1',
          tipoVenda: 'BOLAO',
          valorTotal: 25.00,
          status: 'CONCLUIDA',
          dataVenda: '2024-01-15T10:35:00Z',
          cotasCompradas: 5,
          bolao: {
            id: '1',
            jogoId: '1',
            concurso: '1234',
            descricao: 'Bolão Mega-Sena',
            cotasTotais: 100,
            cotasVendidas: 50,
            valorCota: 5.00,
            dataSorteio: '2024-01-20T20:00:00Z',
            status: 'ABERTO',
            jogo: {
              id: '1',
              nome: 'Mega-Sena',
              codigo: 'MS',
              precoBase: 4.50,
              regrasJson: {},
              ativo: true,
            },
          },
        },
      ]

      // Filtrar dados mock
      let filteredVendas = mockVendas
      if (searchTerm) {
        filteredVendas = filteredVendas.filter(venda => 
          venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venda.tipoVenda.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (statusFilter) {
        filteredVendas = filteredVendas.filter(venda => venda.status === statusFilter)
      }

      setVendas(filteredVendas)
      setTotalVendas(filteredVendas.length)

      // Comentado para usar dados mock
      // const response = await vendaService.getVendas(currentPage, pageSize, filters)
      // setVendas(response.content)
      // setTotalVendas(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
      toast.error('Erro ao carregar vendas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendas()
  }, [currentPage, pageSize, searchTerm, statusFilter])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(0)
  }

  const handleSort = (key: keyof Venda, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
    // Aqui você implementaria a lógica de ordenação no backend
  }

  const handleCreateVenda = () => {
    setSelectedVenda(null)
    setIsCreateModalOpen(true)
  }

  const handleEditVenda = (venda: Venda) => {
    setSelectedVenda(venda)
    setIsEditModalOpen(true)
  }

  const handleCancelVenda = (venda: Venda) => {
    setSelectedVenda(venda)
    setIsCancelModalOpen(true)
  }

  const handleModalSuccess = () => {
    loadVendas()
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsCancelModalOpen(false)
    setSelectedVenda(null)
  }

  const columns: TableColumn<Venda>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">#{value}</span>,
    },
    {
      key: 'tipoVenda',
      label: 'Tipo',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {value === 'JOGO_INDIVIDUAL' ? 'Jogo Individual' : 'Bolão'}
        </span>
      ),
    },
    {
      key: 'jogo',
      label: 'Jogo/Bolão',
      render: (_, venda) => {
        if (venda.tipoVenda === 'JOGO_INDIVIDUAL' && venda.jogo) {
          return <span className="text-sm">{venda.jogo.nome}</span>
        }
        if (venda.tipoVenda === 'BOLAO' && venda.bolao) {
          return <span className="text-sm">{venda.bolao.jogo?.nome} - Concurso {venda.bolao.concurso}</span>
        }
        return <span className="text-sm text-muted-foreground">-</span>
      },
    },
    {
      key: 'valorTotal',
      label: 'Valor',
      sortable: true,
      render: (value) => <span className="font-medium">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          value === 'CONCLUIDA' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'CONCLUIDA' ? 'Concluída' : 'Cancelada'}
        </span>
      ),
    },
    {
      key: 'dataVenda',
      label: 'Data/Hora',
      sortable: true,
      render: (value) => <span className="text-sm">{formatDateTime(value)}</span>,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, venda) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditVenda(venda)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {venda.status === 'CONCLUIDA' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancelVenda(venda)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as vendas realizadas
          </p>
        </div>
        <Button onClick={handleCreateVenda}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as vendas por status e termo de busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID ou tipo..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                placeholder="Todos os status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Todos os status' },
                  { value: 'CONCLUIDA', label: 'Concluída' },
                  { value: 'CANCELADA', label: 'Cancelada' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            {totalVendas} venda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            data={vendas}
            columns={columns}
            loading={loading}
            pagination={{
              page: currentPage,
              size: pageSize,
              total: totalVendas,
              onPageChange: setCurrentPage,
              onSizeChange: setPageSize,
            }}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Venda"
        size="xl"
      >
        <VendaForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Venda"
        size="xl"
      >
        <VendaForm
          venda={selectedVenda || undefined}
          onSuccess={handleModalSuccess}
          onCancel={() => setIsEditModalOpen(false)}
          isEditing
        />
      </Modal>

      <CancelVendaModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        venda={selectedVenda}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
