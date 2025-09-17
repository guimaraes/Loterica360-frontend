# Exemplo Visual: Sistema de Colapso de Menus

## Cenários de Uso

### 1. Sidebar Aberta com Submenus Expandidos

```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  ├─ 🏠 Dashboard                │
│  └─ 📈 Análise Avançada        │
│                                 │
│  👥 CADASTROS                   │
│  ├─ ⚙️ Usuários                │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
│                                 │
│  💼 OPERACIONAL                 │
│  ├─ 🛒 Vendas                  │
│  ├─ 🕐 Turnos                  │
│  └─ 📄 Movimentos              │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▼     │
│     ├─ 🛒 Relatório de Vendas  │
│     └─ 📄 Relatório Financeiro │
└─────────────────────────────────┘
```

**Estado:** Sidebar aberta, submenu "Relatórios Gerais" expandido

### 2. Usuário Clica para Fechar Sidebar

```
┌─────────────────────────────────┐
│  [Botão X]                      │
└─────────────────────────────────┘
```

**Ação:** Usuário clica no botão de fechar sidebar

### 3. Sidebar Fechada - Modo Ícone

```
┌─────┐
│  🏠 │  [Dashboard - Tooltip ao hover]
│  📈 │  [Análise Avançada - Tooltip ao hover]
│     │
│  ⚙️ │  [Usuários - Tooltip ao hover]
│  ✅ │  [Clientes - Tooltip ao hover]
│  🎮 │  [Jogos - Tooltip ao hover]
│  👥 │  [Bolões - Tooltip ao hover]
│     │
│  🛒 │  [Vendas - Tooltip ao hover]
│  🕐 │  [Turnos - Tooltip ao hover]
│  📄 │  [Movimentos - Tooltip ao hover]
│     │
│  📊 │  [Relatórios Gerais - Tooltip: "2 item(s)"]
└─────┘
```

**Estado:** 
- ✅ Todos os submenus colapsados automaticamente
- ✅ Apenas ícones principais visíveis
- ✅ Tooltips informativos ao hover
- ✅ Ícone "📊" mostra que tem 2 subitens

### 4. Usuário Navega com Sidebar Fechada

```
┌─────┐
│  🏠 │
│  📈 │
│     │
│  ⚙️ │
│  ✅ │
│  🎮 │
│  👥 │
│     │
│  🛒 │  ← [Usuário clica aqui]
│  🕐 │
│  📄 │
│     │
│  📊 │
└─────┘
```

**Ação:** Usuário clica no ícone de Vendas

**Resultado:** 
- ✅ Navega para página de Vendas
- ✅ Ícone "🛒" fica destacado (ativo)
- ✅ Breadcrumb atualiza: "🏠 Início > 💼 Operacional > 🛒 Vendas"

### 5. Usuário Reabre Sidebar

```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  ├─ 🏠 Dashboard                │
│  └─ 📈 Análise Avançada        │
│                                 │
│  👥 CADASTROS                   │
│  ├─ ⚙️ Usuários                │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
│                                 │
│  💼 OPERACIONAL                 │
│  ├─ 🛒 Vendas [ATIVO]          │  ← Destaque automático
│  ├─ 🕐 Turnos                  │
│  └─ 📄 Movimentos              │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Colapsado (não tem item ativo)
└─────────────────────────────────┘
```

**Estado Após Reabrir:**
- ✅ Submenu "Relatórios Gerais" permanece colapsado (não tem item ativo)
- ✅ Item "Vendas" está destacado como ativo
- ✅ Estado de navegação preservado

### 6. Usuário Navega para Submenu com Sidebar Aberta

```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  ├─ 🏠 Dashboard                │
│  └─ 📈 Análise Avançada        │
│                                 │
│  👥 CADASTROS                   │
│  ├─ ⚙️ Usuários                │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
│                                 │
│  💼 OPERACIONAL                 │
│  ├─ 🛒 Vendas                  │
│  ├─ 🕐 Turnos                  │
│  └─ 📄 Movimentos              │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▼     │  ← Auto-expandido
│     ├─ 🛒 Relatório de Vendas  │
│     └─ 📄 Relatório Financeiro │  ← Usuário clica aqui
└─────────────────────────────────┘
```

**Ação:** Usuário clica em "Relatório Financeiro"

**Resultado:**
- ✅ Submenu "Relatórios Gerais" auto-expande
- ✅ Navega para página do relatório
- ✅ Breadcrumb: "🏠 Início > 📊 Relatórios > 📊 Relatórios Gerais > 📄 Relatório Financeiro"

### 7. Usuário Fecha Sidebar Novamente

```
┌─────┐
│  🏠 │
│  📈 │
│     │
│  ⚙️ │
│  ✅ │
│  🎮 │
│  👥 │
│     │
│  🛒 │
│  🕐 │
│  📄 │
│     │
│  📊 │  ← [Tooltip: "Relatórios Gerais - 2 item(s)"]
└─────┘
```

**Estado:**
- ✅ Submenu colapsado automaticamente
- ✅ Ícone "📊" ainda mostra tooltip com quantidade de itens
- ✅ Contexto de navegação preservado

### 8. Usuário Reabre Sidebar (Contexto Preservado)

```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  ├─ 🏠 Dashboard                │
│  └─ 📈 Análise Avançada        │
│                                 │
│  👥 CADASTROS                   │
│  ├─ ⚙️ Usuários                │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
│                                 │
│  💼 OPERACIONAL                 │
│  ├─ 🛒 Vendas                  │
│  ├─ 🕐 Turnos                  │
│  └─ 📄 Movimentos              │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▼     │  ← Auto-expandido novamente
│     ├─ 🛒 Relatório de Vendas  │
│     └─ 📄 Relatório Financeiro │  ← [ATIVO] - Destaque preservado
└─────────────────────────────────┘
```

**Estado Final:**
- ✅ Submenu "Relatórios Gerais" auto-expande (tem item ativo)
- ✅ "Relatório Financeiro" permanece destacado como ativo
- ✅ Contexto de navegação completamente preservado

## Fluxo de Estados

### Diagrama de Estados
```
Sidebar Aberta
    ↓ (usuário fecha)
Sidebar Fechada + Submenus Colapsados
    ↓ (usuário navega)
Sidebar Fechada + Item Ativo Destacado
    ↓ (usuário reabre)
Sidebar Aberta + Submenu Auto-expandido (se tem item ativo)
    ↓ (usuário navega para submenu)
Sidebar Aberta + Submenu Expandido + Item Ativo
    ↓ (usuário fecha novamente)
Sidebar Fechada + Contexto Preservado
```

## Benefícios Demonstrados

### ✅ **Inteligência Contextual**
- Sistema "lembra" onde o usuário estava
- Auto-expansão de submenus relevantes
- Preservação de estado de navegação

### ✅ **Interface Limpa**
- Sidebar fechada mostra apenas essencial
- Tooltips informativos sem poluição visual
- Transições suaves entre estados

### ✅ **Experiência Fluida**
- Navegação funciona independente do estado da sidebar
- Feedback visual claro em todos os estados
- Animações naturais e responsivas

### ✅ **Eficiência de Espaço**
- Máximo aproveitamento do espaço da tela
- Sidebar compacta quando não necessária
- Informações essenciais sempre acessíveis

## Casos de Uso Reais

### 1. **Desenvolvedor Trabalhando**
- Sidebar fechada para maximizar área de código
- Ícones fornecem acesso rápido às funcionalidades
- Tooltips ajudam a identificar funcionalidades

### 2. **Usuário Navegando Entre Relatórios**
- Expande submenu de relatórios uma vez
- Navega entre diferentes relatórios
- Contexto preservado mesmo fechando/abrindo sidebar

### 3. **Apresentação/Demonstração**
- Sidebar fechada para foco no conteúdo
- Acesso rápido a funcionalidades via ícones
- Interface limpa e profissional

### 4. **Trabalho em Tela Pequena**
- Sidebar fechada libera mais espaço
- Navegação eficiente via ícones
- Tooltips compensam falta de labels
