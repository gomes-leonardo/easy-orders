# 🚀 NestJS E-commerce API

API de backend para gerenciamento de pedidos de e-commerce, desenvolvida com foco em **Clean Architecture**, **DDD** (Domain-Driven Design) e **TDD** (Test-Driven Development).

## 🛠️ Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** TypeScript
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL
- **Container:** Docker & Docker Compose
- **Testes:** Jest

## ⚙️ Arquitetura

O projeto segue princípios de arquitetura limpa para desacoplar a regra de negócio do framework e do banco de dados:

- **Entities:** Regras de negócio puras (ex: validação de quantidade e status do pedido).
- **Services:** Orquestração do fluxo de dados.
- **Repositories:** Abstração da camada de dados (Pattern Repository), permitindo trocar o ORM ou banco de dados sem afetar a regra de negócio.
- **DTOs:** Transferência de dados validados entre as camadas.

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose instalados.

### Passo a Passo

1.  **Clone o repositório e instale as dependências:**

    ```bash
    npm install
    ```

2.  **Suba o Banco de Dados:**
    O projeto utiliza Docker para rodar o PostgreSQL.

    ```bash
    docker-compose up -d
    ```

3.  **Configuração de Ambiente:**
    Crie um arquivo `.env` na raiz baseado no exemplo (se houver) ou configure a URL do banco:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/nomedobanco?schema=public"
    ```

4.  **Execute as Migrations do Prisma:**
    Isso criará as tabelas no banco de dados.

    ```bash
    npx prisma migrate dev
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run start:dev
    ```
    A API estará rodando em `http://localhost:3000`.

## 🧪 Rodando os Testes

O projeto segue uma abordagem de TDD. Para rodar os testes unitários:

```bash
npm run test
```
