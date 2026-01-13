# Form API - Backend REST

API REST profissional para receber e gerenciar submissões de formulários dinâmicos.

## 🚀 Stack Tecnológica

- **Node.js** + **Express** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - ORM moderno e type-safe
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
form-api/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── db/
│   │   └── prisma.ts          # Cliente Prisma (singleton)
│   ├── repositories/
│   │   └── form.repository.ts # Camada de acesso a dados
│   ├── services/
│   │   └── form.service.ts    # Lógica de negócio + validação
│   ├── controllers/
│   │   └── form.controller.ts # Controllers HTTP
│   ├── routes/
│   │   └── form.routes.ts     # Definição de rotas
│   ├── app.ts                 # Configuração Express
│   └── server.ts              # Inicialização do servidor
├── .env                       # Variáveis de ambiente
├── .gitignore                 # Arquivos ignorados pelo Git
├── package.json               # Dependências e scripts
└── tsconfig.json              # Configuração TypeScript
```

## ⚙️ Configuração

### 1. Instalar dependências (caso necessário)

```bash
npm install
```

### 2. Configurar banco de dados

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/formdb?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Executar migração do Prisma

```bash
npm run prisma:migrate
```

Isso irá:
- Criar o banco de dados
- Aplicar o schema (tabela `FormSubmission`)
- Gerar o Prisma Client

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start

# Executar migração do Prisma
npm run prisma:migrate

# Gerar Prisma Client
npm run prisma:generate

# Abrir Prisma Studio (interface visual do banco)
npm run prisma:studio
```

## 📡 Endpoints da API

### Base URL
```
http://localhost:3000
```

### 1. Health Check
```http
GET /
```

**Resposta:**
```json
{
  "message": "Form API - Backend está rodando! ✅",
  "version": "1.0.0",
  "timestamp": "2026-01-13T12:00:00.000Z"
}
```

### 2. Criar Submissão
```http
POST /api/forms/submissions
Content-Type: application/json

{
  "formVersion": "plano-uso-v1",
  "answers": {
    "nome": "João Silva",
    "email": "joao@example.com",
    "plano": "premium"
  }
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-gerado-aqui",
    "formVersion": "plano-uso-v1",
    "payload": {
      "nome": "João Silva",
      "email": "joao@example.com",
      "plano": "premium"
    },
    "createdAt": "2026-01-13T12:00:00.000Z"
  }
}
```

**Erro de Validação (400):**
```json
{
  "success": false,
  "error": "Dados inválidos",
  "details": [
    {
      "path": ["formVersion"],
      "message": "formVersion é obrigatório"
    }
  ]
}
```

### 3. Listar Todas as Submissões
```http
GET /api/forms/submissions
```

**Resposta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "formVersion": "plano-uso-v1",
      "payload": { ... },
      "createdAt": "2026-01-13T12:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "formVersion": "plano-uso-v1",
      "payload": { ... },
      "createdAt": "2026-01-13T11:30:00.000Z"
    }
  ],
  "count": 2
}
```

### 4. Buscar Submissão por ID
```http
GET /api/forms/submissions/:id
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "formVersion": "plano-uso-v1",
    "payload": { ... },
    "createdAt": "2026-01-13T12:00:00.000Z"
  }
}
```

**Não Encontrado (404):**
```json
{
  "success": false,
  "error": "Submissão não encontrada"
}
```

## 🏗️ Arquitetura

O projeto segue **arquitetura em camadas**:

1. **Routes** - Define endpoints HTTP
2. **Controllers** - Recebe requisições, retorna respostas
3. **Services** - Contém lógica de negócio e validações
4. **Repositories** - Acessa o banco de dados via Prisma
5. **DB** - Singleton do PrismaClient

### Fluxo de uma Requisição

```
Request → Route → Controller → Service → Repository → Database
                                   ↓
                              Validation (Zod)
```

## 🗄️ Modelo de Dados

```prisma
model FormSubmission {
  id          String   @id @default(uuid())
  formVersion String
  payload     Json
  createdAt   DateTime @default(now())
}
```

- **id**: UUID único gerado automaticamente
- **formVersion**: Versão/tipo do formulário (ex: "plano-uso-v1")
- **payload**: Objeto JSON com as respostas (flexível)
- **createdAt**: Timestamp de criação

## 🔒 Validação

A API utiliza **Zod** para validação de dados:

```typescript
{
  formVersion: string (obrigatório, mínimo 1 caractere)
  answers: object (obrigatório, qualquer estrutura JSON)
}
```

## 🚀 Próximos Passos (Extensões Futuras)

- [ ] Autenticação JWT
- [ ] Paginação nas listagens
- [ ] Filtros e busca avançada
- [ ] Rate limiting
- [ ] Documentação Swagger/OpenAPI
- [ ] Testes automatizados (Jest)
- [ ] Docker + Docker Compose
- [ ] CI/CD pipeline

## 📝 Licença

ISC
# form-api
