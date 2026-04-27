# Prompts

## Initial Prompt

Act as a Senior .NET Architect. Scaffold a C# .NET Web API for an Expense Tracker application using Clean Architecture. The API will be consumed by a React frontend.

Please provide the CLI commands to create the solution and generate the core boilerplate code for the following projects:

- ExpenseTracker.Domain: Include Expense, Category, User, and UserExpense entities with corresponding repository interfaces. This layer must have no external dependencies

- ExpenseTracker.Application: Include services for CRUD operations on Expenses, Categories, Users, and UserExpenses with necessary DTOs. Implement JWT authentication with refresh tokens and BCrypt password hashing

- ExpenseTracker.Infrastructure: Implement repository interfaces using raw ADO.NET with Npgsql (no ORM). Provide ConnectionProvider for database access and Schema.sql for database initialization

- ExpenseTracker.Api: Include Controllers for Expenses, Categories, Users, UserExpenses, and Auth. Wire up Dependency Injection, configure JWT Bearer authentication, CORS for React frontend, and centralized exception handling middleware

## Usefull Commands

Docker compose launch with .env local file.

```bash
docker compose -f ./backend/docker-compose.yml -f ./backend/docker-compose.override.yml --env-file ./backend/.env.local up -d 
```

Docker compose launch just DB.

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file ./backend/.env.local up -d postgres 
```
