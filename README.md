# Easy Orders API 🍔

A production-ready e-commerce backend API built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Test-Driven Development (TDD)** principles.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Docker](#-docker)
- [Roadmap](#-roadmap)

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| Database | PostgreSQL 13 |
| ORM | Prisma 7 |
| Validation | class-validator |
| Documentation | Swagger/OpenAPI |
| Testing | Jest 30 |
| Container | Docker & Docker Compose |

---

## 🏗️ Architecture

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
- **Domain Validation**: Business rules enforced in entities (e.g., quantity must be > 0, price must be positive)
- **Dependency Injection**: NestJS native DI for loose coupling and testability
- **DTOs with Validation**: Type-safe data transfer with class-validator decorators
- **Swagger Documentation**: Auto-generated API docs with examples

---

## 🎯 Getting Started

### Prerequisites

- **Node.js** 22+ (LTS recommended)
- **Docker** & **Docker Compose**
- **npm** or **yarn**

### Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/gomes-leonardo/easy-orders.git
cd easy-orders
```

#### 2️⃣ Install dependencies

```bash
npm install
```

#### 3️⃣ Start the database (Docker)

```bash
docker compose up db -d --wait
```

> **Note**: We only start the `db` service during development. The app runs locally for hot-reload.

#### 4️⃣ Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://easy-orderuser:easy-orderpass@localhost:5432/easy-orderdb"
PORT=3000
```

#### 5️⃣ Run database migrations and seed

```bash
npx prisma migrate dev
```

This will:
- Apply all migrations to your database
- Generate Prisma Client
- Seed the database with initial products (burgers, sides, drinks)

> **Note**: The seed runs automatically after `migrate dev`. To run it manually: `npm run seed`

#### 6️⃣ Start the development server

```bash
npm run start:dev
```

The API will be available at:
- **API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api`

---

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:
- ✅ Complete API endpoint list
- ✅ Request/response examples
- ✅ Try-it-out functionality
- ✅ Schema definitions
- ✅ Validation rules

### Endpoints Overview

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders` | List all orders |
| `GET` | `/orders/:id` | Get order by ID |
| `PATCH` | `/orders/:id` | Update order |
| `DELETE` | `/orders/:id` | Delete order |

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a new product |
| `GET` | `/products` | List all products |
| `GET` | `/products/:id` | Get product by ID |
| `PATCH` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |

### Order Status Flow

```
OPEN → PENDING → PAID
         ↓
     CANCELLED
```

### Product Categories

- `BURGER` - Burgers and sandwiches
- `SIDEDISH` - Sides and accompaniments
- `DRINK` - Beverages
- `DESSERT` - Desserts

---

## 📁 Project Structure

```
src/
├── orders/
│   ├── dto/                    # Data Transfer Objects
│   │   ├── create.order.dto.ts
│   │   └── update.order.dto.ts
│   ├── entities/               # Domain entities with business rules
│   │   └── orders.entity.ts
│   ├── enums/                  # Domain enumerations
│   │   └── order-status.enum.ts
│   ├── repositories/           # Repository pattern
│   │   ├── orders.repository.ts (interface)
│   │   └── prisma-orders.repository.ts (implementation)
│   ├── orders.controller.ts    # HTTP layer
│   ├── orders.service.ts       # Business logic / Use cases
│   └── orders.module.ts        # Module configuration
│
├── product/
│   ├── dto/
│   │   ├── create.product.dto.ts
│   │   └── update.product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── enums/
│   │   └── product-category.enum.ts
│   ├── repositories/
│   │   ├── products-repository.ts (interface)
│   │   └── prisma-products.repository.ts (implementation)
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── product.module.ts
│
├── prisma.service.ts           # Database connection
├── prisma.module.ts            # Prisma module
├── app.module.ts               # Root module
└── main.ts                     # Application bootstrap
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev       # Start app in watch mode (auto-restart on changes)
npm run start:debug     # Start app in debug mode

# Production
npm run build           # Build the project
npm run start:prod      # Run built app (production mode)

# Database
npm run services:up     # Start Docker services (database)
npm run services:down   # Stop Docker services
npm run services:stop   # Stop without removing containers

# Testing
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage report
npm run test:e2e        # Run end-to-end tests

# Code Quality
npm run lint            # Run ESLint (auto-fix)
npm run format          # Format code with Prettier
```

---

## 🧪 Testing

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

- **Entity tests**: Validate domain business rules (e.g., quantity > 0, price > 0)
- **Service tests**: Validate use case orchestration with mocked repositories
- **Integration tests**: Validate API endpoints (coming soon)

Example test output:
```
 PASS  src/orders/entities/orders.entity.spec.ts
 PASS  src/orders/orders.service.spec.ts
 PASS  src/product/entities/product.entity.spec.ts
 PASS  src/product/product.service.spec.ts

Test Suites: 4 passed, 4 total
Tests:       24 passed, 24 total
```

---

## 🐳 Docker

### Development Mode

For local development, **only run the database in Docker**:

```bash
docker compose up db -d --wait
```

Then run the app locally with hot-reload:

```bash
npm run start:dev
```

### Production Mode

To run the entire stack (app + database) in Docker:

```bash
docker compose up --build -d
```

The Dockerfile uses **multi-stage builds** for optimized production images:
- Stage 1 (builder): Install deps, run tests, build app
- Stage 2 (runner): Copy built files, install production deps only

Access the app at `http://localhost:5001` (mapped from container port 3000).

### Useful Docker Commands

```bash
# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Rebuild and restart
docker compose up --build -d

# Remove volumes (⚠️ deletes database data)
docker compose down -v
```

---

## 🗺️ Roadmap

- [x] Order management (CRUD)
- [x] Product catalog (CRUD)
- [x] Clean Architecture implementation
- [x] Repository pattern with Prisma
- [x] Unit tests with Jest
- [x] API documentation (Swagger)
- [x] Docker setup
- [ ] Customer module
- [ ] Authentication & Authorization (JWT)
- [ ] Payment integration
- [ ] Integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Rate limiting & security headers
- [ ] Logging & monitoring

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT

---

## 👨‍💻 Author

Built with Clean Architecture principles by [Leonardo Rodrigues](https://github.com/gomes-leonardo)

---

## 📞 Support

If you encounter any issues:

1. Check the [Swagger documentation](http://localhost:3000/api)
2. Review the [Project Structure](#-project-structure)
3. Open an issue on GitHub

---

**Made with ❤️ and ☕**
