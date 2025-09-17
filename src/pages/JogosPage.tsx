import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { JogoForm } from '../components/forms/JogoForm'
import { Plus, Search, Edit, Power, PowerOff } from 'lucide-react'
import { Jogo } from '../types'
import { jogoService } from '../services/jogoService'
import toast from 'react-hot-toast'

export function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingJogo, setEditingJogo] = useState<Jogo | undefined>()
  const [modalTitle, setModalTitle] = useState('')

  useEffect(() => {
    carregarJogos()
  }, [currentPage])

  const carregarJogos = async () => {
    try {
      setLoading(true)
      const response = await jogoService.getJogos(currentPage, 10)
      setJogos(response.content || [])
      setTotalPages(response.totalPages || 0)
      setTotalElements(response.totalElements || 0)
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      toast.error('Erro ao carregar jogos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJogo = () => {
    setEditingJogo(undefined)
    setModalTitle('Criar Novo Jogo')
    setShowModal(true)
  }

  const handleEditJogo = (jogo: Jogo) => {
    setEditingJogo(jogo)
    setModalTitle('Editar Jogo')
    setShowModal(true)
  }

  const handleToggleStatus = async (jogo: Jogo) => {
    try {
      await jogoService.toggleJogoStatus(jogo.id)
      toast.success(`Jogo ${jogo.ativo ? 'desativado' : 'ativado'} com sucesso!`)
      carregarJogos()
    } catch (error) {
      console.error('Erro ao alterar status do jogo:', error)
      toast.error('Erro ao alterar status do jogo')
    }
  }

  const handleModalSuccess = () => {
    setShowModal(false)
    setEditingJogo(undefined)
    carregarJogos()
  }

  const handleModalCancel = () => {
    setShowModal(false)
    setEditingJogo(undefined)
  }

  const filteredJogos = jogos.filter(jogo =>
    jogo && jogo.nome && jogo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (jogo && jogo.descricao && jogo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const columns = [
    {
      key: 'nome',
      label: 'Nome',
      render: (_: any, jogo: Jogo) => jogo ? (
        <div>
          <div className="font-medium">{jogo.nome}</div>
          {jogo.descricao && (
            <div className="text-sm text-gray-500">{jogo.descricao}</div>
          )}
        </div>
      ) : '-'
    },
    {
      key: 'preco',
      label: 'Preço',
      render: (_: any, jogo: Jogo) => jogo && jogo.preco ? formatCurrency(jogo.preco) : '-'
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (_: any, jogo: Jogo) => jogo ? (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          jogo.ativo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {jogo.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ) : '-'
    },
    {
      key: 'criadoEm',
      label: 'Criado em',
      render: (_: any, jogo: Jogo) => jogo && jogo.criadoEm ? formatDate(jogo.criadoEm) : '-'
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, jogo: Jogo) => jogo ? (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditJogo(jogo)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(jogo)}
            className={jogo.ativo ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
          >
            {jogo.ativo ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </Button>
        </div>
      ) : '-'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gerenciamento de Jogos</span>
            <Button onClick={handleCreateJogo}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Jogo
            </Button>
          </CardTitle>
          <CardDescription>
            Gerencie os jogos disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar jogos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredJogos}
            loading={loading}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando {jogos.length} de {totalElements} jogos
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0 || loading}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 py-1 text-sm">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleModalCancel}
        title={modalTitle}
      >
        <JogoForm
          jogo={editingJogo}
          onSuccess={handleModalSuccess}
          onCancel={handleModalCancel}
          isEditing={!!editingJogo}
        />
      </Modal>
    </div>
  )
}
