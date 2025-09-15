// User types
export interface User {
  id: string
  nome: string
  email: string
  papel: 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'AUDITOR'
  ativo?: boolean
  criadoEm?: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  tipo: string
  expiresAt: string
  usuario: User
}

// Game types
export interface Jogo {
  id: string
  nome: string
  codigo: string
  precoBase: number
  regrasJson: any
  ativo: boolean
}

// Bolão types
export interface Bolao {
  id: string
  jogoId: string
  jogo?: Jogo
  concurso: string
  descricao?: string
  cotasTotais: number
  cotasVendidas: number
  valorCota: number
  dataSorteio: string
  status: 'ABERTO' | 'ENCERRADO' | 'CANCELADO'
}

export interface BolaoRequest {
  jogoId: string
  concurso: string
  descricao?: string
  cotasTotais: number
  valorCota: number
  dataSorteio: string
}

// Turno types
export interface Turno {
  id: string
  usuarioId: string
  usuario?: User
  caixaId: string
  dataAbertura: string
  dataFechamento?: string
  valorInicial: number
  valorFinal?: number
  status: 'ABERTO' | 'FECHADO'
}

export interface TurnoRequest {
  caixaId: string
  valorInicial: number
}

// Venda types
export interface Venda {
  id: string
  turnoId: string
  turno?: Turno
  jogoId?: string
  jogo?: Jogo
  bolaoId?: string
  bolao?: Bolao
  clienteId?: string
  cliente?: Cliente
  tipoVenda: 'JOGO_INDIVIDUAL' | 'BOLAO'
  valorTotal: number
  status: 'CONCLUIDA' | 'CANCELADA'
  dataVenda: string
  numerosJogados?: string
  cotasCompradas?: number
  pagamentos?: Pagamento[]
}

export interface VendaRequest {
  turnoId: string
  jogoId?: string
  bolaoId?: string
  clienteId?: string
  tipoVenda: 'JOGO_INDIVIDUAL' | 'BOLAO'
  valorTotal: number
  numerosJogados?: string
  cotasCompradas?: number
  pagamentos: PagamentoRequest[]
}

// Cliente types
export interface Cliente {
  id: string
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  consentimentoLgpd: boolean
  criadoEm: string
}

export interface ClienteRequest {
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  consentimentoLgpd: boolean
}

// Pagamento types
export interface Pagamento {
  id: string
  vendaId: string
  venda?: Venda
  metodoPagamento: 'DINHEIRO' | 'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO'
  valor: number
  status: 'APROVADO' | 'PENDENTE' | 'ESTORNADO'
  dataPagamento: string
}

export interface PagamentoRequest {
  metodoPagamento: 'DINHEIRO' | 'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO'
  valor: number
}

// Movimento Caixa types
export interface MovimentoCaixa {
  id: string
  turnoId: string
  turno?: Turno
  tipo: 'SANGRIA' | 'SUPRIMENTO'
  valor: number
  descricao?: string
  dataMovimento: string
}

export interface MovimentoCaixaRequest {
  turnoId: string
  tipo: 'SANGRIA' | 'SUPRIMENTO'
  valor: number
  descricao?: string
}

// Relatório types
export interface RelatorioVendasResponse {
  dataInicio: string
  dataFim: string
  vendedorId?: string
  vendedorNome?: string
  totalVendas: number
  totalComissoes: number
  totalVendasCount: number
  totalVendasCanceladas: number
  vendas: VendaResumoResponse[]
}

export interface VendaResumoResponse {
  id: string
  tipo: string
  valorLiquido: number
  status: string
  criadoEm: string
}

export interface RelatorioBoloesStatusResponse {
  totalBoloes: number
  boloesAbertos: number
  boloesEncerrados: number
  boloesCancelados: number
  totalCotas: number
  cotasVendidas: number
  cotasDisponiveis: number
  boloes: BolaoStatusResponse[]
}

export interface BolaoStatusResponse {
  id: string
  jogoNome: string
  concurso: string
  cotasTotais: number
  cotasVendidas: number
  cotasDisponiveis: number
  status: string
  percentualVendido: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Form types
export interface SelectOption {
  value: string
  label: string
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    page: number
    size: number
    total: number
    onPageChange: (page: number) => void
    onSizeChange: (size: number) => void
  }
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  onRowClick?: (item: T) => void
}
