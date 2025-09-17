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
  descricao?: string
  preco: number
  ativo: boolean
  criadoEm: string
}

export interface JogoRequest {
  nome: string
  descricao?: string
  preco: number
}

export interface JogoUpdateRequest {
  nome?: string
  descricao?: string
  preco?: number
  ativo?: boolean
}

// Caixa types
export interface Caixa {
  id: string
  numero: number
  descricao?: string
  ativo: boolean
  criadoEm: string
}

export interface CaixaRequest {
  numero: number
  descricao?: string
  ativo: boolean
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

// Venda Caixa types
export interface VendaCaixa {
  id: string
  caixaId: string
  numeroCaixa: number
  descricaoCaixa?: string
  jogoId: string
  nomeJogo: string
  precoJogo: number
  quantidade: number
  valorTotal: number
  dataVenda: string
  usuarioId: string
  nomeUsuario: string
  criadoEm: string
}

export interface VendaCaixaRequest {
  caixaId: string
  jogoId: string
  quantidade: number
  dataVenda: string
}

// Contagem Caixa types
export interface ContagemCaixa {
  id: string
  caixaId: string
  numeroCaixa: number
  descricaoCaixa?: string
  dataContagem: string
  usuarioId: string
  nomeUsuario: string
  notas200: number
  notas100: number
  notas50: number
  notas20: number
  notas10: number
  notas5: number
  notas2: number
  moedas1: number
  moedas050: number
  moedas025: number
  moedas010: number
  moedas005: number
  totalNotas: number
  totalMoedas: number
  totalGeral: number
  criadoEm: string
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

// Usuario types
export interface Usuario {
  id: string
  nome: string
  email: string
  papel: 'ADMIN' | 'GERENTE' | 'VENDEDOR'
  ativo: boolean
  criadoEm: string
}

// Pagamento types (mantido para compatibilidade)
export interface Pagamento {
  id: string
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

// ContagemCaixa types
export interface ContagemCaixaRequest {
  caixaId: string
  dataContagem: string
  notas200: number
  notas100: number
  notas50: number
  notas20: number
  notas10: number
  notas5: number
  notas2: number
  moedas1: number
  moedas050: number
  moedas025: number
  moedas010: number
  moedas005: number
}

export interface ContagemCaixaResponse {
  id: string
  caixaId: string
  numeroCaixa: number
  descricaoCaixa: string
  dataContagem: string
  usuarioId: string
  nomeUsuario: string
  notas200: number
  notas100: number
  notas50: number
  notas20: number
  notas10: number
  notas5: number
  notas2: number
  moedas1: number
  moedas050: number
  moedas025: number
  moedas010: number
  moedas005: number
  totalNotas: number
  totalMoedas: number
  totalGeral: number
  criadoEm: string
}


// Bolao types
export interface Bolao {
  id: string
  jogo: Jogo
  concurso: string
  descricao?: string
  cotasTotais: number
  cotasVendidas: number
  cotasDisponiveis: number
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

export interface BolaoUpdateRequest {
  jogoId?: string
  concurso?: string
  descricao?: string
  cotasTotais?: number
  valorCota?: number
  dataSorteio?: string
  status?: 'ABERTO' | 'ENCERRADO' | 'CANCELADO'
}
