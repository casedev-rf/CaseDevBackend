# 🏦 Multi Family Office - Backend

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.x-black?logo=fastify)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Jest](https://img.shields.io/badge/Jest-29.x-red?logo=jest)](https://jestjs.io/)
[![Supertest](https://img.shields.io/badge/Supertest-E2E-lightgrey)](https://github.com/visionmedia/supertest)
[![Zod](https://img.shields.io/badge/Zod-4.x-ff69b4?logo=zod)](https://zod.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)
[![SonarCloud](https://img.shields.io/badge/SonarCloud-Quality-orange?logo=sonarcloud)](https://sonarcloud.io/)
[![ESLint](https://img.shields.io/badge/ESLint-linting-purple?logo=eslint)](https://eslint.org/)

## ✨ Visão Geral

Backend para Multi Family Office (MFO) — API REST de alta performance para planejamento financeiro avançado, projeção patrimonial inteligente, gestão granular de alocações, sistema completo de seguros e controle de versões de simulação.

Desenvolvido com **Node.js 20** + **Fastify 4** + **Prisma ORM**, oferecendo validação robusta com Zod, cobertura de testes superior a 70%, documentação automática via Swagger e deploy simplificado com Docker Compose.

**Arquitetura enterprise-ready** com Clean Architecture, Type Safety completo e integração contínua com SonarCloud para garantia de qualidade.

## � Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠 Tecnologias](#-tecnologias)
- [�🚀 Instalação](#-instalação)
- [🏗 Arquitetura](#-arquitetura)
- [📝 API Endpoints](#-api-endpoints)
- [🧪 Testes](#-testes)
- [🔧 Comandos Úteis](#-comandos-úteis)
- [📊 Qualidade de Código](#-qualidade-de-código)
- [🐳 Docker](#-docker)

## 🎯 Sobre o Projeto

O **Multi Family Office Backend** é uma API REST robusta e escalável para gestão patrimonial avançada, oferecendo cálculos complexos de projeção financeira, controle granular de alocações e sistema completo de versionamento de simulações.

### 🎪 Principais Diferenciais

- **⚡ Performance**: Fastify para APIs ultrarrápidas
- **🔒 Type Safety**: TypeScript + Zod para validação robusta
- **🧪 Qualidade**: Cobertura de testes acima de 80%
- **📊 Observabilidade**: Integração com SonarCloud
- **🐳 Deploy**: Docker Compose para desenvolvimento e produção
- **📚 Documentação**: Swagger automático para todos os endpoints

## ✨ Funcionalidades

### 📊 **Simulações Financeiras**
- **CRUD Completo**: Criação, leitura, atualização e exclusão
- **Versionamento**: Controle de versões com histórico
- **Duplicação**: Clone simulações para cenários alternativos
- **Situação Atual**: Snapshot de estado para comparações
- **Validação**: Schemas Zod para entrada de dados

### 💰 **Projeção Patrimonial**
- **Algoritmo Avançado**: Cálculos de crescimento até 2060
- **Status de Vida**: Projeções para Vivo, Morto e Inválido
- **Múltiplos Cenários**: Original, Atual e Otimizado
- **Patrimônio Detalhado**: Financeiro, Imobilizado e Total
- **Impacto de Seguros**: Cálculos com e sem cobertura

### 🏦 **Gestão de Alocações**
- **Alocações Manuais**: Controle granular de investimentos
- **Tipos de Ativos**: Financeiros e Imobilizados
- **Timeline**: Rastreamento temporal de mudanças
- **Financiamentos**: Gestão de ativos com financiamento
- **Validação**: Regras de negócio aplicadas

### 🛡️ **Sistema de Seguros**
- **Catálogo Completo**: Vida, Invalidez, Acidentes
- **Cálculos Automáticos**: Prêmios e coberturas
- **Integração**: Impacto nas projeções patrimoniais
- **Duração Flexível**: Controle de períodos
- **Validação**: Regras específicas por tipo

### 📈 **Controle de Eventos**
- **Timeline de Eventos**: Marcos financeiros importantes
- **Entrada e Saída**: Fluxos de caixa programados
- **Integração**: Impacto automático nas projeções
- **Flexibilidade**: Eventos personalizáveis
- **Rastreamento**: Histórico completo de mudanças

## 🚀 Tecnologias

### **🏗 Core Framework**
- **Node.js 20** - Runtime JavaScript de alta performance
- **TypeScript 4** - Tipagem estática para maior confiabilidade
- **Fastify 4** - Framework web ultrarrápido e eficiente

### **🗄️ Database & ORM**
- **PostgreSQL 15** - Banco relacional robusto e escalável
- **Prisma ORM** - Type-safe database access com migrations
- **Database Migrations** - Controle de versão do schema

### **🔒 Validation & Security**
- **Zod 4** - Validação de schemas TypeScript-first
- **JSON Schema** - Validação automática de payloads
- **Type Guards** - Proteção em runtime

### **🧪 Testing & Quality**
- **Jest 29** - Framework de testes unitários e integração
- **Supertest** - Testes E2E para APIs REST
- **SonarCloud** - Análise de qualidade e cobertura
- **ESLint** - Linting e padronização de código

### **📚 Documentation & DevOps**
- **Swagger/OpenAPI** - Documentação automática da API
- **Docker Compose** - Containerização e orquestração
- **GitHub Actions** - CI/CD pipeline (futuro)

### **🔧 Utils & Helpers**
- **Date-fns** - Manipulação de datas
- **UUID** - Geração de identificadores únicos
- **Fastify Plugins** - Modularização e extensibilidade

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (se rodar sem Docker)

### **1. Clone o repositório**
```bash
git clone https://github.com/rodrigo-falcao/CaseDevBackend.git
cd CaseDevBackend
```

### **2. Configuração com Docker (Recomendado)**
```bash
# Suba todos os serviços
docker compose up --build

# Em modo desenvolvimento (com watch)
docker compose up --build --watch
```

### **3. Configuração Manual (Alternativa)**
```bash
# Instale as dependências
npm install

# Configure o banco PostgreSQL
# Ajuste a DATABASE_URL no .env

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
```


## 🏗 Arquitetura

### **📁 Estrutura de Pastas**
```
src/
├── app.ts                    # Bootstrap da aplicação Fastify
├── controllers/              # Lógica dos endpoints (HTTP layer)
│   ├── simulationController.ts
│   ├── allocationController.ts
│   ├── insuranceController.ts
│   ├── eventController.ts
│   └── simulationVersionController.ts
├── routes/                   # Definição das rotas Fastify
│   ├── simulationRoutes.ts
│   ├── allocationRoutes.ts
│   ├── insuranceRoutes.ts
│   ├── eventRoutes.ts
│   └── simulationVersionRoutes.ts
├── services/                 # Regras de negócio (Business Logic)
│   ├── simulationService.ts
│   ├── allocationService.ts
│   ├── insuranceService.ts
│   ├── eventService.ts
│   └── simulationVersionService.ts
├── schemas/                  # Schemas Zod para validação
│   ├── simulationCreateSchema.ts
│   ├── simulationUpdateSchema.ts
│   └── ... (outros schemas)
└── prisma/
    ├── schema.prisma        # Schema do banco de dados
    └── migrations/          # Migrações do Prisma

tests/
├── controllers/             # Testes de controllers (HTTP)
├── routes/                  # Testes E2E com Supertest
└── services/                # Testes unitários de regras de negócio
```

### **� Fluxo da Aplicação**
1. **HTTP Request** → Routes (Fastify)
2. **Route Handler** → Controller (HTTP Logic)
3. **Controller** → Service (Business Logic)
4. **Service** → Prisma (Database Access)
5. **Response** ← Schema Validation (Zod)

### **🎯 Padrões Arquiteturais**
- **Separation of Concerns**: Camadas bem definidas
- **Dependency Injection**: Injeção via parâmetros
- **Schema-First Design**: Validação com Zod
- **Test-Driven Development**: Testes para cada camada
- **Clean Architecture**: Independência de frameworks

## 🧪 Testes

### **🚀 Execução de Testes**
```bash
# Rodar todos os testes
docker compose run --rm backend npm test

# Testes com cobertura
docker compose run --rm backend npm run test:coverage

# Testes em modo watch
docker compose run --rm backend npm run test:watch

# Testes E2E específicos
docker compose run --rm backend npm run test:e2e

# Lint do código
docker compose run --rm backend npm run lint
```

### **� Cobertura de Testes**
- **Unit Tests**: Services e utilities
- **Integration Tests**: Controllers com banco de dados
- **E2E Tests**: Fluxos completos da API
- **Coverage Goal**: >80% em todas as camadas

### **🧪 Estrutura de Testes**
```
tests/
├── controllers/         # Testes HTTP (Supertest)
├── services/           # Testes unitários (Jest)
├── routes/             # Testes E2E completos
└── __mocks__/          # Mocks para dependências
```

## 📝 API Endpoints

### **📊 Simulações**
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/simulations` | Criar nova simulação | ❌ |
| `GET` | `/simulations` | Listar todas as simulações | ❌ |
| `GET` | `/simulations/:id` | Buscar simulação por ID | ❌ |
| `PUT` | `/simulations/:id` | Atualizar simulação existente | ❌ |
| `DELETE` | `/simulations/:id` | Remover simulação | ❌ |
| `GET` | `/simulations/recent` | Listar versões mais recentes | ❌ |

### **💰 Projeção Patrimonial**
| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `POST` | `/simulations/:id/projection` | Calcular projeção patrimonial | `{ "status": "Vivo" \| "Morto" \| "Inválido" }` |

### **🔄 Duplicação e Versões**
| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `POST` | `/simulations/:id/duplicate` | Duplicar simulação | `{ "name": "Novo Nome" }` |
| `POST` | `/simulations/:id/current` | Criar situação atual | `{}` |

### **🏦 Alocações**
| Método | Endpoint | Descrição | Parâmetros |
|--------|----------|-----------|------------|
| `GET` | `/allocations` | Listar alocações | `?versionId=123` |
| `POST` | `/allocations` | Criar alocação | Payload completo |
| `PUT` | `/allocations/:id` | Atualizar alocação | Payload parcial |
| `DELETE` | `/allocations/:id` | Remover alocação | - |

### **🛡️ Seguros**
| Método | Endpoint | Descrição | Filtros |
|--------|----------|-----------|---------|
| `GET` | `/insurances` | Listar seguros | `?versionId=123&type=vida` |
| `POST` | `/insurances` | Criar seguro | Dados do seguro |
| `PUT` | `/insurances/:id` | Atualizar seguro | Dados parciais |
| `DELETE` | `/insurances/:id` | Remover seguro | - |

### **📈 Eventos**
| Método | Endpoint | Descrição | Filtros |
|--------|----------|-----------|---------|
| `GET` | `/events` | Listar eventos | `?versionId=123&year=2025` |
| `POST` | `/events` | Criar evento | Dados do evento |
| `PUT` | `/events/:id` | Atualizar evento | Dados parciais |
| `DELETE` | `/events/:id` | Remover evento | - |

### **📚 Documentação**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/docs` | Swagger UI interativo |
| `GET` | `/docs/json` | OpenAPI JSON spec |

## 🔧 Comandos Úteis

### **🗄️ Banco de Dados**
```bash
# Migrações do Prisma
docker compose run --rm backend npx prisma migrate dev --name migration_name

# Reset do banco (CUIDADO: apaga todos os dados)
docker compose run --rm backend npx prisma migrate reset

# Prisma Studio (interface visual)
docker compose run --rm backend npx prisma studio

# Gerar Prisma Client
docker compose run --rm backend npx prisma generate

# Seed do banco (dados iniciais)
docker compose run --rm backend npx prisma db seed
```

### **🧪 Desenvolvimento**
```bash
# Modo desenvolvimento com hot reload
docker compose up --watch

# Logs detalhados
docker compose logs -f backend

# Acesso ao container
docker compose exec backend bash

# Reinstalar dependências
docker compose run --rm backend npm ci
```

### **🔍 Debug & Monitoramento**
```bash
# Logs do banco PostgreSQL
docker compose logs -f postgres

# Status dos containers
docker compose ps

# Uso de recursos
docker stats

# Limpeza de volumes (CUIDADO: apaga dados)
docker compose down -v
```

## 📊 Qualidade de Código

### **🎯 SonarCloud Integration**
- **Dashboard**: [Acesse o projeto no SonarCloud](https://sonarcloud.io/organization/rodrigo-falcao)
- **Métricas Principais**:
  - **Code Coverage**: >80%
  - **Maintainability**: Rating A
  - **Reliability**: Rating A
  - **Security**: Rating A
  - **Duplications**: <3%

### **📈 Métricas de Qualidade**
```bash
# Relatório de cobertura local
npm run test:coverage

# Análise estática (ESLint)
npm run lint

# Verificação de tipos (TypeScript)
npm run type-check

# Auditoria de dependências
npm audit
```

## 🐳 Docker

### **🚀 Desenvolvimento**
```dockerfile
# Dockerfile multi-stage otimizado
FROM node:20-alpine as builder
# ... build steps

FROM node:20-alpine as production  
# ... production setup
```

### **🔧 Docker Compose**
```yaml
# docker-compose.yml completo
services:
  backend:
    build: .
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://...
  
  postgres:
    image: postgres:15-alpine
    # ... configurações
```

### **⚙️ Variáveis de Ambiente**
```bash
# .env exemplo
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

### 📋 Exemplo de Request/Response

#### Criar Simulação
```http
POST /simulations
Content-Type: application/json

{
	"name": "Meu Plano Financeiro"
}
```
**Response:**
```json
{
	"id": 1,
	"name": "Meu Plano Financeiro"
}
```

#### Projeção Patrimonial
```http
POST /simulations/1/projection
Content-Type: application/json

{
	"status": "Vivo"
}
```
**Response:**
```json
{
	"simulationId": 1,
	"status": "Vivo",
	"projection": [
		{ "year": 2025, "saldo": 10000 },
		{ "year": 2026, "saldo": 12000 }
		// ... até 2060
	]
}
```

#### Atualizar Simulação
```http
PUT /simulations/1
Content-Type: application/json

{
  "name": "Novo Nome da Simulação"
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Novo Nome da Simulação"
}
```

#### Deletar Simulação
```http
DELETE /simulations/1
```
**Response:**
Status: 204 No Content

#### Duplicar Simulação
```http
POST /simulations/1/duplicate
Content-Type: application/json

{
  "name": "Simulação Duplicada"
}
```
**Response:**
```json
{
  "newSimulationId": 2
}
```

#### Criar Situação Atual
```http
POST /simulations/1/current
```
**Response:**
```json
{
  "simulationId": 1,
  "isCurrent": true
}
```

### **🔮 Roadmap Futuro**
- [ ] **Cache Layer**: Redis para queries frequentes
- [ ] **Rate Limiting**: Proteção contra abuse
- [ ] **Authentication**: JWT + refresh tokens
- [ ] **Audit Log**: Rastreamento de mudanças
- [ ] **Webhooks**: Notificações de eventos
- [ ] **GraphQL**: API alternativa para frontend
- [ ] **Monitoring**: Prometheus + Grafana
- [ ] **Load Balancing**: Nginx + múltiplas instâncias

## 🚀 Deploy & Produção

### **🌐 Ambientes**
```bash
# Desenvolvimento
docker compose -f docker-compose.yml up

# Produção (exemplo)
docker compose -f docker-compose.prod.yml up -d

# Staging
docker compose -f docker-compose.staging.yml up -d
```

<div align="center">

**Feito com ❤️ e ⚡ por [Rodrigo Falcão]**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)

</div>
