# 🏦 CaseDevBackend

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

Backend para Multi Family Office (MFO) — ferramenta de planejamento financeiro, projeção patrimonial, controle de eventos, seguros e versões de simulação.

Desenvolvido em Node.js + Fastify + Prisma, com validação Zod, testes robustos e pronto para produção via Docker Compose.

## 🚀 Tecnologias Utilizadas

- **Node.js 20** + **TypeScript**
- **Fastify 4** (API REST ultrarrápida)
- **Prisma ORM** (PostgreSQL 15)
- **Zod** (validação de schemas)
- **Jest** + **Supertest** (testes unitários, integração e E2E)
- **Swagger** (documentação automática)
- **ESLint** (padronização de código)
- **SonarCloud** (qualidade e cobertura)
- **Docker Compose** (deploy local e CI)


## 🏗️ Arquitetura

```
src/
	app.ts                # Bootstrap Fastify
	controllers/          # Lógica dos endpoints
	routes/               # Definição das rotas Fastify
	services/             # Regras de negócio (domain/service layer)
	schemas/              # Schemas Zod para validação
	prisma/               # Schema e migrações Prisma
tests/
	controllers/          # Testes de controllers
	routes/               # Testes E2E (Supertest)
	services/             # Testes unitários/integrados de serviços
```

## 📦 Como rodar localmente (Docker Compose)
```bash
# 1. Clone o repositório
git clone https://github.com/rodrigo-falcao/CaseDevBackend.git
cd CaseDevBackend

# 2. Suba tudo com Docker Compose
docker compose up --build

# 3. Acesse a API em http://localhost:3001
# 4. Acesse a documentação Swagger em http://localhost:3001/docs
```


## 🧪 Testes

```bash
# Rodar todos os testes
docker compose run --rm backend npx jest

# Cobertura de testes
docker compose run --rm backend npx jest --coverage --coverageReporters=text

# Lint
docker compose run --rm backend npx eslint .
```

## 📝 Endpoints Principais

### Simulações

- `POST   /simulations` — Criar simulação
- `GET    /simulations` — Listar simulações
- `GET    /simulations/:id` — Buscar simulação por ID
- `PUT    /simulations/:id` — Atualizar simulação
- `DELETE /simulations/:id` — Remover simulação

### Projeção Patrimonial

- `POST /simulations/:id/projection`
	- **Body:** `{ "status": "Vivo" | "Morto" | "Inválido" }`
	- **Retorno:** Projeção ano a ano até 2060

### Duplicação e Versões

- `POST /simulations/:id/duplicate` — Duplicar simulação (novo nome)
- `POST /simulations/:id/current` — Criar situação atual
- `GET  /simulations/recent` — Listar versões mais recentes

### Exemplo de Request/Response

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


## 📚 Documentação Swagger

Acesse em:  
`http://localhost:3001/docs`


## 🛠️ Comandos Úteis

- **Gerar migrações Prisma:**  
	`docker compose run --rm backend npx prisma migrate dev`
- **Acessar banco via Prisma Studio:**  
	`docker compose run --rm backend npx prisma studio`
- **Gerar client Prisma:**  
	`docker compose run --rm backend npx prisma generate`


## ☑️ SonarCloud

- Projeto integrado ao SonarCloud para análise de qualidade, duplicidade e cobertura.
- [Acesse o dashboard SonarCloud](https://sonarcloud.io/organization/rodrigo-falcao)


## 📋 Suposições e Decisões

- Cada simulação pode ter múltiplas versões, mas só a mais recente é editável.
- Situação Atual é sempre baseada na versão mais recente e não pode ser editada/deletada.
- Validação de dados feita com Zod e JSON Schema.
- Testes priorizam o motor de projeção e regras de negócio.
- O backend está pronto para produção e CI/CD.

## 👨‍💻 Autor

- Rodrigo Falcão — [LinkedIn](https://www.linkedin.com/in/rodrigo-falcao-ferreira)

## 🏁 Como contribuir

Pull requests são bem-vindos!  
Abra uma issue para sugestões ou bugs.


## 🏆 Diferenciais

- Cobertura de testes acima de 80%
- Integração contínua com SonarCloud
- Código limpo, modular e documentado
- Pronto para produção com Docker Compose


## 📞 Contato

Dúvidas? Fique à vontade para me chamar no LinkedIn ou abrir uma issue!
