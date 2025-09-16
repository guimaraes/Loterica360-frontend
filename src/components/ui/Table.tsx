import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import { TableColumn } from '../../types'

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    page: number
    size: number
    total: number
    onPageChange: (page: number) => void
    onSizeChange: (size: number) => void
  }
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  onRowClick?: (item: T) => void
  sortKey?: keyof T
  sortDirection?: 'asc' | 'desc'
}

export function Table<T>({
  data,
  columns,
  loading = false,
  pagination,
  onSort,
  onRowClick,
  sortKey,
  sortDirection,
}: TableProps<T>) {
  const handleSort = (key: keyof T | string) => {
    if (!onSort) return
    
    // Só permite ordenação para chaves que são propriedades do tipo T
    if (typeof key === 'string') return
    
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, direction)
  }

  const getSortIcon = (key: keyof T | string) => {
    if (sortKey !== key) return null
    
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
    )
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    column.sortable && 'cursor-pointer hover:bg-muted/80',
                    'first:pl-6 last:pr-6'
                  )}
                  onClick={() => column.sortable && typeof column.key !== 'string' && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && typeof column.key !== 'string' && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum dado encontrado
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    'border-b transition-colors hover:bg-muted/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => {
                    // Obter o valor baseado no tipo de coluna
                    let value
                    if (column.key === 'actions') {
                      value = undefined // Para actions, não precisamos do valor
                    } else {
                      value = item[column.key as keyof T]
                    }
                    
                    return (
                      <td
                        key={String(column.key)}
                        className="p-4 align-middle first:pl-6 last:pr-6"
                      >
                        {column.render
                          ? column.render(value, item)
                          : String(value || '-')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Mostrando {pagination.page * pagination.size + 1} até{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.total)} de{' '}
              {pagination.total} resultados
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={pagination.size}
              onChange={(e) => pagination.onSizeChange(Number(e.target.value))}
              className="h-8 rounded border border-input bg-background px-2 text-sm"
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="h-8 w-8 rounded border border-input bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                {'<'}
              </button>
              
              <span className="px-2 text-sm">
                {pagination.page + 1} de {Math.ceil(pagination.total / pagination.size)}
              </span>
              
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={(pagination.page + 1) * pagination.size >= pagination.total}
                className="h-8 w-8 rounded border border-input bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
