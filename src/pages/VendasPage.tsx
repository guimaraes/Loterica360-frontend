import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { Plus } from 'lucide-react'
import { Venda, TableColumn } from '../types'
import { formatCurrency, formatDateTime } from '../utils/format'

export function VendasPage() {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Mock data - substituir por dados reais da API
  const vendas: Venda[] = [
    {
      id: '1',
      turnoId: '1',
      jogoId: '1',
      tipoVenda: 'JOGO_INDIVIDUAL',
      valorTotal: 4.50,
      status: 'CONCLUIDA',
      dataVenda: '2024-01-15T10:30:00Z',
      numerosJogados: '01, 05, 12, 23, 35, 42',
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
    },
  ]

  const columns: TableColumn<Venda>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>,
    },
    {
      key: 'tipoVenda',
      label: 'Tipo',
      render: (value) => (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {value === 'JOGO_INDIVIDUAL' ? 'Jogo Individual' : 'Bolão'}
        </span>
      ),
    },
    {
      key: 'valorTotal',
      label: 'Valor',
      render: (value) => <span className="font-medium">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
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
      render: (value) => <span className="text-sm">{formatDateTime(value)}</span>,
    },
  ]

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.tipoVenda.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || venda.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as vendas realizadas
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
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
              <Input
                placeholder="Buscar por ID ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            {filteredVendas.length} venda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            data={filteredVendas}
            columns={columns}
            onRowClick={(venda) => console.log('Venda selecionada:', venda)}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nova Venda"
        size="lg"
      >
        <div className="space-y-4">
          <p>Formulário de nova venda será implementado aqui.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
