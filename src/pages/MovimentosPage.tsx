import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus } from 'lucide-react'

export function MovimentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentos de Caixa</h1>
          <p className="text-muted-foreground">
            Gerencie sangrias e suprimentos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Movimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Movimentos</CardTitle>
          <CardDescription>
            Gerencie todos os movimentos de caixa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lista de movimentos será implementada aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
