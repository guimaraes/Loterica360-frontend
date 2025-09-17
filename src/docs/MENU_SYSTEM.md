# Sistema de Menus e Navegação

## Visão Geral

O sistema de menus foi redesenhado para ser mais amigável e organizado, com suporte a menus hierárquicos e submenus expansíveis.

## Estrutura

### 1. Tipos de Menu (`src/types/menu.ts`)

```typescript
interface MenuItem {
  id: string           // Identificador único
  name: string         // Nome exibido
  href?: string        // URL (opcional para menus pai)
  icon: string         // Nome do ícone do Lucide React
  children?: MenuItem[] // Submenus (opcional)
  badge?: string | number // Badge/notificação (opcional)
  disabled?: boolean   // Estado desabilitado (opcional)
}

interface MenuSection {
  id: string          // Identificador da seção
  title: string       // Título da seção
  items: MenuItem[]   // Itens do menu
}
```

### 2. Seções de Menu

O sistema está organizado em 4 seções principais:

- **Principal**: Dashboard e Análise Avançada
- **Cadastros**: Usuários, Clientes, Jogos, Bolões
- **Operacional**: Vendas, Turnos, Movimentos
- **Relatórios**: Relatórios com submenus

### 3. Componentes

#### `Submenu.tsx`
- Gerencia a expansão/colapso de menus
- Suporte a ícones dinâmicos
- Indicadores visuais de estado ativo
- Animações suaves

#### `MenuSection.tsx`
- Agrupa itens relacionados
- Títulos de seção
- Espaçamento consistente

#### `MenuIndicator.tsx`
- Hook para detectar menu ativo
- Suporte a hierarquia de menus
- Destaque automático do caminho atual

#### `Breadcrumb.tsx`
- Navegação contextual
- Mapeamento de rotas para nomes amigáveis
- Links clicáveis para navegação rápida

## Como Adicionar Novos Menus

### 1. Adicionar Item Simples

```typescript
// Em src/types/menu.ts
{
  id: 'novo-item',
  name: 'Novo Item',
  href: '/novo-item',
  icon: 'IconName' // Nome do ícone do Lucide React
}
```

### 2. Adicionar Submenu

```typescript
{
  id: 'menu-pai',
  name: 'Menu Pai',
  icon: 'IconName',
  children: [
    {
      id: 'submenu-1',
      name: 'Submenu 1',
      href: '/submenu-1',
      icon: 'IconName1'
    },
    {
      id: 'submenu-2',
      name: 'Submenu 2',
      href: '/submenu-2',
      icon: 'IconName2'
    }
  ]
}
```

### 3. Adicionar Nova Seção

```typescript
// Em menuSections array
{
  id: 'nova-secao',
  title: 'Nova Seção',
  items: [
    // ... itens do menu
  ]
}
```

### 4. Adicionar Ícone

1. Importar o ícone em `Submenu.tsx`:
```typescript
import { NovoIcone } from 'lucide-react'
```

2. Adicionar ao mapeamento:
```typescript
const iconMap: Record<string, any> = {
  // ... outros ícones
  NovoIcone
}
```

3. Usar no menu:
```typescript
{
  id: 'item-com-novo-icone',
  name: 'Item com Novo Ícone',
  href: '/rota',
  icon: 'NovoIcone'
}
```

## Funcionalidades

### ✅ Implementado
- [x] Estrutura hierárquica de menus
- [x] Submenus expansíveis
- [x] Ícones dinâmicos
- [x] Indicadores de menu ativo
- [x] Breadcrumb automático
- [x] Animações suaves
- [x] Responsividade
- [x] Estados visuais (ativo, hover, disabled)

### 🔄 Futuras Melhorias
- [ ] Badges de notificação
- [ ] Menu de contexto
- [ ] Favoritos/Bookmarks
- [ ] Busca de menus
- [ ] Temas personalizáveis
- [ ] Menu mobile otimizado

## Exemplos de Uso

### Menu com Badge
```typescript
{
  id: 'notificacoes',
  name: 'Notificações',
  href: '/notificacoes',
  icon: 'Bell',
  badge: 5 // Número de notificações
}
```

### Menu Desabilitado
```typescript
{
  id: 'em-desenvolvimento',
  name: 'Em Desenvolvimento',
  href: '#',
  icon: 'Construction',
  disabled: true
}
```

### Submenu Complexo
```typescript
{
  id: 'administracao',
  name: 'Administração',
  icon: 'Settings',
  children: [
    {
      id: 'usuarios',
      name: 'Usuários',
      href: '/admin/usuarios',
      icon: 'Users'
    },
    {
      id: 'configuracoes',
      name: 'Configurações',
      icon: 'Cog',
      children: [
        {
          id: 'config-geral',
          name: 'Configurações Gerais',
          href: '/admin/config/geral',
          icon: 'Settings'
        },
        {
          id: 'config-sistema',
          name: 'Configurações do Sistema',
          href: '/admin/config/sistema',
          icon: 'Server'
        }
      ]
    }
  ]
}
```

## Considerações de Performance

- Os ícones são carregados dinamicamente
- Estados de menu são gerenciados localmente
- Animações são otimizadas com CSS transitions
- Breadcrumb é calculado apenas quando necessário

## Acessibilidade

- Suporte a navegação por teclado
- ARIA labels apropriados
- Contraste adequado
- Foco visível
- Navegação semântica
