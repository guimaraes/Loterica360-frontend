import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MonthlyData {
  mes: string
  inicio: string
  fim: string
  totalVendas: number
  totalValor: number
  mesAnterior: number
  variacaoPercentual: number
  crescimento: boolean
}

interface MonthlyComparisonProps {
  data: {
    meses: MonthlyData[]
    resumo: {
      melhorMes: MonthlyData
      piorMes: MonthlyData
      mediaMensal: number
    }
  }
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getVariationIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getVariationColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Melhor Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.resumo.melhorMes.mes}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(data.resumo.melhorMes.totalValor)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Pior Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.resumo.piorMes.mes}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(data.resumo.piorMes.totalValor)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Média Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.resumo.mediaMensal)}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 12 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras Simples */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Mensais</CardTitle>
          <CardDescription>Comparação dos últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.meses.map((mes, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {mes.mes}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{
                          width: `${Math.max(
                            (mes.totalValor / Math.max(...data.meses.map(m => m.totalValor))) * 100,
                            2
                          )}%`
                        }}
                      />
                    </div>
                    <div className="w-20 text-sm text-right">
                      {formatCurrency(mes.totalValor)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {mes.totalVendas} vendas
                    </span>
                    {index > 0 && (
                      <div className={`flex items-center space-x-1 text-xs ${getVariationColor(mes.variacaoPercentual)}`}>
                        {getVariationIcon(mes.variacaoPercentual)}
                        <span>{formatPercent(mes.variacaoPercentual)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
          <CardDescription>Dados completos de cada mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mês</th>
                  <th className="text-right py-2">Vendas</th>
                  <th className="text-right py-2">Valor Total</th>
                  <th className="text-right py-2">Mês Anterior</th>
                  <th className="text-right py-2">Variação</th>
                </tr>
              </thead>
              <tbody>
                {data.meses.map((mes, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{mes.mes}</td>
                    <td className="text-right py-2">{mes.totalVendas}</td>
                    <td className="text-right py-2">{formatCurrency(mes.totalValor)}</td>
                    <td className="text-right py-2">
                      {index > 0 ? formatCurrency(mes.mesAnterior) : '-'}
                    </td>
                    <td className="text-right py-2">
                      {index > 0 ? (
                        <div className={`flex items-center justify-end space-x-1 ${getVariationColor(mes.variacaoPercentual)}`}>
                          {getVariationIcon(mes.variacaoPercentual)}
                          <span>{formatPercent(mes.variacaoPercentual)}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
