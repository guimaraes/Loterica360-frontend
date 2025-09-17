import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react'

interface TrendAnalysisProps {
  data: {
    tendencia: {
      periodo30Dias: number
      periodoAnterior: number
      variacaoPercentual: number
      direcao: string
    }
    sazonalidade: {
      vendasPorDiaSemana: Record<string, number>
      melhorDiaSemana: string
      piorDiaSemana: string
    }
  }
}

export function TrendAnalysis({ data }: TrendAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getDiaSemanaName = (dia: string) => {
    const dias = {
      'MONDAY': 'Segunda',
      'TUESDAY': 'Terça',
      'WEDNESDAY': 'Quarta',
      'THURSDAY': 'Quinta',
      'FRIDAY': 'Sexta',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    }
    return dias[dia as keyof typeof dias] || dia
  }

  const isGrowth = data.tendencia.direcao === 'CRESCIMENTO'

  // Calcular valor máximo para normalizar as barras
  const maxVendasDia = Math.max(...Object.values(data.sazonalidade.vendasPorDiaSemana))

  return (
    <div className="space-y-6">
      {/* Indicador de Tendência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isGrowth ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            Tendência Atual
          </CardTitle>
          <CardDescription>
            Comparação dos últimos 30 dias vs período anterior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.tendencia.periodo30Dias)}
              </div>
              <p className="text-sm text-gray-600">Últimos 30 dias</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {formatCurrency(data.tendencia.periodoAnterior)}
              </div>
              <p className="text-sm text-gray-600">Período anterior</p>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${isGrowth ? 'text-green-600' : 'text-red-600'}`}>
                {isGrowth ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {formatPercent(data.tendencia.variacaoPercentual)}
              </div>
              <p className="text-sm text-gray-600">Variação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Sazonalidade por Dia da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sazonalidade por Dia da Semana
          </CardTitle>
          <CardDescription>
            Padrão de vendas nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Resumo dos Melhores e Piores Dias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Melhor Dia</h4>
                <div className="text-lg font-bold text-green-600">
                  {getDiaSemanaName(data.sazonalidade.melhorDiaSemana)}
                </div>
                <p className="text-sm text-green-700">
                  {formatCurrency(data.sazonalidade.vendasPorDiaSemana[data.sazonalidade.melhorDiaSemana] || 0)}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Pior Dia</h4>
                <div className="text-lg font-bold text-red-600">
                  {getDiaSemanaName(data.sazonalidade.piorDiaSemana)}
                </div>
                <p className="text-sm text-red-700">
                  {formatCurrency(data.sazonalidade.vendasPorDiaSemana[data.sazonalidade.piorDiaSemana] || 0)}
                </p>
              </div>
            </div>

            {/* Gráfico de Barras por Dia */}
            <div className="space-y-3">
              {Object.entries(data.sazonalidade.vendasPorDiaSemana)
                .sort(([, a], [, b]) => b - a)
                .map(([dia, valor]) => (
                  <div key={dia} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-600">
                      {getDiaSemanaName(dia)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{
                              width: `${Math.max(
                                (valor / maxVendasDia) * 100,
                                5
                              )}%`
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              {formatCurrency(valor)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Insight sobre Tendência */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tendência de Vendas</h4>
              <p className="text-sm text-blue-700">
                {isGrowth ? (
                  <>As vendas estão em <strong>crescimento</strong> com aumento de {formatPercent(data.tendencia.variacaoPercentual)} 
                  nos últimos 30 dias comparado ao período anterior. Continue com as estratégias atuais.</>
                ) : (
                  <>As vendas estão em <strong>declínio</strong> com redução de {formatPercent(Math.abs(data.tendencia.variacaoPercentual))} 
                  nos últimos 30 dias. Considere revisar estratégias de marketing e promoções.</>
                )}
              </p>
            </div>

            {/* Insight sobre Sazonalidade */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Padrão Semanal</h4>
              <p className="text-sm text-green-700">
                {getDiaSemanaName(data.sazonalidade.melhorDiaSemana)} é o melhor dia para vendas, 
                enquanto {getDiaSemanaName(data.sazonalidade.piorDiaSemana)} apresenta menor movimento. 
                Considere campanhas específicas para os dias de menor movimento.
              </p>
            </div>

            {/* Recomendações */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Recomendações</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {isGrowth ? (
                  <>
                    <li>• Mantenha o foco nos produtos que mais vendem</li>
                    <li>• Aumente o estoque para {getDiaSemanaName(data.sazonalidade.melhorDiaSemana)}s</li>
                    <li>• Considere expandir as estratégias de sucesso para outros dias</li>
                  </>
                ) : (
                  <>
                    <li>• Implemente promoções especiais nos dias de menor movimento</li>
                    <li>• Analise os fatores que podem estar impactando as vendas</li>
                    <li>• Considere campanhas de marketing direcionadas</li>
                  </>
                )}
                <li>• Monitore regularmente os padrões de sazonalidade</li>
                <li>• Ajuste as estratégias baseado nos dados de tendência</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
