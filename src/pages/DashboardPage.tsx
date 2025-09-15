import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Loteria360
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.350,00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao dia anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bolões Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Turno Atual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aberto</div>
            <p className="text-xs text-muted-foreground">
              Caixa 001 - João Silva
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>
              Últimas vendas realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mega-Sena - Concurso 2650
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 4,50 - 10:30
                  </p>
                </div>
                <div className="ml-auto font-medium">R$ 4,50</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lotofácil - Concurso 2650
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 2,50 - 10:25
                  </p>
                </div>
                <div className="ml-auto font-medium">R$ 2,50</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Quina - Concurso 2650
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 2,00 - 10:20
                  </p>
                </div>
                <div className="ml-auto font-medium">R$ 2,00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Bolões em Destaque</CardTitle>
            <CardDescription>
              Bolões com maior movimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mega-Sena
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Concurso 2650
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  85% vendido
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lotofácil
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Concurso 2650
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  92% vendido
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Quina
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Concurso 2650
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  78% vendido
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
