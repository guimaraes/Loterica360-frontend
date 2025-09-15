import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { ClienteForm } from '../components/forms/ClienteForm'
import { Plus, Search, Edit } from 'lucide-react'
import { Cliente, TableColumn } from '../types'
import { formatCPF, formatPhone } from '../utils/format'
import { clienteService } from '../services/clienteService'
import toast from 'react-hot-toast'

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalClientes, setTotalClientes] = useState(0)
  const [sortKey, setSortKey] = useState<keyof Cliente>('nome')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const loadClientes = async () => {
    setLoading(true)
    try {
      const response = await clienteService.getClientes(currentPage, pageSize, searchTerm)
      console.log('Dados recebidos da API:', response)
      console.log('Clientes recebidos:', response.content)
      setClientes(response.content)
      setTotalClientes(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [currentPage, pageSize, searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(0)
  }

  const handleSort = (key: keyof Cliente, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
    // Aqui você implementaria a lógica de ordenação no backend
  }

  const handleCreateCliente = () => {
    setSelectedCliente(null)
    setIsCreateModalOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsEditModalOpen(true)
  }

  const handleModalSuccess = () => {
    loadClientes()
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedCliente(null)
  }

  const columns: TableColumn<Cliente>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'cpf',
      label: 'CPF',
      sortable: true,
      render: (value) => value ? formatCPF(value) : '-',
    },
    {
      key: 'telefone',
      label: 'Telefone',
      sortable: true,
      render: (value) => value ? formatPhone(value) : '-',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'consentimentoLgpd',
      label: 'LGPD',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Sim' : 'Não'}
        </span>
      ),
    },
    {
      key: 'criadoEm',
      label: 'Criado em',
      sortable: true,
      render: (value) => {
        if (!value) return '-'
        return new Date(value).toLocaleDateString('pt-BR')
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, cliente) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCliente(cliente)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes cadastrados
          </p>
        </div>
        <Button onClick={handleCreateCliente}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie todos os clientes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table
              data={clientes}
              columns={columns}
              loading={loading}
              pagination={{
                page: currentPage,
                size: pageSize,
                total: totalClientes,
                onPageChange: setCurrentPage,
                onSizeChange: setPageSize,
              }}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Cliente"
        size="lg"
      >
        <ClienteForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
        size="lg"
      >
        <ClienteForm
          cliente={selectedCliente || undefined}
          onSuccess={handleModalSuccess}
          onCancel={() => setIsEditModalOpen(false)}
          isEditing
        />
      </Modal>

    </div>
  )
}
