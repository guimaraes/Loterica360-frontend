# Loteria360 Frontend

Sistema de gestão de lotéricas desenvolvido em React + TypeScript.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **Redux Toolkit** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Router** - Roteamento
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── assets/           # Imagens, ícones, fontes
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes base (Button, Input, etc.)
│   ├── layout/      # Componentes de layout (Header, Sidebar)
│   └── forms/       # Componentes de formulário
├── hooks/           # Hooks customizados
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── store/           # Gerenciamento de estado (Redux)
├── styles/          # Estilos globais
├── types/           # Definições de tipos TypeScript
└── utils/           # Funções utilitárias
```

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd Loterica360-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   VITE_APP_NAME=Loteria360
   VITE_APP_VERSION=1.0.0
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

   O projeto estará disponível em `http://localhost:3000`

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier
- `npm run test` - Executa os testes

## 🎨 Componentes UI

O projeto utiliza uma biblioteca de componentes customizada baseada em TailwindCSS:

- **Button** - Botões com variantes e estados
- **Input** - Campos de entrada com validação
- **Select** - Seletores dropdown
- **Card** - Cards para agrupamento de conteúdo
- **Modal** - Modais e diálogos
- **Table** - Tabelas com paginação e ordenação

## 🔐 Autenticação

O sistema utiliza JWT para autenticação:

- Login com email e senha
- Token armazenado no localStorage
- Proteção de rotas automática
- Interceptadores de requisição para adicionar token

## 📊 Gerenciamento de Estado

- **Redux Toolkit** para estado global
- **React Query** para cache de dados da API
- Slices organizados por funcionalidade
- Middleware para persistência

## 🎯 Funcionalidades

### Implementadas
- ✅ Sistema de autenticação
- ✅ Layout responsivo com sidebar
- ✅ Dashboard com métricas
- ✅ Páginas de navegação
- ✅ Componentes UI base
- ✅ Integração com API
- ✅ Gerenciamento de estado

### Em Desenvolvimento
- 🔄 Formulários de CRUD
- 🔄 Relatórios e gráficos
- 🔄 Notificações em tempo real
- 🔄 Testes automatizados
- 🔄 PWA (Progressive Web App)

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy no Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy no Netlify
```bash
npm run build
# Upload da pasta dist/ para Netlify
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: suporte@loteria360.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)