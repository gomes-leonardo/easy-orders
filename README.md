# Easy Orders API 🍔

A production-ready e-commerce backend API built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Test-Driven Development (TDD)** principles.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Authentication](#-authentication)
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
| Authentication | JWT + Passport + httpOnly Cookies |
| Validation | class-validator |
| Documentation | Swagger/OpenAPI |
| Testing | Jest 30 |
| Package Manager | pnpm |
| Container | Docker & Docker Compose |
| CI/CD | GitHub Actions |

---

## 🏗️ Architecture

This project implements **Clean Architecture** with **DDD** to ensure separation of concerns and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│               Presentation (Controllers, Guards)            │
│         Handle requests, auth guards, role decorators       │
├─────────────────────────────────────────────────────────────┤
│               Application (Services, DTOs)                  │
│         Orchestrate business logic, ownership validation    │
├─────────────────────────────────────────────────────────────┤
│                    Domain (Entities)                         │
│          Pure business rules, no dependencies               │
├─────────────────────────────────────────────────────────────┤
│              Infrastructure (Repositories, Strategies)       │
│      Prisma implementation, JWT strategy, guards            │
└─────────────────────────────────────────────────────────────┘
```

### Domain Design (Event Storming)

The system was designed using **Event Storming** methodology to map the complete customer journey:

![Event Storming](./docs/event-storming.png)

> 🔗 [View full board on Miro](https://miro.com/app/board/uXjVGG474i0=/?share_link_id=195510804687)

### Key Architectural Decisions

- **Repository Pattern**: Abstract interface allows swapping Prisma for any other ORM without changing business logic
- **Domain Validation**: Business rules enforced in entities via custom `DomainError` class, caught by a global exception filter and returned as `400 Bad Request`
- **Order Items**: Orders contain multiple items, each with a product reference, quantity, and price fetched from the product catalog at creation time
- **Order Ownership**: Users can only access, update, and delete their own orders. Admin can list all orders.
- **Soft Delete**: Products use `isDeleted` flag instead of hard delete, preserving referential integrity with existing orders
- **Cookie-based Auth**: JWT tokens stored in httpOnly cookies for XSS protection (no Bearer tokens exposed to JavaScript)
- **Role-based Access Control**: Custom `@Roles()` decorator + `RolesGuard` using NestJS Reflector
- **Auto-login on Registration**: Users are automatically authenticated after creating an account
- **Dependency Injection**: NestJS native DI for loose coupling and testability
- **Cross-module communication**: `OrdersService` injects `ProductsRepository` to fetch prices, keeping the domain layer clean
- **DTOs with Validation**: Type-safe data transfer with class-validator decorators
- **Swagger Documentation**: Auto-generated API docs with cookie auth support and request examples

---

## 🎯 Getting Started

### Prerequisites

- **Node.js** 22+ (LTS recommended)
- **pnpm** 10+
- **Docker** & **Docker Compose**

### Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/gomes-leonardo/easy-orders.git
cd easy-orders
```

#### 2️⃣ Install dependencies

```bash
pnpm install
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
SECRET_KEY="your-jwt-secret-key"
PORT=3000
```

#### 5️⃣ Run database migrations and seed

```bash
npx prisma migrate dev
```

This will:
- Apply all migrations to your database
- Generate Prisma Client
- Seed the database with initial products and an admin user (`admin@easyorders.com` / `Admin@123`)

> **Note**: The seed runs automatically after `migrate dev`. To run it manually: `pnpm run seed`

#### 6️⃣ Start the development server

```bash
pnpm run start:dev
```

The API will be available at:
- **API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api`

---

## 🔐 Authentication

The API uses **JWT tokens stored in httpOnly cookies** for authentication. This approach prevents XSS attacks from accessing the token.

### Auth Flow

1. **Register** (`POST /user`) — Creates user and automatically sets auth cookie
2. **Login** (`POST /auth/login`) — Authenticates via email/password or CPF, sets auth cookie
3. **Access protected routes** — Cookie is sent automatically with every request
4. **Logout** (`POST /auth/logout`) — Clears the auth cookie

### Login Methods

| Method | Request Body |
|--------|-------------|
| Email + Password | `{ "email": "user@email.com", "password": "Pass@123" }` |
| CPF | `{ "cpf": "305.000.480-02" }` |

### Route Protection

| Protection | Description | Example Routes |
|-----------|-------------|----------------|
| **Public** | No auth required | `GET /products`, `POST /user`, `POST /auth/login` |
| **JWT** | Requires valid auth cookie | `POST /orders`, `GET /orders/:id`, `PATCH /orders/:id` |
| **JWT + ADMIN** | Requires admin role | `POST /products`, `GET /orders`, `GET /user`, `POST /user/admin` |

### Ownership Validation

Regular users can only access their own orders. Attempting to access another user's order returns `403 Forbidden`.

---

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:
- ✅ Complete API endpoint list
- ✅ Cookie-based authentication support
- ✅ Request/response examples
- ✅ Try-it-out functionality
- ✅ Schema definitions
- ✅ Validation rules

### Endpoints Overview

#### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | Public | Login with email/password or CPF |
| `POST` | `/auth/logout` | Public | Logout (clear cookie) |

#### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/user` | Public | Register new user (auto-login) |
| `GET` | `/user` | JWT | List all users |
| `POST` | `/user/admin` | JWT + ADMIN | Create admin user |

#### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/orders` | JWT | Create a new order |
| `GET` | `/orders` | JWT + ADMIN | List all orders |
| `GET` | `/orders/:id` | JWT (owner) | Get order by ID |
| `PATCH` | `/orders/:id` | JWT (owner) | Update order |
| `DELETE` | `/orders/:id` | JWT (owner) | Delete order |

#### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/products` | Public | List all products |
| `POST` | `/products` | JWT + ADMIN | Create a new product |
| `PATCH` | `/products/:id` | JWT + ADMIN | Update product |
| `DELETE` | `/products/:id` | JWT + ADMIN | Delete product |

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
├── common/
│   ├── errors/
│   │   └── domain.error.ts              # Custom domain error class
│   └── filters/
│       ├── domain-error.filter.ts       # Global filter (DomainError → 400)
│       └── http-exception.filter.ts     # Global filter (standardized HTTP errors)
│
├── modules/
│   ├── auth/
│   │   ├── application/
│   │   │   ├── auth.service.ts          # Login, logout, token generation
│   │   │   └── dto/                     # AuthRequestDTO, AuthResponseDTO
│   │   ├── infra/
│   │   │   ├── decorators/roles.decorator.ts   # @Roles() decorator
│   │   │   ├── guards/roles.guard.ts           # Role-based access guard
│   │   │   ├── interfaces/                     # AuthenticatedRequest
│   │   │   └── strategies/strategy.ts          # JWT cookie strategy
│   │   ├── presentation/
│   │   │   └── auth.controller.ts       # Login/logout endpoints
│   │   └── auth.module.ts
│   │
│   ├── orders/
│   │   ├── application/
│   │   │   └── orders.service.ts        # CRUD + ownership validation
│   │   ├── domain/
│   │   │   ├── entities/order.entity.ts # Order with items[], userId, total
│   │   │   └── repositories/           # Abstract OrderRepository
│   │   ├── infra/
│   │   │   └── repositories/           # Prisma implementation
│   │   └── presentation/
│   │       ├── orders.controller.ts     # JWT-protected endpoints
│   │       └── dto/                     # CreateOrderDTO, UpdateOrderDTO
│   │
│   ├── product/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infra/
│   │   └── presentation/               # ADMIN-protected CRUD
│   │
│   ├── user/
│   │   ├── application/
│   │   │   └── user.service.ts          # Create user/admin, role protection
│   │   ├── domain/
│   │   │   ├── entities/user.entity.ts  # User with password validation
│   │   │   └── enums/user-role.enum.ts  # GUEST, CUSTOMER, ADMIN
│   │   ├── infra/
│   │   └── presentation/
│   │       └── user.controller.ts       # Auto-login on registration
│   │
│   └── hash/
│       └── application/hash.service.ts  # bcryptjs wrapper
│
├── prisma.service.ts                    # Database connection (PrismaPg adapter)
├── prisma.module.ts                     # Prisma module
├── app.module.ts                        # Root module
└── main.ts                              # Bootstrap + global pipes, filters, cookies
```

---

## 🛠️ Available Scripts

```bash
# Development
pnpm run start:dev       # Start app in watch mode (auto-restart on changes)
pnpm run start:debug     # Start app in debug mode

# Production
pnpm run build           # Build the project
pnpm run start:prod      # Run built app (production mode)

# Database
pnpm run services:up     # Start Docker services (database)
pnpm run services:down   # Stop Docker services
pnpm run services:stop   # Stop without removing containers

# Testing
pnpm test                # Run unit tests
pnpm run test:watch      # Run tests in watch mode
pnpm run test:cov        # Run tests with coverage report
pnpm run test:e2e        # Run end-to-end tests

# Code Quality
pnpm run lint            # Run ESLint (auto-fix)
pnpm run format          # Format code with Prettier
```

---

## 🧪 Testing

The project follows **TDD** practices with comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run test:cov

# Run in watch mode
pnpm run test:watch
```

### Test Structure

- **Entity tests**: Validate domain business rules (e.g., quantity > 0, price > 0, password format)
- **Service tests**: Validate use case orchestration with mocked repositories (including ownership, role injection prevention)
- **Controller tests**: Validate HTTP layer, auth guards, cookie setting, and response DTOs

Example test output:
```
 PASS  src/modules/user/presentation/user.controller.spec.ts
 PASS  src/modules/orders/presentation/orders.controller.spec.ts
 PASS  src/modules/auth/presentation/auth.controller.spec.ts
 PASS  src/modules/product/presentation/product.controller.spec.ts
 PASS  src/modules/user/application/user.service.spec.ts
 PASS  src/modules/orders/application/orders.service.spec.ts
 PASS  src/modules/auth/application/auth.service.spec.ts
 PASS  src/modules/hash/application/hash.service.spec.ts
 PASS  src/modules/user/domain/entities/user.entity.spec.ts
 PASS  src/modules/orders/domain/entities/order.entity.spec.ts
 PASS  src/modules/product/domain/entities/product.entity.spec.ts

Test Suites: 12 passed, 12 total
Tests:       67 passed, 67 total
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
pnpm run start:dev
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

## 🛡️ Error Handling

The project uses a **layered error strategy** that keeps the domain clean:

| Layer | Error Type | HTTP Status |
|-------|-----------|-------------|
| **Domain (Entity)** | `DomainError` | `400 Bad Request` |
| **Service (Use Case)** | `NotFoundException` | `404 Not Found` |
| **Service (Use Case)** | `ForbiddenException` | `403 Forbidden` |
| **Service (Use Case)** | `UnauthorizedException` | `401 Unauthorized` |
| **Controller (DTO)** | `ValidationPipe` | `400 Bad Request` |
| **Unexpected** | `Error` | `500 Internal Server Error` |

All HTTP errors are standardized by `HttpExceptionFilter`:

```json
{
  "success": false,
  "statusCode": 403,
  "timeStamp": "2026-03-09T19:00:00.000Z",
  "message": "You can only view your own orders."
}
```

---

## 🗺️ Roadmap

- [x] Order management (CRUD with items)
- [x] Product catalog (CRUD with soft delete)
- [x] Order ↔ Product relation (prices fetched from catalog)
- [x] Clean Architecture + DDD implementation
- [x] Repository pattern with Prisma
- [x] Domain error handling (DomainError + Exception Filter)
- [x] Unit tests with Jest (67 tests, 12 suites)
- [x] API documentation (Swagger with cookie auth)
- [x] Docker setup
- [x] CI/CD pipeline (GitHub Actions with pnpm)
- [x] Database seed (products + admin user)
- [x] User module (registration, roles: GUEST/CUSTOMER/ADMIN)
- [x] Authentication (JWT httpOnly cookies, login via email or CPF)
- [x] Authorization (role-based guards, order ownership)
- [x] Auto-login on user registration
- [ ] Payment integration
- [ ] Integration tests
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
