import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Clock, ShoppingCart, Users, DollarSign } from 'lucide-react'

interface Activity {
  id: string
  type: 'venda' | 'contagem' | 'bolao'
  title: string
  description: string
  timestamp: string
  value?: number
}

interface RecentActivityProps {
  activities: Activity[]
  className?: string
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'venda':
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case 'contagem':
        return <DollarSign className="h-4 w-4 text-blue-600" />
      case 'bolao':
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade recente
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                    {activity.value && (
                      <p className="text-xs font-medium text-green-600">
                        {formatCurrency(activity.value)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
