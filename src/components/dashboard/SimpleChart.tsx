import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

interface ChartDataPoint {
  label: string
  value: number
}

interface SimpleChartProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  type?: 'bar' | 'line'
  className?: string
}

export function SimpleChart({ 
  title, 
  description, 
  data, 
  type = 'bar',
  className 
}: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      type === 'bar' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
