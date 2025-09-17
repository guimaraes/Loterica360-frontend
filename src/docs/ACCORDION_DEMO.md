# Demonstração do Comportamento de Accordion

## Sequência de Interações

### Passo 1: Estado Inicial
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │
└─────────────────────────────────┘
```
**Estado:** Todos os menus fechados

---

### Passo 2: Usuário Clica em "Dashboard Geral"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▼       │  ← Expandiu
│     ├─ 🏠 Dashboard Principal   │
│     └─ 📈 Análise Avançada     │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │  ← Permanece fechado
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │  ← Permanece fechado
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Permanece fechado
└─────────────────────────────────┘
```
**Ação:** Usuário clicou em "Dashboard Geral"  
**Resultado:** Menu expandido, outros permanecem fechados

---

### Passo 3: Usuário Clica em "Cadastros Gerais"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │  ← Fechou automaticamente
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▼      │  ← Expandiu
│     ├─ ⚙️ Usuários             │
│     ├─ ✅ Clientes              │
│     ├─ 🎮 Jogos                │
│     └─ 👥 Bolões               │
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │  ← Permanece fechado
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Permanece fechado
└─────────────────────────────────┘
```
**Ação:** Usuário clicou em "Cadastros Gerais"  
**Resultado:** "Dashboard Geral" fechou automaticamente, "Cadastros Gerais" expandiu

---

### Passo 4: Usuário Clica em "Usuários"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▼      │  ← Permanece aberto
│     ├─ ⚙️ Usuários [ATIVO]     │  ← Navegou para aqui
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
**Ação:** Usuário clicou em "Usuários"  
**Resultado:** Navegou para `/usuarios`, menu permanece aberto, item destacado

---

### Passo 5: Usuário Clica em "Relatórios Gerais"
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
│  └─ 📊 Relatórios Gerais ▼     │  ← Expandiu
│     ├─ 🛒 Relatório de Vendas  │
│     ├─ 📄 Relatório Financeiro │
│     ├─ ✅ Relatório de Usuários│
│     └─ 🎮 Relatório de Jogos   │
└─────────────────────────────────┘
```
**Ação:** Usuário clicou em "Relatórios Gerais"  
**Resultado:** "Cadastros Gerais" fechou automaticamente, "Relatórios Gerais" expandiu

---

### Passo 6: Usuário Clica Novamente em "Relatórios Gerais"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Fechou
└─────────────────────────────────┘
```
**Ação:** Usuário clicou novamente em "Relatórios Gerais"  
**Resultado:** Menu fechou completamente, todos os menus fechados

## Benefícios Demonstrados

### ✅ **Interface Limpa**
- Apenas um menu aberto por vez
- Sem sobreposição de conteúdo
- Foco claro na seção ativa

### ✅ **Comportamento Intuitivo**
- Usuário clica em menu → outros fecham automaticamente
- Comportamento previsível e consistente
- Navegação fluida entre seções

### ✅ **Eficiência de Espaço**
- Melhor aproveitamento do espaço vertical
- Informações organizadas hierarquicamente
- Interface não poluída

### ✅ **Experiência Focada**
- Usuário sempre sabe qual seção está ativa
- Transições suaves entre seções
- Navegação contextual clara

## Casos de Uso Práticos

### 1. **Trabalho Sequencial**
```
Usuário trabalhando em cadastros:
1. Abre "Cadastros Gerais" → trabalha com usuários
2. Precisa verificar operacional → clica em "Operacional Geral"
3. Menu de cadastros fecha automaticamente
4. Menu operacional abre automaticamente
5. Interface limpa e focada
```

### 2. **Navegação Rápida**
```
Usuário alternando entre seções:
1. Em relatórios → clica em dashboard
2. Menu de relatórios fecha automaticamente
3. Menu de dashboard abre automaticamente
4. Transição suave e rápida
```

### 3. **Foco em Uma Seção**
```
Usuário trabalhando em uma seção específica:
1. Abre a seção desejada
2. Trabalha com todos os subitens
3. Menu permanece aberto durante toda a sessão
4. Interface organizada e focada
```

## Animações Implementadas

### Transição de Abertura
```
Menu A: ▶ → ▼ (200ms)
Menu B: ▼ → ▶ (200ms) [simultâneo]
Submenus: fade in/out (200ms)
```

### Transição de Fechamento
```
Menu A: ▼ → ▶ (200ms)
Submenus: fade out (200ms)
```

### Transição de Navegação
```
Item: normal → [ATIVO] (100ms)
Menu: permanece aberto
Breadcrumb: atualiza automaticamente
```

## Estados Visuais

### Menu Fechado
```
📊 Relatórios Gerais ▶
```

### Menu Aberto
```
📊 Relatórios Gerais ▼
  ├─ 🛒 Relatório de Vendas
  ├─ 📄 Relatório Financeiro
  ├─ ✅ Relatório de Usuários
  └─ 🎮 Relatório de Jogos
```

### Menu Ativo (com item ativo)
```
📊 Relatórios Gerais ▼ [DESTACADO]
  ├─ 🛒 Relatório de Vendas
  ├─ 📄 Relatório Financeiro
  ├─ ✅ Relatório de Usuários [ATIVO]
  └─ 🎮 Relatório de Jogos
```

## Configurações Técnicas

### Hook `useMenuState`
```typescript
// Comportamento de accordion implementado
const toggleMenu = (menuId: string) => {
  setExpandedMenus(prev => {
    const newSet = new Set(prev)
    
    if (newSet.has(menuId)) {
      // Se já está aberto, fecha
      newSet.delete(menuId)
    } else {
      // Se não está aberto, fecha todos e abre apenas este
      newSet.clear()
      newSet.add(menuId)
    }
    
    return newSet
  })
}
```

### CSS Transitions
```css
.menu-item {
  transition: all 200ms ease-in-out;
}

.submenu {
  transition: opacity 200ms ease-in-out;
}
```

## Testes de Funcionamento

### ✅ **Teste Básico de Accordion**
- [x] Expandir menu A → menu A abre
- [x] Expandir menu B → menu A fecha, menu B abre
- [x] Clicar novamente em menu B → menu B fecha

### ✅ **Teste de Navegação**
- [x] Navegar para item em menu A → menu A permanece aberto
- [x] Navegar para item em menu B → menu A fecha, menu B abre
- [x] Breadcrumb atualiza corretamente

### ✅ **Teste de Performance**
- [x] Alternar rapidamente entre menus
- [x] Animações suaves sem lag
- [x] Estado preservado corretamente

### ✅ **Teste de Responsividade**
- [x] Funciona em diferentes tamanhos de tela
- [x] Comportamento consistente em mobile
- [x] Tooltips funcionam corretamente
