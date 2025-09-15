import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus } from 'lucide-react'

export function TurnosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turnos</h1>
          <p className="text-muted-foreground">
            Gerencie os turnos de trabalho
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Abrir Turno
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Turnos</CardTitle>
          <CardDescription>
            Gerencie todos os turnos de trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lista de turnos será implementada aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
