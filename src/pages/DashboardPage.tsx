import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SimpleChart } from '../components/dashboard/SimpleChart'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Gamepad2,
  UserCheck,
  Building
} from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)
  const [salesSummary, setSalesSummary] = useState<any>(null)
  const [boloesSummary, setBoloesSummary] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadDashboardData()
    }
  }, [isAuthenticated, authLoading])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [metricsData, salesData, boloesData, activityData] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getSalesSummary(7),
        dashboardService.getBoloesSummary(),
        dashboardService.getRecentActivity()
      ])
      
      setMetrics(metricsData)
      setSalesSummary(salesData)
      setBoloesSummary(boloesData)
      setRecentActivity(activityData)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema Loteria360
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    )
  }

  // Preparar dados para o gráfico de vendas
  const salesChartData = salesSummary?.vendasPorDia?.map((item: any) => ({
    label: item.data,
    value: parseFloat(item.total) || 0
  })) || []

  // Preparar dados para atividades recentes
  const activities = [
    ...(recentActivity?.vendas?.slice(0, 3).map((venda: any) => ({
      id: venda.id,
      type: 'venda' as const,
      title: `${venda.jogoNome} - ${venda.quantidade} bilhetes`,
      description: `Caixa ${venda.caixaNumero} - ${venda.usuarioNome}`,
      timestamp: venda.dataVenda,
      value: parseFloat(venda.valorTotal)
    })) || []),
    ...(recentActivity?.boloes?.slice(0, 2).map((bolao: any) => ({
      id: bolao.id,
      type: 'bolao' as const,
      title: `${bolao.jogoNome} - ${bolao.concurso}`,
      description: `Status: ${bolao.status}`,
      timestamp: bolao.criadoEm
    })) || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Loteria360
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Vendas Hoje"
          value={formatCurrency(metrics.vendas?.hoje || 0)}
          description={`${metrics.vendas?.totalHoje || 0} vendas realizadas`}
          icon={ShoppingCart}
          trend={{
            value: "20.1%",
            isPositive: true
          }}
        />

        <MetricCard
          title="Bolões Ativos"
          value={metrics.boloes?.abertos || 0}
          description={`${metrics.boloes?.total || 0} bolões no total`}
          icon={Users}
        />

        <MetricCard
          title="Jogos Ativos"
          value={metrics.jogos?.ativos || 0}
          description={`${metrics.jogos?.total || 0} jogos cadastrados`}
          icon={Gamepad2}
        />

        <MetricCard
          title="Caixas Ativas"
          value={metrics.caixas?.ativas || 0}
          description={`${metrics.caixas?.total || 0} caixas disponíveis`}
          icon={Building}
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Usuários"
          value={metrics.usuarios?.total || 0}
          description={`${metrics.usuarios?.ativos || 0} usuários ativos`}
          icon={UserCheck}
        />

        <MetricCard
          title="Total de Clientes"
          value={metrics.clientes?.total || 0}
          description="Clientes cadastrados"
          icon={Users}
        />

        <MetricCard
          title="Vendas da Semana"
          value={formatCurrency(metrics.vendas?.semana || 0)}
          description="Últimos 7 dias"
          icon={TrendingUp}
        />

        <MetricCard
          title="Contagens Hoje"
          value={formatCurrency(metrics.contagens?.hoje || 0)}
          description={`${metrics.contagens?.totalHoje || 0} contagens realizadas`}
          icon={DollarSign}
        />
      </div>

      {/* Gráficos e Atividades */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SimpleChart
          title="Vendas dos Últimos 7 Dias"
          description="Evolução das vendas por dia"
          data={salesChartData}
          type="bar"
          className="col-span-4"
        />

        <RecentActivity
          activities={activities}
          className="col-span-3"
        />
      </div>

      {/* Resumo de Bolões */}
      {boloesSummary && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Bolões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total de Bolões:</span>
                  <span className="text-sm">{boloesSummary.resumo?.totalBoloes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bolões Abertos:</span>
                  <span className="text-sm text-green-600">{boloesSummary.resumo?.boloesAbertos || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bolões Encerrados:</span>
                  <span className="text-sm text-yellow-600">{boloesSummary.resumo?.boloesEncerrados || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Cotas Vendidas:</span>
                  <span className="text-sm">{boloesSummary.cotas?.cotasVendidas || 0} / {boloesSummary.cotas?.totalCotas || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Percentual Vendido:</span>
                  <span className="text-sm font-medium text-blue-600">{boloesSummary.cotas?.percentualVendido || '0%'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Bolões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {boloesSummary.topBoloes?.length > 0 ? (
                  boloesSummary.topBoloes.slice(0, 5).map((bolao: any) => (
                    <div key={bolao.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{bolao.jogoNome}</p>
                        <p className="text-xs text-gray-500">{bolao.concurso}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{bolao.percentualVendido}</p>
                        <p className="text-xs text-gray-500">{bolao.cotasVendidas}/{bolao.cotasTotais}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum bolão encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}