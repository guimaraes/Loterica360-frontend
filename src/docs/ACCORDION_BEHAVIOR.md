# Comportamento de Accordion nos Menus

## Visão Geral

Implementei um comportamento de accordion onde apenas um submenu pode estar aberto por vez. Quando o usuário expande um submenu, todos os outros submenus são automaticamente fechados.

## Funcionalidades Implementadas

### ✅ **Comportamento de Accordion**
- Apenas um submenu pode estar aberto por vez
- Ao expandir um submenu, os outros são automaticamente fechados
- Interface mais limpa e focada

### ✅ **Expansão Inteligente**
- Se um menu tem item ativo, ele é automaticamente expandido
- Outros menus são fechados para manter o foco
- Contexto de navegação preservado

### ✅ **Colapso Manual**
- Usuário pode colapsar o menu atual clicando novamente
- Todos os menus ficam fechados
- Interface completamente limpa

## Exemplos de Comportamento

### Cenário 1: Estado Inicial (Todos Fechados)
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

### Cenário 2: Usuário Expande "Dashboard Geral"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▼       │
│     ├─ 🏠 Dashboard Principal   │
│     └─ 📈 Análise Avançada     │
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▶      │  ← Fechado automaticamente
│                                 │
│  💼 OPERACIONAL                 │
│  └─ 🛒 Operacional Geral ▶     │  ← Fechado automaticamente
│                                 │
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▶     │  ← Fechado automaticamente
└─────────────────────────────────┘
```

### Cenário 3: Usuário Agora Expande "Cadastros Gerais"
```
┌─────────────────────────────────┐
│  📊 PRINCIPAL                   │
│  └─ 🏠 Dashboard Geral ▶       │  ← Fechado automaticamente
│                                 │
│  👥 CADASTROS                   │
│  └─ ⚙️ Cadastros Gerais ▼      │
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

### Cenário 4: Usuário Navega para "Usuários" e Depois para "Relatórios"
```
Passo 1: Clicar em "Usuários"
├─ Menu "Cadastros Gerais" permanece aberto
├─ Navega para /usuarios
└─ "Usuários" fica destacado como ativo

Passo 2: Clicar em "Relatórios Gerais"
├─ Menu "Cadastros Gerais" fecha automaticamente
├─ Menu "Relatórios Gerais" abre automaticamente
└─ Interface fica limpa e focada
```

## Implementação Técnica

### Hook `useMenuState` Atualizado

```typescript
// Toggle com comportamento de accordion
const toggleMenu = (menuId: string) => {
  setExpandedMenus(prev => {
    const newSet = new Set(prev)
    
    // Se o menu já está expandido, apenas colapsa
    if (newSet.has(menuId)) {
      newSet.delete(menuId)
    } else {
      // Se o menu não está expandido, fecha todos os outros e abre apenas este
      newSet.clear()
      newSet.add(menuId)
    }
    
    return newSet
  })
}

// Expansão automática com accordion
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

## Benefícios do Comportamento de Accordion

### ✅ **Interface Mais Limpa**
- Apenas um submenu aberto por vez
- Menos poluição visual
- Foco claro na seção ativa

### ✅ **Experiência Intuitiva**
- Comportamento previsível
- Usuário sempre sabe qual seção está ativa
- Navegação mais focada

### ✅ **Eficiência de Espaço**
- Melhor aproveitamento do espaço vertical
- Sidebar mais organizada
- Informações mais acessíveis

### ✅ **Performance**
- Menos elementos renderizados simultaneamente
- Animações mais suaves
- Menor uso de memória

## Fluxo de Estados

### Diagrama de Transições
```
Estado Inicial: Todos Fechados
    ↓ (usuário clica em menu A)
Estado: Menu A Aberto, Outros Fechados
    ↓ (usuário clica em menu B)
Estado: Menu B Aberto, Menu A Fechado
    ↓ (usuário clica novamente em menu B)
Estado: Todos Fechados
    ↓ (usuário navega para item em menu C)
Estado: Menu C Aberto (auto-expandido), Outros Fechados
```

## Casos de Uso Reais

### 1. **Usuário Trabalhando com Cadastros**
```
1. Clica em "Cadastros Gerais" → expande
2. Trabalha com Usuários, Clientes, Jogos, Bolões
3. Menu permanece aberto durante toda a sessão de cadastros
4. Interface limpa e focada
```

### 2. **Usuário Alternando Entre Seções**
```
1. Trabalha em "Cadastros Gerais" → menu aberto
2. Precisa verificar relatórios → clica em "Relatórios Gerais"
3. Menu de cadastros fecha automaticamente
4. Menu de relatórios abre automaticamente
5. Transição suave e focada
```

### 3. **Navegação Rápida**
```
1. Usuário em qualquer página
2. Clica em submenu diferente
3. Outro submenu fecha automaticamente
4. Novo submenu abre automaticamente
5. Navegação fluida e intuitiva
```

## Estados Visuais

### Menu Fechado
```
📊 Relatórios Gerais ▶
```

### Menu Aberto (Único)
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

## Animações e Transições

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

## Testes Recomendados

### 1. Teste de Accordion Básico
- [ ] Expandir um menu
- [ ] Expandir outro menu
- [ ] Verificar se o primeiro fecha automaticamente

### 2. Teste de Navegação
- [ ] Navegar para item em submenu A
- [ ] Navegar para item em submenu B
- [ ] Verificar se submenu A fecha automaticamente

### 3. Teste de Colapso
- [ ] Expandir um menu
- [ ] Clicar novamente no mesmo menu
- [ ] Verificar se fecha completamente

### 4. Teste de Performance
- [ ] Alternar rapidamente entre menus
- [ ] Verificar se animações são suaves
- [ ] Confirmar ausência de lag

## Configurações Personalizáveis

### Duração das Animações
```css
.transition-all { transition-duration: 200ms; }
```

### Comportamento do Accordion
```typescript
// Ativar/desativar accordion (se necessário no futuro)
const accordionMode = true // Sempre ativo atualmente
```

### Estados de Menu
```typescript
// Máximo de menus abertos simultaneamente
const maxOpenMenus = 1 // Sempre 1 (accordion)
```
