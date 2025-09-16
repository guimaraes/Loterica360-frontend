import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Usuario, 
  Jogo, 
  Cliente, 
  VendaCaixa,
  ContagemCaixaResponse,
  Caixa
} from '../types'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export const Dashboard: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Estados para os dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [contagens, setContagens] = useState<ContagemCaixaResponse[]>([])
  const [caixas, setCaixas] = useState<Caixa[]>([])

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      carregarDados()
    }
  }, [isAuthenticated, authLoading])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [usuariosResponse, jogosResponse, clientesResponse, vendasResponse, contagensResponse, caixasResponse] = await Promise.all([
        api.get('/usuarios'),
        api.get('/jogos/ativos'),
        api.get('/clientes'),
        api.get('/vendas-caixa'),
        api.get('/contagem-caixa'),
        api.get('/caixas/ativas')
      ])
      
      setUsuarios(usuariosResponse.data.content || usuariosResponse.data)
      setJogos(jogosResponse.data)
      setClientes(clientesResponse.data.content || clientesResponse.data)
      setVendas(vendasResponse.data.content || vendasResponse.data)
      setContagens(contagensResponse.data.content || contagensResponse.data)
      setCaixas(caixasResponse.data)
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const calcularTotalVendas = () => {
    return vendas.reduce((total, venda) => total + venda.valorTotal, 0)
  }

  const calcularTotalContagens = () => {
    return contagens.reduce((total, contagem) => total + contagem.totalGeral, 0)
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema Loteria360</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuários</p>
              <p className="text-2xl font-semibold text-gray-900">{usuarios.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jogos Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{jogos.filter(jogo => jogo.ativo).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{clientes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Caixas Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">{caixas.filter(caixa => caixa.ativo).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Valores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total em Vendas</p>
              <p className="text-3xl font-bold text-green-600">
                {formatarMoeda(calcularTotalVendas())}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total em Contagens</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatarMoeda(calcularTotalContagens())}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/usuarios')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="p-2 bg-blue-100 rounded-lg mx-auto mb-2 w-fit">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Usuários</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/jogos')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="p-2 bg-green-100 rounded-lg mx-auto mb-2 w-fit">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Jogos</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/clientes')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="p-2 bg-purple-100 rounded-lg mx-auto mb-2 w-fit">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Clientes</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/vendas')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="p-2 bg-orange-100 rounded-lg mx-auto mb-2 w-fit">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Vendas</p>
            </div>
          </button>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Vendas Recentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {vendas.slice(0, 5).map(venda => (
              <div key={venda.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{venda.nomeJogo}</p>
                  <p className="text-sm text-gray-600">
                    Caixa {venda.numeroCaixa} - {venda.quantidade} bilhetes
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(venda.dataVenda).toLocaleDateString('pt-BR')} - {venda.nomeUsuario}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatarMoeda(venda.valorTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
