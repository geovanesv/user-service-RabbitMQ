# User Service

Microsserviço NestJS para gerenciamento de usuários com autenticação JWT e comunicação via RabbitMQ.

## Tecnologias

- **Framework**: NestJS (TypeScript)
- **Banco de Dados**: PostgreSQL (TypeORM)
- **Mensageria**: RabbitMQ (amqplib)
- **Autenticação**: JWT + Passport

## Funcionalidades

### Gerenciamento de Usuários
- Criar novo usuário
- Buscar usuário por ID (protegido por JWT)
- Publicação de eventos quando usuário é criado

### Autenticação
- Login com email/senha (JWT)
- Login usando Passport
- Validação de token JWT
- Refresh de token
- Logout
- Perfil do usuário autenticado

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|------------|
| `POST` | `/users` | Criar novo usuário |
| `GET` | `/users/:id` | Buscar usuário por ID |
| `POST` | `/auth/login` | Login com email/senha |
| `POST` | `/auth/login-passport` | Login com Passport |
| `GET` | `/auth/profile` | Perfil do usuário |
| `POST` | `/auth/refresh` | Atualizar token |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/auth/validate-token` | Validar token JWT |

## Esquema do Banco de Dados

**Tabela: users**

| Campo | Tipo | Descrição |
|-------|------|------------|
| id | integer | Chave primária (auto-incremento) |
| nome | varchar(150) | Nome do usuário |
| email | varchar(150) | Email (único) |
| password | varchar(60) | Senha hasheada |
| ativo | boolean | Status ativo (padrão: true) |
| createdAt | timestamp | Data de criação |
| updatedAt | timestamp | Data de atualização |

## RabbitMQ

- **Exchange**: `user_events` (topic exchange)
- **EventoPublicado**: `user.created` - disparado quando um novo usuário é criado

**Payload do Evento**:
```json
{
  "event": "user.created",
  "data": { "userId": 1, "email": "usuario@email.com", "nome": "Usuario" },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Instalação

```bash
npm install
```

## Executando a aplicação

```bash
# Desenvolvimento
npm run start

# Modo watch
npm run start:dev

# Produção
npm run start:prod
```

## Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=senha
DATABASE_NAME=userdb

JWT_SECRET=seu-secret-aqui

RABBITMQ_URL=amqp://localhost:5672
```

## Integração com Order Service

Este serviço publica eventos `user.created` no RabbitMQ para que outros serviços consumam.

**Repositório dependente**:
- [Order Service](https://github.com/geovanesv/order-service) - Consome os eventos de usuário publicados por este serviço
