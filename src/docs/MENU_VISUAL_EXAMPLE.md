# Exemplo Visual do Sistema de Menus

## Estrutura do Menu Lateral

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

## Estados Visuais

### Menu Normal
```
┌─────────────────────────────────┐
│  📊 CADASTROS                   │
│  ├─ ⚙️ Usuários                │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
└─────────────────────────────────┘
```

### Menu Ativo (Usuários selecionado)
```
┌─────────────────────────────────┐
│  📊 CADASTROS                   │
│  ├─ ⚙️ Usuários [ATIVO]        │
│  ├─ ✅ Clientes                 │
│  ├─ 🎮 Jogos                   │
│  └─ 👥 Bolões                  │
└─────────────────────────────────┘
```

### Submenu Expandido
```
┌─────────────────────────────────┐
│  📊 RELATÓRIOS                  │
│  └─ 📊 Relatórios Gerais ▼     │
│     ├─ 🛒 Relatório de Vendas  │
│     └─ 📄 Relatório Financeiro │
│                                 │
│     [Submenu ativo quando       │
│      "Relatório de Vendas"      │
│      está selecionado]          │
└─────────────────────────────────┘
```

### Menu Colapsado (Sidebar fechada)
```
┌─────┐
│  🏠 │
│  ⚙️ │
│  ✅ │
│  🎮 │
│  👥 │
│  🛒 │
│  🕐 │
│  📄 │
│  📊 │
└─────┘
```

## Breadcrumb

### Exemplo 1: Página de Usuários
```
🏠 Início > 👥 Cadastros > ⚙️ Usuários
```

### Exemplo 2: Relatório de Vendas
```
🏠 Início > 📊 Relatórios > 📊 Relatórios Gerais > 🛒 Relatório de Vendas
```

### Exemplo 3: Dashboard (sem breadcrumb)
```
[Sem breadcrumb - página inicial]
```

## Funcionalidades Interativas

### 1. Expansão de Submenu
- Clique no menu pai para expandir/colapsar
- Animação suave com ícone de seta
- Estado persistente durante a sessão

### 2. Indicadores Visuais
- Menu ativo: fundo colorido
- Submenu ativo: ícone destacado
- Hover: efeito de transparência

### 3. Responsividade
- Desktop: Menu lateral completo
- Mobile: Menu colapsado ou overlay
- Transições suaves entre estados

## Cores e Estilos

### Cores do Tema
- **Primário**: Azul (#3b82f6)
- **Secundário**: Cinza (#6b7280)
- **Sucesso**: Verde (#10b981)
- **Aviso**: Amarelo (#f59e0b)
- **Erro**: Vermelho (#ef4444)

### Estados de Menu
```css
/* Menu Normal */
.menu-item {
  color: #6b7280;
  background: transparent;
}

/* Menu Hover */
.menu-item:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Menu Ativo */
.menu-item.active {
  background: #3b82f6;
  color: white;
}

/* Submenu Ativo */
.submenu-item.active {
  background: #dbeafe;
  color: #1d4ed8;
}
```

## Acessibilidade

### Navegação por Teclado
- `Tab`: Navegar entre menus
- `Enter/Space`: Ativar menu
- `Arrow Down/Up`: Navegar em submenus
- `Escape`: Fechar submenu

### ARIA Labels
```html
<nav role="navigation" aria-label="Menu principal">
  <button aria-expanded="false" aria-controls="submenu-relatorios">
    Relatórios Gerais
  </button>
  <ul id="submenu-relatorios" aria-hidden="true">
    <li><a href="/relatorios/vendas">Relatório de Vendas</a></li>
  </ul>
</nav>
```

## Exemplo de Implementação

### Adicionar Novo Menu
```typescript
// 1. Adicionar ícone
import { Package } from 'lucide-react'

// 2. Atualizar iconMap
const iconMap = {
  // ... outros ícones
  Package
}

// 3. Adicionar ao menu
{
  id: 'produtos',
  name: 'Produtos',
  href: '/produtos',
  icon: 'Package'
}
```

### Adicionar Submenu Complexo
```typescript
{
  id: 'configuracoes',
  name: 'Configurações',
  icon: 'Settings',
  children: [
    {
      id: 'config-geral',
      name: 'Configurações Gerais',
      href: '/config/geral',
      icon: 'Cog'
    },
    {
      id: 'config-avancado',
      name: 'Configurações Avançadas',
      icon: 'Wrench',
      children: [
        {
          id: 'config-sistema',
          name: 'Sistema',
          href: '/config/sistema',
          icon: 'Server'
        },
        {
          id: 'config-banco',
          name: 'Banco de Dados',
          href: '/config/banco',
          icon: 'Database'
        }
      ]
    }
  ]
}
```

## Benefícios da Nova Estrutura

### ✅ Organização
- Menus agrupados logicamente
- Hierarquia clara e intuitiva
- Fácil localização de funcionalidades

### ✅ Escalabilidade
- Fácil adição de novos menus
- Suporte a múltiplos níveis
- Estrutura flexível

### ✅ Usabilidade
- Navegação intuitiva
- Feedback visual claro
- Breadcrumb contextual

### ✅ Manutenibilidade
- Código modular
- Configuração centralizada
- Fácil customização
