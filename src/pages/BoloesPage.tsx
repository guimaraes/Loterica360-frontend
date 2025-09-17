import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { BolaoForm } from '../components/forms/BolaoForm'
import { Plus, Search, Edit, Eye, EyeOff } from 'lucide-react'
import { Bolao } from '../types'
import { bolaoService } from '../services/bolaoService'
import toast from 'react-hot-toast'

export function BoloesPage() {
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingBolao, setEditingBolao] = useState<Bolao | undefined>(undefined)
  const [modalTitle, setModalTitle] = useState('Criar Novo Bolão')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    carregarBoloes()
  }, [currentPage])

  const carregarBoloes = async () => {
    try {
      setLoading(true)
      const response = await bolaoService.getBoloes(currentPage, 10, searchTerm)
      setBoloes(response.content || [])
      setTotalPages(response.totalPages || 0)
      setTotalElements(response.totalElements || 0)
    } catch (error) {
      console.error('Erro ao carregar bolões:', error)
      toast.error('Erro ao carregar bolões')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBolao = () => {
    setEditingBolao(undefined)
    setModalTitle('Criar Novo Bolão')
    setShowModal(true)
  }

  const handleEditBolao = (bolao: Bolao) => {
    setEditingBolao(bolao)
    setModalTitle(`Editar Bolão: ${bolao.concurso}`)
    setShowModal(true)
  }

  const handleToggleStatus = async (bolao: Bolao) => {
    try {
      await bolaoService.toggleBolaoStatus(bolao.id)
      toast.success(`Bolão ${bolao.status === 'ABERTO' ? 'encerrado' : 'reaberto'} com sucesso!`)
      carregarBoloes()
    } catch (error) {
      console.error('Erro ao alterar status do bolão:', error)
      toast.error('Erro ao alterar status do bolão')
    }
  }

  const handleModalSuccess = () => {
    setShowModal(false)
    setEditingBolao(undefined)
    carregarBoloes()
  }

  const handleModalCancel = () => {
    setShowModal(false)
    setEditingBolao(undefined)
  }

  const filteredBoloes = boloes.filter(bolao =>
    bolao && bolao.concurso && bolao.concurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bolao && bolao.jogo && bolao.jogo.nome && bolao.jogo.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (bolao && bolao.descricao && bolao.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTO':
        return 'bg-green-100 text-green-800'
      case 'ENCERRADO':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ABERTO':
        return 'Aberto'
      case 'ENCERRADO':
        return 'Encerrado'
      case 'CANCELADO':
        return 'Cancelado'
      default:
        return status
    }
  }

  const columns = [
    {
      key: 'concurso',
      label: 'Concurso',
      render: (_: any, bolao: Bolao) => bolao ? (
        <div>
          <div className="font-medium">{bolao.concurso}</div>
          {bolao.descricao && (
            <div className="text-sm text-gray-500">{bolao.descricao}</div>
          )}
        </div>
      ) : '-'
    },
    {
      key: 'jogo',
      label: 'Jogo',
      render: (_: any, bolao: Bolao) => bolao && bolao.jogo ? bolao.jogo.nome : '-'
    },
    {
      key: 'cotas',
      label: 'Cotas',
      render: (_: any, bolao: Bolao) => bolao ? (
        <div className="text-sm">
          <div>{bolao.cotasVendidas}/{bolao.cotasTotais}</div>
          <div className="text-gray-500">{bolao.cotasDisponiveis} disponíveis</div>
        </div>
      ) : '-'
    },
    {
      key: 'valorCota',
      label: 'Valor da Cota',
      render: (_: any, bolao: Bolao) => bolao && bolao.valorCota ? formatCurrency(bolao.valorCota) : '-'
    },
    {
      key: 'dataSorteio',
      label: 'Data do Sorteio',
      render: (_: any, bolao: Bolao) => bolao && bolao.dataSorteio ? formatDate(bolao.dataSorteio) : '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, bolao: Bolao) => bolao ? (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bolao.status)}`}>
          {getStatusLabel(bolao.status)}
        </span>
      ) : '-'
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, bolao: Bolao) => bolao ? (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditBolao(bolao)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(bolao)}
            className={bolao.status === 'ABERTO' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
          >
            {bolao.status === 'ABERTO' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      ) : '-'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gerenciamento de Bolões</CardTitle>
          <Button onClick={handleCreateBolao}>
            <Plus className="mr-2 h-4 w-4" /> Novo Bolão
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Buscar bolões..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>

          <Table
            columns={columns}
            data={filteredBoloes}
            loading={loading}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando {boloes.length} de {totalElements} bolões
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        title={modalTitle}
        isOpen={showModal}
        onClose={handleModalCancel}
      >
        <BolaoForm
          bolao={editingBolao}
          onSuccess={handleModalSuccess}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  )
}
