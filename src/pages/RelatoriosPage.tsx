import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Download } from 'lucide-react'

export function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize relatórios e estatísticas
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Vendas</CardTitle>
            <CardDescription>
              Relatório detalhado de vendas por período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório de Bolões</CardTitle>
            <CardDescription>
              Status e performance dos bolões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório Financeiro</CardTitle>
            <CardDescription>
              Movimentação financeira e caixa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
