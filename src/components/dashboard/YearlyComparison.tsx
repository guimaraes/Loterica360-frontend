import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MonthlyData {
  mes: string
  nomeMes: string
  totalValor: number
  totalVendas: number
}

interface YearData {
  ano: string
  totalVendas: number
  totalValor: number
  vendasPorMes: MonthlyData[]
}

interface YearlyComparisonProps {
  data: {
    anos: YearData[]
    comparacaoAnual?: {
      anoAtual: YearData
      anoAnterior: YearData
      variacaoPercentual: number
      crescimento: boolean
    }
  }
}

export function YearlyComparison({ data }: YearlyComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ]

  // Encontrar o valor máximo para normalizar as barras
  const maxValue = Math.max(
    ...data.anos.flatMap(ano => ano.vendasPorMes.map(mes => mes.totalValor))
  )

  return (
    <div className="space-y-6">
      {/* Comparação Anual */}
      {data.comparacaoAnual && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">
                {data.comparacaoAnual.anoAtual.ano}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.comparacaoAnual.anoAtual.totalValor)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.comparacaoAnual.anoAtual.totalVendas} vendas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {data.comparacaoAnual.anoAnterior.ano}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.comparacaoAnual.anoAnterior.totalValor)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.comparacaoAnual.anoAnterior.totalVendas} vendas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {data.comparacaoAnual.crescimento ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                Variação Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${data.comparacaoAnual.crescimento ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(data.comparacaoAnual.variacaoPercentual)}
              </div>
              <p className="text-xs text-muted-foreground">
                vs {data.comparacaoAnual.anoAnterior.ano}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico Comparativo por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Mensal por Ano</CardTitle>
          <CardDescription>Evolução mensal comparativa entre os anos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.anos.map((ano, anoIndex) => (
              <div key={ano.ano}>
                <h4 className="text-sm font-medium mb-2 text-gray-700">
                  {ano.ano} - {formatCurrency(ano.totalValor)} ({ano.totalVendas} vendas)
                </h4>
                <div className="grid grid-cols-12 gap-1">
                  {monthNames.map((monthName, monthIndex) => {
                    const mesData = ano.vendasPorMes.find(mes => parseInt(mes.mes) === monthIndex + 1)
                    const valor = mesData?.totalValor || 0
                    const height = maxValue > 0 ? (valor / maxValue) * 100 : 0
                    
                    return (
                      <div key={monthIndex} className="flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-sm relative h-16">
                          <div
                            className="absolute bottom-0 w-full bg-blue-500 rounded-sm transition-all duration-300"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {monthName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(valor)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Anual</CardTitle>
          <CardDescription>Dados consolidados por ano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Ano</th>
                  <th className="text-right py-2">Total Vendas</th>
                  <th className="text-right py-2">Valor Total</th>
                  <th className="text-right py-2">Melhor Mês</th>
                  <th className="text-right py-2">Pior Mês</th>
                </tr>
              </thead>
              <tbody>
                {data.anos.map((ano, index) => {
                  const melhorMes = ano.vendasPorMes.reduce((max, mes) => 
                    mes.totalValor > max.totalValor ? mes : max
                  )
                  const piorMes = ano.vendasPorMes.reduce((min, mes) => 
                    mes.totalValor < min.totalValor ? mes : min
                  )
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{ano.ano}</td>
                      <td className="text-right py-2">{ano.totalVendas}</td>
                      <td className="text-right py-2">{formatCurrency(ano.totalValor)}</td>
                      <td className="text-right py-2">
                        {melhorMes.nomeMes} ({formatCurrency(melhorMes.totalValor)})
                      </td>
                      <td className="text-right py-2">
                        {piorMes.nomeMes} ({formatCurrency(piorMes.totalValor)})
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Sazonalidade */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sazonalidade</CardTitle>
          <CardDescription>Média de vendas por mês ao longo dos anos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthNames.map((monthName, monthIndex) => {
              // Calcular média do mês entre todos os anos
              const valoresMes = data.anos.map(ano => {
                const mesData = ano.vendasPorMes.find(mes => parseInt(mes.mes) === monthIndex + 1)
                return mesData?.totalValor || 0
              })
              const mediaMes = valoresMes.reduce((sum, valor) => sum + valor, 0) / valoresMes.length
              
              // Calcular média geral para comparação
              const mediaGeral = data.anos.reduce((sum, ano) => sum + ano.totalValor, 0) / (data.anos.length * 12)
              const percentualAcimaMedia = ((mediaMes - mediaGeral) / mediaGeral) * 100
              
              return (
                <div key={monthIndex} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {monthName}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{
                            width: `${Math.max(
                              (mediaMes / Math.max(...monthNames.map((_, idx) => {
                                const valores = data.anos.map(ano => {
                                  const mesData = ano.vendasPorMes.find(mes => parseInt(mes.mes) === idx + 1)
                                  return mesData?.totalValor || 0
                                })
                                return valores.reduce((sum, valor) => sum + valor, 0) / valores.length
                              }))) * 100,
                              2
                            )}%`
                          }}
                        />
                      </div>
                      <div className="w-20 text-sm text-right">
                        {formatCurrency(mediaMes)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        Média dos anos
                      </span>
                      <span className={`text-xs ${percentualAcimaMedia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {percentualAcimaMedia >= 0 ? '+' : ''}{percentualAcimaMedia.toFixed(1)}% vs média
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
