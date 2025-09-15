import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Table } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { UserForm } from '../components/forms/UserForm'
import { DeleteUserModal } from '../components/forms/DeleteUserModal'
import { ChangePasswordModal } from '../components/forms/ChangePasswordModal'
import { Plus, Search, Edit, Trash2, Key, Eye, EyeOff } from 'lucide-react'
import { User, TableColumn } from '../types'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

export function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [sortKey, setSortKey] = useState<keyof User>('nome')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await userService.getUsers(currentPage, pageSize, searchTerm)
      setUsers(response.content)
      setTotalUsers(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [currentPage, pageSize, searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(0)
  }

  const handleSort = (key: keyof User, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
    // Aqui você implementaria a lógica de ordenação no backend
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsCreateModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleChangePassword = (user: User) => {
    setSelectedUser(user)
    setIsPasswordModalOpen(true)
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleUserStatus(user.id, !user.ativo)
      toast.success(`Usuário ${user.ativo ? 'desativado' : 'ativado'} com sucesso!`)
      loadUsers()
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
    }
  }

  const handleModalSuccess = () => {
    loadUsers()
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setIsPasswordModalOpen(false)
    setSelectedUser(null)
  }

  const columns: TableColumn<User>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'papel',
      label: 'Papel',
      sortable: true,
      render: (value) => {
        const papelLabels = {
          ADMIN: 'Administrador',
          GERENTE: 'Gerente',
          VENDEDOR: 'Vendedor',
          AUDITOR: 'Auditor',
        }
        return papelLabels[value as keyof typeof papelLabels] || value
      },
    },
    {
      key: 'ativo',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value ? 'Ativo' : 'Inativo'}
          </span>
        </div>
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
      key: 'id' as keyof User,
      label: 'Ações',
      render: (_, user) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(user)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleChangePassword(user)}
            className="h-8 w-8 p-0"
          >
            <Key className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(user)}
            className="h-8 w-8 p-0"
          >
            {user.ativo ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(user)}
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
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários do sistema
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table
              data={users}
              columns={columns}
              loading={loading}
              pagination={{
                page: currentPage,
                size: pageSize,
                total: totalUsers,
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
        title="Novo Usuário"
        size="lg"
      >
        <UserForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuário"
        size="lg"
      >
        <UserForm
          user={selectedUser || undefined}
          onSuccess={handleModalSuccess}
          onCancel={() => setIsEditModalOpen(false)}
          isEditing
        />
      </Modal>

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
