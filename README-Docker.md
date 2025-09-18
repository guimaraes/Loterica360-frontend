# Docker Setup - Loteria360 Frontend

Este documento contém instruções para executar o projeto Loteria360 Frontend usando Docker.

## 🐳 Arquivos Docker

- `Dockerfile` - Para produção (multi-stage build com Nginx)
- `Dockerfile.dev` - Para desenvolvimento
- `docker-compose.yml` - Orquestração de containers
- `nginx.conf` - Configuração do Nginx
- `.dockerignore` - Arquivos ignorados no build

## 🚀 Execução

### Produção

```bash
# Build da imagem
docker build -t loterica360-frontend .

# Executar container
docker run -p 80:80 loterica360-frontend
```

### Desenvolvimento

```bash
# Build da imagem de desenvolvimento
docker build -f Dockerfile.dev -t loterica360-frontend-dev .

# Executar container de desenvolvimento
docker run -p 3000:3000 -v $(pwd):/app loterica360-frontend-dev
```

### Docker Compose

```bash
# Produção
docker-compose up -d

# Desenvolvimento
docker-compose --profile dev up -d frontend-dev
```

## 📋 Comandos Úteis

```bash
# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f frontend

# Rebuild sem cache
docker-compose build --no-cache

# Limpar containers e volumes
docker-compose down -v --remove-orphans
```

## 🌐 Acesso

- **Produção**: http://localhost
- **Desenvolvimento**: http://localhost:3000
- **Health Check**: http://localhost/health

## ⚙️ Configurações

### Variáveis de Ambiente

O container de produção usa as seguintes variáveis:

- `NODE_ENV=production`

### Nginx

O Nginx está configurado com:

- Compressão Gzip
- Cache de assets estáticos
- Headers de segurança
- Suporte a client-side routing
- Proxy para API (se necessário)

### Health Check

O container inclui health check que verifica:

- **Produção**: http://localhost/health
- **Desenvolvimento**: http://localhost:3000/

## 🔧 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**:
   ```bash
   # Verificar processos usando a porta
   lsof -i :80
   lsof -i :3000
   ```

2. **Permissões de arquivo**:
   ```bash
   # Dar permissões ao diretório
   chmod -R 755 .
   ```

3. **Cache do Docker**:
   ```bash
   # Limpar cache
   docker system prune -a
   ```

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos do frontend
docker-compose logs -f frontend
```

## 📦 Otimizações

### Multi-stage Build

O Dockerfile de produção usa multi-stage build para:

- Reduzir tamanho da imagem final
- Separar dependências de build das de produção
- Usar Nginx Alpine (imagem mínima)

### .dockerignore

O arquivo `.dockerignore` exclui:

- `node_modules`
- Arquivos de desenvolvimento
- Cache e logs
- Arquivos do sistema

### Nginx

Configurações otimizadas:

- Compressão Gzip
- Cache de assets
- Headers de segurança
- Suporte a SPA routing
