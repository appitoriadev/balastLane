# Expense Tracker

A full-stack expense tracking application built as a technical interview demonstration. This project showcases Clean Architecture principles, modern .NET development practices, and comprehensive test coverage.

## Architecture

### Backend (.NET 10 Web API)
Built with Clean Architecture across four layers:

- **Domain** - Core entities (Expense, Category, User, UserExpense) and repository interfaces with zero external dependencies
- **Application** - Business logic services, DTOs, and authentication (JWT with refresh tokens, BCrypt)
- **Infrastructure** - Data access layer using raw ADO.NET + Npgsql (no ORM), PostgreSQL integration
- **API** - RESTful controllers with JWT Bearer authentication, CORS, Swagger, and centralized exception handling

### Frontend (React)
React application consuming the Web API (see `frontend/` directory)

## Key Features

- Multi-user expense tracking with user-expense relationships
- JWT authentication with refresh token rotation
- Category-based expense organization
- PostgreSQL database with manual schema management
- Comprehensive test suite (unit + integration tests with Testcontainers)
- Docker support for containerized deployment

## Tech Stack

**Backend:**
- .NET 10
- PostgreSQL with Npgsql driver
- Raw ADO.NET (no ORM)
- JWT Bearer Authentication
- BCrypt password hashing
- xUnit, Moq, FluentAssertions, Testcontainers.PostgreSql

**Frontend:**
- React
- (See `frontend/README.md` for details)

## Getting Started

### Prerequisites
- .NET 10 SDK
- PostgreSQL
- Docker (optional, for containerized setup)

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory
3. Configure connection string in `appsettings.json`
4. Run the database schema from `backend/Data/Schema.sql`
5. Build and run:

```bash
cd backend
dotnet build ExpenseTracker.sln
dotnet run --project ExpenseTracker.Api/ExpenseTracker.Api.csproj
```

API will be available at `https://localhost:<port>/swagger`

### Docker Setup

Launch full stack with Docker Compose:

```bash
docker compose -f ./backend/docker-compose.yml -f ./backend/docker-compose.override.yml --env-file ./backend/.env.local up -d
```

Launch only the database:

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file ./backend/.env.local up -d postgres
```

## Testing

Run the comprehensive test suite:

```bash
# All tests
dotnet test ExpenseTracker.sln

# Unit tests only
dotnet test --filter "FullyQualifiedName~Unit"

# Integration tests only
dotnet test --filter "FullyQualifiedName~Integration"

# With code coverage
dotnet test /p:CollectCoverageMetrics=true
```

**Coverage Goals:**
- Domain (Entities): 100%
- Application (Services): 80%+
- Infrastructure (Repositories): 85%+
- API (Controllers): 70%+

## Project Structure

```
backend/
├── ExpenseTracker.Domain/          # Core entities and interfaces
├── ExpenseTracker.Application/     # Business logic and DTOs
├── ExpenseTracker.Infrastructure/  # Data access (ADO.NET + PostgreSQL)
├── ExpenseTracker.Api/             # Web API controllers and middleware
└── ExpenseTracker.Tests/          # Comprehensive test suite

frontend/                           # React application
Docs/                              # Documentation (PLAN.md, Prompt.md)
```

## Documentation

- `Docs/PLAN.md` - Detailed architecture and implementation plan
- `Docs/Prompt.md` - Initial project requirements and commands

## License

See LICENSE file for details.
