# Navegação Entre Menus Diferentes

## Problema Identificado

Quando o usuário navega para um submenu de outro menu (ex: de "Dashboard Geral" para "Usuários" em "Cadastros Gerais"), o menu atual deveria fechar automaticamente, mas isso não estava acontecendo.

## Solução Implementada

### ✅ **Comportamento Correto Implementado**

Agora quando o usuário navega para um submenu de outro menu:
1. O menu atual é automaticamente fechado
2. O menu do submenu navegado é automaticamente aberto
3. O submenu navegado fica destacado como ativo

## Exemplos de Comportamento

### Cenário 1: Usuário em "Dashboard Geral" → Navega para "Usuários"

#### Estado Inicial:
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▼       │  ← Menu aberto
│     ├─ 🏠 Dashboard Principal   │
│     └─ 📈 Análise Avançada     │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │  ← Menu fechado
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │
└─────────────────────────────────┘
```

#### Ação: Usuário clica em "Usuários" (via breadcrumb ou link direto)

#### Estado Final:
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │  ← Fechou automaticamente
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▼      │  ← Abriu automaticamente
│     ├─ ⚙️ Usuários [ATIVO]     │  ← Item ativo
│     ├─ ✅ Clientes              │
│     ├─ 🎮 Jogos                │
│     └─ 👥 Bolões               │
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │
└─────────────────────────────────┘
```

### Cenário 2: Usuário em "Cadastros Gerais" → Navega para "Relatório de Vendas"

#### Estado Inicial:
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▼      │  ← Menu aberto
│     ├─ ⚙️ Usuários             │
│     ├─ ✅ Clientes              │
│     ├─ 🎮 Jogos                │
│     └─ 👥 Bolões               │
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Menu fechado
└─────────────────────────────────┘
```

#### Ação: Usuário clica em "Relatório de Vendas" (via breadcrumb ou link direto)

#### Estado Final:
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │  ← Fechou automaticamente
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▼     │  ← Abriu automaticamente
│     ├─ 🛒 Relatório de Vendas [ATIVO]  ← Item ativo
│     ├─ 📄 Relatório Financeiro │
│     ├─ ✅ Relatório de Usuários│
│     └─ 🎮 Relatório de Jogos   │
└─────────────────────────────────┘
```

## Implementação Técnica

### Hook `useMenuState` (Já Implementado)
```typescript
// Função para expandir automaticamente menus que contêm itens ativos
const expandActiveMenu = (item: MenuItem) => {
  if (item.children) {
    const hasActiveChild = item.children.some(child => isActive(child))
    if (hasActiveChild) {
      // Comportamento de accordion: fecha todos os outros e abre apenas este
      setExpandedMenus(new Set([item.id]))
    }
  }
}
```

### Componente `Submenu` (Atualizado)
```typescript
// Detectar mudança de rota e ajustar menus automaticamente
useEffect(() => {
  if (hasActiveChild && sidebarOpen) {
    // Se este menu tem um filho ativo, garantir que ele está aberto
    expandActiveMenu(item)
  }
}, [location.pathname, sidebarOpen, hasActiveChild, expandActiveMenu, item])
```

## Fluxo de Funcionamento

### 1. **Detecção de Mudança de Rota**
```
Usuário navega para /usuarios
↓
location.pathname muda
↓
useEffect é disparado
↓
Verifica se algum menu tem item ativo
```

### 2. **Ajuste Automático dos Menus**
```
Se menu "Cadastros Gerais" tem item ativo:
↓
expandActiveMenu("cadastros-gerais")
↓
setExpandedMenus(new Set(["cadastros-gerais"]))
↓
Todos os outros menus fecham
↓
Menu "Cadastros Gerais" abre
```

### 3. **Resultado Visual**
```
Antes: Dashboard Geral ▼ (aberto)
Depois: Cadastros Gerais ▼ (aberto)
```

## Casos de Uso Práticos

### 1. **Navegação via Breadcrumb**
```
Usuário em: Dashboard Principal
Breadcrumb: 🏠 Início > 📊 Principal > 🏠 Dashboard Geral > 🏠 Dashboard Principal
↓
Clica em: 🏠 Início
↓
Navega para: /
↓
Menu "Dashboard Geral" abre automaticamente
Menu "Cadastros Gerais" fecha automaticamente
```

### 2. **Navegação via Link Direto**
```
Usuário em: Usuários (/usuarios)
↓
Clica em: Relatório de Vendas (via link externo)
↓
Navega para: /relatorios/vendas
↓
Menu "Cadastros Gerais" fecha automaticamente
Menu "Relatórios Gerais" abre automaticamente
```

### 3. **Navegação via URL Direta**
```
Usuário digita: /relatorios/financeiro
↓
Página carrega
↓
Sistema detecta rota ativa
↓
Menu "Relatórios Gerais" abre automaticamente
Outros menus fecham automaticamente
```

## Benefícios da Implementação

### ✅ **Navegação Intuitiva**
- Usuário sempre vê o menu correto aberto
- Contexto visual claro da localização atual
- Transições automáticas entre menus

### ✅ **Experiência Consistente**
- Comportamento previsível em todas as navegações
- Interface sempre organizada
- Foco claro na seção ativa

### ✅ **Eficiência de Interface**
- Apenas o menu relevante fica aberto
- Interface limpa e focada
- Navegação contextual automática

### ✅ **Acessibilidade**
- Usuário sempre sabe onde está
- Contexto visual claro
- Navegação por teclado preservada

## Testes de Funcionamento

### ✅ **Teste de Navegação Cruzada**
- [x] Dashboard → Usuários: Menu correto abre/fecha
- [x] Cadastros → Relatórios: Menu correto abre/fecha
- [x] Operacional → Dashboard: Menu correto abre/fecha

### ✅ **Teste de URL Direta**
- [x] Acessar /usuarios: Menu "Cadastros Gerais" abre
- [x] Acessar /relatorios/vendas: Menu "Relatórios Gerais" abre
- [x] Acessar /: Menu "Dashboard Geral" abre

### ✅ **Teste de Breadcrumb**
- [x] Navegar via breadcrumb: Menus ajustam automaticamente
- [x] Clicar em "Início": Menu correto abre
- [x] Navegar entre seções: Transições suaves

### ✅ **Teste de Performance**
- [x] Navegação rápida: Animações suaves
- [x] Múltiplas mudanças: Estado correto
- [x] Sidebar fechada/aberta: Comportamento consistente

## Configurações Técnicas

### Dependências do useEffect
```typescript
useEffect(() => {
  if (hasActiveChild && sidebarOpen) {
    expandActiveMenu(item)
  }
}, [location.pathname, sidebarOpen, hasActiveChild, expandActiveMenu, item])
```

### Detecção de Item Ativo
```typescript
const isActive = (menuItem: MenuItem): boolean => {
  if (menuItem.href && location.pathname === menuItem.href) {
    return true
  }
  
  if (menuItem.children) {
    return menuItem.children.some(child => isActive(child))
  }
  
  return false
}
```

## Próximos Passos

### Funcionalidades Futuras
- [ ] Persistir estado de menu por usuário
- [ ] Configuração de menu favorito
- [ ] Atalhos de teclado para navegação
- [ ] Histórico de navegação

### Melhorias Visuais
- [ ] Indicadores de menu ativo mais evidentes
- [ ] Animações mais elaboradas
- [ ] Cores temáticas por seção
- [ ] Badges de notificação
