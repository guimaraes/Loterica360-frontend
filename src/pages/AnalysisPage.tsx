import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { PeriodFilter } from '../components/dashboard/PeriodFilter'
import { MonthlyComparison } from '../components/dashboard/MonthlyComparison'
import { YearlyComparison } from '../components/dashboard/YearlyComparison'
import { TrendAnalysis } from '../components/dashboard/TrendAnalysis'
import { Button } from '../components/ui/Button'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  RefreshCw,
  Filter,
  Download
} from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

type AnalysisType = 'monthly' | 'yearly' | 'trend' | 'performance'

export function AnalysisPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<AnalysisType>('monthly')
  const [loading, setLoading] = useState(false)
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [yearlyData, setYearlyData] = useState<any>(null)
  const [trendData, setTrendData] = useState<any>(null)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [performanceFilters, setPerformanceFilters] = useState({
    dataInicio: '',
    dataFim: '',
    tipoComparacao: ''
  })

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadInitialData()
    }
  }, [isAuthenticated, authLoading])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [monthly, yearly, trend] = await Promise.all([
        dashboardService.getMonthlyComparison(),
        dashboardService.getYearlyComparison(),
        dashboardService.getTrendAnalysis(),
      ])
      setMonthlyData(monthly)
      setYearlyData(yearly)
      setTrendData(trend)
    } catch (error) {
      console.error('Erro ao carregar dados de análise:', error)
      toast.error('Erro ao carregar dados de análise.')
    } finally {
      setLoading(false)
    }
  }

  const handlePerformanceFilter = async (filters: {
    dataInicio: string
    dataFim: string
    tipoComparacao?: string
  }) => {
    setLoading(true)
    setPerformanceFilters(filters)
    try {
      const data = await dashboardService.getPerformanceAnalysis(
        filters.dataInicio,
        filters.dataFim,
        filters.tipoComparacao
      )
      setPerformanceData(data)
      setActiveTab('performance')
    } catch (error) {
      console.error('Erro ao carregar análise de desempenho:', error)
      toast.error('Erro ao carregar análise de desempenho.')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadInitialData()
    if (performanceFilters.dataInicio && performanceFilters.dataFim) {
      handlePerformanceFilter(performanceFilters)
    }
  }

  const tabs = [
    { id: 'monthly', label: 'Comparação Mensal', icon: Calendar },
    { id: 'yearly', label: 'Comparação Anual', icon: TrendingUp },
    { id: 'trend', label: 'Análise de Tendências', icon: BarChart3 },
    { id: 'performance', label: 'Análise Personalizada', icon: Filter },
  ]

  if (loading && !monthlyData && !yearlyData && !trendData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise Avançada</h1>
          <p className="text-muted-foreground">
            Análise detalhada de desempenho e tendências das vendas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalysisType)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'monthly' && (
          <div>
            {monthlyData ? (
              <MonthlyComparison data={monthlyData} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Carregando dados de comparação mensal...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'yearly' && (
          <div>
            {yearlyData ? (
              <YearlyComparison data={yearlyData} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Carregando dados de comparação anual...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'trend' && (
          <div>
            {trendData ? (
              <TrendAnalysis data={trendData} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Carregando análise de tendências...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PeriodFilter
                onFilterChange={handlePerformanceFilter}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-2">
              {performanceData ? (
                <PerformanceAnalysis data={performanceData} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Desempenho</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      Selecione um período para visualizar a análise de desempenho
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para exibir a análise de desempenho personalizada
function PerformanceAnalysis({ data }: { data: any }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Período */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.resumo.totalValor)}
              </div>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.resumo.totalVendas}
              </div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.resumo.mediaDiaria)}
              </div>
              <p className="text-sm text-gray-600">Média Diária</p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Período: {data.periodo.inicio} a {data.periodo.fim} ({data.periodo.dias} dias)
          </div>
        </CardContent>
      </Card>

      {/* Comparação */}
      {data.comparacao && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Período Atual</h4>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(data.comparacao.periodoAtual.total)}
                </div>
                <p className="text-sm text-blue-700">
                  {data.comparacao.periodoAtual.vendas} vendas
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Período Anterior</h4>
                <div className="text-lg font-bold text-gray-600">
                  {formatCurrency(data.comparacao.periodoAnterior.total)}
                </div>
                <p className="text-sm text-gray-700">
                  {data.comparacao.periodoAnterior.vendas} vendas
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
              <div className={`text-xl font-bold ${data.comparacao.crescimento ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(data.comparacao.variacaoPercentual)}
              </div>
              <p className="text-sm text-gray-600">
                {data.comparacao.crescimento ? 'Crescimento' : 'Declínio'} vs período anterior
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendas por Jogo */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Jogo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.vendasPorJogo)
              .sort(([, a], [, b]) => b - a)
              .map(([jogo, valor]) => (
                <div key={jogo} className="flex items-center justify-between">
                  <span className="font-medium">{jogo}</span>
                  <span className="text-blue-600 font-bold">
                    {formatCurrency(valor as number)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendas por Caixa */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.vendasPorCaixa)
              .sort(([, a], [, b]) => b - a)
              .map(([caixa, valor]) => (
                <div key={caixa} className="flex items-center justify-between">
                  <span className="font-medium">{caixa}</span>
                  <span className="text-green-600 font-bold">
                    {formatCurrency(valor as number)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
