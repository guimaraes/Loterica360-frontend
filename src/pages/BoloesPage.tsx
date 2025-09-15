import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus } from 'lucide-react'

export function BoloesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bolões</h1>
          <p className="text-muted-foreground">
            Gerencie os bolões de jogos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Bolão
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bolões</CardTitle>
          <CardDescription>
            Gerencie todos os bolões disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lista de bolões será implementada aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
