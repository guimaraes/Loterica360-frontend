import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return '-'
    }
    
    return format(dateObj, pattern, { locale: ptBR })
  } catch (error) {
    console.error('Erro ao formatar data:', error, date)
    return '-'
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
