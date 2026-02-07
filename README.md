# Easy Orders API

A production-ready e-commerce backend API built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Test-Driven Development (TDD)** principles.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| Database | PostgreSQL 13 |
| ORM | Prisma 7 |
| Testing | Jest 30 |
| Container | Docker & Docker Compose |

## Architecture

This project implements **Clean Architecture** to ensure separation of concerns and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                    Controllers (HTTP)                       │
│              Handle requests and responses                  │
├─────────────────────────────────────────────────────────────┤
│                    Services (Use Cases)                     │
│              Orchestrate business logic                     │
├─────────────────────────────────────────────────────────────┤
│                    Entities (Domain)                        │
│          Pure business rules, no dependencies               │
├─────────────────────────────────────────────────────────────┤
│                  Repositories (Data Access)                 │
│      Abstract interface + Prisma implementation             │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **Repository Pattern**: Abstract interface allows swapping Prisma for any other ORM without changing business logic
- **Domain Validation**: Business rules enforced in entities (e.g., quantity must be > 0)
- **Dependency Injection**: NestJS native DI for loose coupling and testability
- **DTOs with Validation**: Type-safe data transfer with class-validator decorators

## Domain Design (Event Storming)

The system was designed using **Event Storming** methodology to map the complete customer journey:

![Event Storming Diagram](./docs/event-storming.png)

### Flow Overview

1. **Customer Identification** → Customer enters the platform and identifies themselves
2. **Registration** → New customers register with CPF, name, and email
3. **Order Assembly** → Customer selects items:
   - Snacks (Lanches)
   - Sides (Acompanhamentos)
   - Drinks (Bebidas)
   - Desserts (Sobremesas)
4. **Validation** → System validates order before confirmation
5. **Confirmation** → Customer confirms and order is created

### Legend

| Color | Element | Description |
|-------|---------|-------------|
| 🟨 Yellow | **Event** | Something that happened in the domain |
| 🟦 Blue | **Command** | Action triggered by user or system |
| 🟪 Purple | **Policy** | Business rule that reacts to events |
| 🟩 Green | **Actor** | User or external system |
| 📘 Blue (light) | **Model/Screen** | UI representation |

## Project Structure

```
src/
├── orders/
│   ├── dto/                    # Data Transfer Objects
│   ├── entities/               # Domain entities with business rules
│   ├── enums/                  # Domain enumerations
│   ├── repositories/           # Repository interface + implementation
│   ├── orders.controller.ts    # HTTP layer
│   ├── orders.service.ts       # Business logic
│   └── orders.module.ts        # Module configuration
├── prisma.service.ts           # Database connection
└── main.ts                     # Application bootstrap
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders` | List all orders |
| `GET` | `/orders/:id` | Get order by ID |
| `PATCH` | `/orders/:id` | Update order |
| `DELETE` | `/orders/:id` | Delete order |

### Order Status Flow

```
OPEN → PENDING → PAID
         ↓
     CANCELLED
```

## Getting Started

### Prerequisites

- Node.js 22+ (LTS)
- Docker & Docker Compose

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/gomes-leonardo/easy-orders.git
   cd easy-orders
   npm install
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## Testing

The project follows **TDD** practices with comprehensive test coverage:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

### Test Structure

- **Entity tests**: Validate domain business rules
- **Service tests**: Validate use case orchestration with mocked repositories
- **Integration tests**: Validate API endpoints (coming soon)

## Docker

### Development

```bash
docker-compose up -d
```

### Production

The Dockerfile uses multi-stage builds for optimized production images:

```bash
docker build -t easy-orders .
docker run -p 3000:3000 easy-orders
```

## Roadmap

- [x] Order management (CRUD)
- [x] Clean Architecture implementation
- [x] Repository pattern with Prisma
- [x] Unit tests with Jest
- [ ] Customer module
- [ ] Product catalog (Snacks, Sides, Drinks, Desserts)
- [ ] Authentication & Authorization
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] CI/CD pipeline

## License

MIT

---

Built with Clean Architecture principles by [Leonardo Rodrigues](https://github.com/gomes-leonardo)
