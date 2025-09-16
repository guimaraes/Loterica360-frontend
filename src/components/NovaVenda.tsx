import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { 
  Jogo, 
  VendaCaixaRequest,
  VendaCaixa,
  ContagemCaixaRequest,
  Caixa
} from '../types'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export const NovaVenda: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'vendas' | 'contagem'>('vendas')
  
  // Estados para vendas
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [loading, setLoading] = useState(false)
  
  // Formulário de nova venda
  const [novaVenda, setNovaVenda] = useState<VendaCaixaRequest>({
    caixaId: '',
    jogoId: '',
    quantidade: 1,
    dataVenda: new Date().toISOString().split('T')[0]
  })
  
  // Estados para contagem
  const [contagem, setContagem] = useState<ContagemCaixaRequest>({
    caixaId: '',
    dataContagem: new Date().toISOString().split('T')[0],
    notas200: 0,
    notas100: 0,
    notas50: 0,
    notas20: 0,
    notas10: 0,
    notas5: 0,
    notas2: 0,
    moedas1: 0,
    moedas050: 0,
    moedas025: 0,
    moedas010: 0,
    moedas005: 0
  })

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      carregarDados()
    }
  }, [isAuthenticated, authLoading])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [jogosResponse, caixasResponse, vendasResponse] = await Promise.all([
        api.get('/jogos/ativos'),
        api.get('/caixas/ativas'),
        api.get('/vendas-caixa')
      ])
      
      setJogos(jogosResponse.data)
      setCaixas(caixasResponse.data)
      setVendas(vendasResponse.data.content || vendasResponse.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitVenda = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.post('/vendas-caixa', novaVenda)
      toast.success('Venda registrada com sucesso!')
      setNovaVenda({
        caixaId: '',
        jogoId: '',
        quantidade: 1,
        dataVenda: new Date().toISOString().split('T')[0]
      })
      carregarDados()
    } catch (error) {
      toast.error('Erro ao registrar venda')
      console.error('Erro ao registrar venda:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitContagem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.post('/contagem-caixa', contagem)
      toast.success('Contagem registrada com sucesso!')
      setContagem({
        caixaId: '',
        dataContagem: new Date().toISOString().split('T')[0],
        notas200: 0,
        notas100: 0,
        notas50: 0,
        notas20: 0,
        notas10: 0,
        notas5: 0,
        notas2: 0,
        moedas1: 0,
        moedas050: 0,
        moedas025: 0,
        moedas010: 0,
        moedas005: 0
      })
    } catch (error) {
      toast.error('Erro ao registrar contagem')
      console.error('Erro ao registrar contagem:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularTotalNotas = () => {
    return (contagem.notas200 || 0) * 200 + 
           (contagem.notas100 || 0) * 100 + 
           (contagem.notas50 || 0) * 50 + 
           (contagem.notas20 || 0) * 20 + 
           (contagem.notas10 || 0) * 10 + 
           (contagem.notas5 || 0) * 5 + 
           (contagem.notas2 || 0) * 2
  }

  const calcularTotalMoedas = () => {
    return (contagem.moedas1 || 0) * 1 + 
           (contagem.moedas050 || 0) * 0.5 + 
           (contagem.moedas025 || 0) * 0.25 + 
           (contagem.moedas010 || 0) * 0.1 + 
           (contagem.moedas005 || 0) * 0.05
  }

  const calcularTotalGeral = () => {
    return calcularTotalNotas() + calcularTotalMoedas()
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Vendas</h1>
        <p className="text-gray-600">Registre vendas por caixa e faça a contagem do dinheiro</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vendas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vendas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendas por Caixa
            </button>
            <button
              onClick={() => setActiveTab('contagem')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contagem'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contagem de Caixa
            </button>
          </nav>
        </div>
      </div>

      {/* Tab de Vendas */}
      {activeTab === 'vendas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Nova Venda */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Venda</h2>
            
            <form onSubmit={handleSubmitVenda} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caixa
                </label>
                <select
                  value={novaVenda.caixaId}
                  onChange={(e) => setNovaVenda({ ...novaVenda, caixaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um caixa</option>
                  {caixas.filter(caixa => caixa.ativo).map(caixa => (
                    <option key={caixa.id} value={caixa.id}>
                      Caixa {caixa.numero} - {caixa.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jogo
                </label>
                <select
                  value={novaVenda.jogoId}
                  onChange={(e) => setNovaVenda({ ...novaVenda, jogoId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um jogo</option>
                  {jogos.filter(jogo => jogo.ativo).map(jogo => (
                    <option key={jogo.id} value={jogo.id}>
                      {jogo.nome} - {formatarMoeda(jogo.preco)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  value={novaVenda.quantidade}
                  onChange={(e) => setNovaVenda({ ...novaVenda, quantidade: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Venda
                </label>
                <input
                  type="date"
                  value={novaVenda.dataVenda}
                  onChange={(e) => setNovaVenda({ ...novaVenda, dataVenda: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Registrar Venda
              </button>
            </form>
          </div>

          {/* Lista de Vendas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas Recentes</h2>
            
            <div className="space-y-3">
              {vendas.slice(0, 10).map(venda => (
                <div key={venda.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{venda.nomeJogo}</p>
                      <p className="text-sm text-gray-600">
                        Caixa {venda.numeroCaixa} - {venda.quantidade} bilhetes
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatarMoeda(venda.valorTotal)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {venda.nomeUsuario}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab de Contagem */}
      {activeTab === 'contagem' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Contagem */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contagem de Caixa</h2>
            
            <form onSubmit={handleSubmitContagem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caixa
                </label>
                <select
                  value={contagem.caixaId}
                  onChange={(e) => setContagem({ ...contagem, caixaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um caixa</option>
                  {caixas.filter(caixa => caixa.ativo).map(caixa => (
                    <option key={caixa.id} value={caixa.id}>
                      Caixa {caixa.numero} - {caixa.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Contagem
                </label>
                <input
                  type="date"
                  value={contagem.dataContagem}
                  onChange={(e) => setContagem({ ...contagem, dataContagem: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 200
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas200}
                    onChange={(e) => setContagem({ ...contagem, notas200: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 100
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas100}
                    onChange={(e) => setContagem({ ...contagem, notas100: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 50
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas50}
                    onChange={(e) => setContagem({ ...contagem, notas50: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 20
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas20}
                    onChange={(e) => setContagem({ ...contagem, notas20: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 10
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas10}
                    onChange={(e) => setContagem({ ...contagem, notas10: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 5
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas5}
                    onChange={(e) => setContagem({ ...contagem, notas5: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de R$ 2
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.notas2}
                    onChange={(e) => setContagem({ ...contagem, notas2: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas de R$ 1
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.moedas1}
                    onChange={(e) => setContagem({ ...contagem, moedas1: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas de R$ 0,50
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.moedas050}
                    onChange={(e) => setContagem({ ...contagem, moedas050: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas de R$ 0,25
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.moedas025}
                    onChange={(e) => setContagem({ ...contagem, moedas025: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas de R$ 0,10
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.moedas010}
                    onChange={(e) => setContagem({ ...contagem, moedas010: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moedas de R$ 0,05
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contagem.moedas005}
                    onChange={(e) => setContagem({ ...contagem, moedas005: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Registrar Contagem
              </button>
            </form>
          </div>

          {/* Resumo da Contagem */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Contagem</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Total em Notas</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatarMoeda(calcularTotalNotas())}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Total em Moedas</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(calcularTotalMoedas())}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Total Geral</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formatarMoeda(calcularTotalGeral())}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
