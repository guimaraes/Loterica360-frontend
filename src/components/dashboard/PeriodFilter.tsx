import { useState } from 'react'
import { Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

interface PeriodFilterProps {
  onFilterChange: (filters: {
    dataInicio: string
    dataFim: string
    tipoComparacao?: string
  }) => void
  loading?: boolean
}

export function PeriodFilter({ onFilterChange, loading = false }: PeriodFilterProps) {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [tipoComparacao, setTipoComparacao] = useState<string>('')

  const handleApplyFilter = () => {
    if (dataInicio && dataFim) {
      onFilterChange({
        dataInicio,
        dataFim,
        tipoComparacao: tipoComparacao || undefined
      })
    }
  }

  const handleQuickFilter = (days: number, tipo?: string) => {
    const hoje = new Date()
    const inicio = new Date(hoje)
    inicio.setDate(hoje.getDate() - days)
    
    const dataInicioStr = inicio.toISOString().split('T')[0]
    const dataFimStr = hoje.toISOString().split('T')[0]
    
    setDataInicio(dataInicioStr)
    setDataFim(dataFimStr)
    setTipoComparacao(tipo || '')
    
    onFilterChange({
      dataInicio: dataInicioStr,
      dataFim: dataFimStr,
      tipoComparacao: tipo || undefined
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Período
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(7)}
            disabled={loading}
          >
            7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(30)}
            disabled={loading}
          >
            30 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(90)}
            disabled={loading}
          >
            90 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(365)}
            disabled={loading}
          >
            1 ano
          </Button>
        </div>

        {/* Filtros Personalizados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Tipo de Comparação */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Comparação</label>
          <select
            value={tipoComparacao}
            onChange={(e) => setTipoComparacao(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Sem comparação</option>
            <option value="mesAnterior">Mês anterior</option>
            <option value="anoAnterior">Ano anterior</option>
          </select>
        </div>

        {/* Botão Aplicar */}
        <Button
          onClick={handleApplyFilter}
          disabled={!dataInicio || !dataFim || loading}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Aplicar Filtro
        </Button>

        {/* Filtros de Comparação Rápida */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Comparações Rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFilter(30, 'mesAnterior')}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              vs Mês Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFilter(365, 'anoAnterior')}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <TrendingDown className="h-3 w-3" />
              vs Ano Anterior
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
