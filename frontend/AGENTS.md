# Expense Tracker Frontend — Agent Specification

React 18 frontend for the ExpenseTracker .NET 10 Clean Architecture API. This document is for AI agents to understand the codebase structure, constraints, and patterns.

## Architecture

**Component-Driven Architecture with Context-Based State Management**

```
src/
├── contexts/           → React Context for global state (AuthContext, ExpensesContext)
├── services/           → API service layer (auth.service, expenses.service, categories.service)
├── utils/              → Shared utilities (api.js fetch wrapper, formatters, cn class merger)
├── constants/          → Static data (category colors, default categories)
├── hooks/              → Custom hooks (useCategories)
├── components/
│   ├── layout/        → App shell (AppLayout, Sidebar, BottomNav, ProtectedRoute)
│   ├── ui/             → Reusable UI components (Button, Input, Modal, Badge, etc.)
│   ├── expenses/      → Expense-specific components (ExpenseRow, ExpenseForm, ExpenseModal)
│   ├── dashboard/     → Dashboard components (SummaryCards, CategoryBreakdown)
│   └── charts/        → Data visualization (DonutChart)
└── pages/              → Route-level components (LoginPage, DashboardPage, ExpensesPage, ProfilePage)
```

## Tech Stack

- **React 18.3.1** — UI framework with hooks
- **React Router v6.27.0** — Client-side routing
- **Vite 5.4.11** — Dev server + bundler with HMR
- **Tailwind CSS 3.4.15** — Utility-first styling with purple design system
- **@tailwindcss/forms** — Form styling plugin
- No state management library (Redux, Zustand) — React Context only
- No form validation library — inline validation
- No date library — custom formatters

## State Management

**Context-Based Pattern:**

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Manages user authentication state
   - Stores JWT token in `localStorage` as `et_token`
   - Provides `login()`, `logout()`, `user`, `isLoading`
   - No `/me` endpoint — authenticates by token presence

2. **ExpensesContext** (`src/contexts/ExpensesContext.jsx`)
   - Manages expenses state with optimistic updates
   - Provides `fetchExpenses()`, `createExpense()`, `updateExpense()`, `deleteExpense()`
   - Auto-sorts expenses by date DESC after mutations
   - Wraps all routes with `<ExpensesProvider>`

## API Integration

**Base API Client** (`src/utils/api.js`)

- Wrapper around `fetch` with automatic JWT attachment
- Reads token from `localStorage.getItem('et_token')`
- On `401` → clears token and redirects to `/login`
- On `204 No Content` → returns `null`
- On error → throws with `message` from response body

**Environment Configuration:**
- Development: Uses Vite proxy (`vite.config.js`) → `/api` proxied to `http://localhost:5157`
- Production: Set `VITE_API_URL` environment variable to deployed backend URL

**Service Layer Pattern:**

All services use the `api` wrapper from `utils/api.js`:

- `auth.service.js` — login, logout, token management
- `expenses.service.js` — CRUD operations for expenses
- `categories.service.js` — CRUD operations for categories

## Routing Structure

**React Router v6** (`src/App.jsx`)

| Path | Page | Auth Required |
|---|---|---|
| `/login` | LoginPage | Public |
| `/` | Redirects to `/dashboard` | Protected |
| `/dashboard` | DashboardPage | Protected |
| `/expenses` | ExpensesPage | Protected |
| `/profile` | ProfilePage | Protected |
| `*` | Redirects to `/dashboard` | Protected |

**ProtectedRoute** (`src/components/layout/ProtectedRoute.jsx`)
- Wraps all protected routes
- Shows loading spinner while auth state is being determined
- Redirects to `/login` if not authenticated

## Component Patterns

**Reusable UI Components** (`src/components/ui/`)

- **Button** — Primary, secondary, danger variants with loading states
- **Input** — Text, number, date inputs with error states
- **Select** — Dropdown with options array
- **Modal** — Overlay with header, body, footer slots
- **Alert** — Success, error, warning, info variants
- **Badge** — Category badges with color mapping
- **Icon** — SVG icon wrapper
- **Skeleton** — Loading placeholders

**Layout Components** (`src/components/layout/`)

- **AppLayout** — Main shell with Sidebar + BottomNav + content area
- **Sidebar** — Desktop navigation
- **BottomNav** — Mobile navigation
- **ProtectedRoute** — Auth guard

**Form Patterns**

- Use controlled components with `useState`
- Inline validation with error messages
- Date handling via custom formatters (`toDateInputValue`, `toApiDate`)
- Currency formatting via `formatCurrency`

## Styling System

**Tailwind CSS Configuration** (`tailwind.config.js`)

- **Primary colors**: Purple palette (50-900)
- **Accent colors**: Purple variants
- **Semantic colors**: success, error, warning, info with light/dark variants
- **Border radius**: sm, DEFAULT, md, lg, xl, 2xl, full
- **Box shadows**: sm, DEFAULT, md, lg, xl, primary
- **Font**: System sans-serif, Fira Code for mono

**Category Colors** (`src/constants/index.js`)

- Hardcoded hex values for badges and charts
- Food, Transport, Entertainment, Housing, Health, Shopping, Other
- Fallback to `DEFAULT_CATEGORIES` when API is unavailable

## Utilities

**cn()** (`src/utils/cn.js`)
- Lightweight class name merger (alternative to clsx)
- Filters out falsy values

**formatters.js** (`src/utils/formatters.js`)
- `formatCurrency(amount, symbol)` — Currency formatting
- `formatDate(dateStr)` — Display date formatting
- `toDateInputValue(dateStr)` — ISO to `YYYY-MM-DD` for inputs
- `toApiDate(dateInputValue)` — Input to ISO for API
- `monthRange(offset)` — Start of month for date ranges

## API Endpoints

**Auth** (`auth.service.js`)

| Method | Endpoint | Request | Response |
|---|---|---|---|
| POST | `/api/Auth/login` | `{ username, password }` | `{ token, expiresAt }` |

**Expenses** (`expenses.service.js`)

| Method | Endpoint | Request | Response |
|---|---|---|---|
| GET | `/api/Expenses` | — | `ExpenseResponseDto[]` |
| GET | `/api/Expenses/{id}` | — | `ExpenseResponseDto` |
| POST | `/api/Expenses` | `{ title, amount, categoryId, date }` | `ExpenseResponseDto` |
| PUT | `/api/Expenses/{id}` | `{ title, amount, categoryId, date }` | `ExpenseResponseDto` |
| DELETE | `/api/Expenses/{id}` | — | `204 No Content` |

**Categories** (`categories.service.js`)

| Method | Endpoint | Request | Response |
|---|---|---|---|
| GET | `/api/Categories` | — | `CategoryDto[]` |
| GET | `/api/Categories/{id}` | — | `CategoryDto` |
| POST | `/api/Categories` | `{ categoryName }` | `CategoryDto` |
| PUT | `/api/Categories/{id}` | `{ categoryName }` | `CategoryDto` |
| DELETE | `/api/Categories/{id}` | — | `204 No Content` |

## Data Models

**ExpenseResponseDto** (camelCase)
```javascript
{
  id: number,
  title: string,
  amount: number,
  categoryId: number,
  categoryName: string,
  date: string (ISO)
}
```

**CategoryDto** (camelCase)
```javascript
{
  id: number,
  categoryName: string,
  createdAt: string (ISO)
}
```

## Key Constraints

1. **No external state management** — React Context only (AuthContext, ExpensesContext)
2. **No form validation library** — inline validation with error states
3. **No date library** — custom formatters in `utils/formatters.js`
4. **No class name library** — custom `cn()` utility
5. **JWT stored in localStorage** — key: `et_token`
6. **Vite proxy in development** — `/api` → `http://localhost:5157`
7. **Optimistic updates** — ExpensesContext updates state before API call
8. **Auto-sorting** — Expenses sorted by date DESC after mutations
9. **Protected routes** — All routes except `/login` require authentication
10. **Responsive design** — Sidebar (desktop) + BottomNav (mobile)

## Validation Rules

**Expense fields:**
- `title`: Required, string
- `amount`: Required, number > 0
- `categoryId`: Required, number
- `date`: Required, ISO string or `YYYY-MM-DD`

**Auth fields:**
- `username`: Required, string
- `password`: Required, string

## Development Workflow

1. Start backend: `cd backend && dotnet run` (or `docker-compose up`)
2. Start frontend: `npm run dev`
3. Access at `http://localhost:5173`
4. Vite proxies `/api` requests to backend automatically

## File Paths

```
src/
├── App.jsx                              # Route configuration
├── main.jsx                             # React entry point
├── constants/index.js                   # Category colors, defaults
├── contexts/
│   ├── AuthContext.jsx                  # Authentication state
│   └── ExpensesContext.jsx              # Expenses state
├── hooks/
│   └── useCategories.js                 # Categories hook
├── pages/
│   ├── LoginPage.jsx                    # Login form
│   ├── DashboardPage.jsx                # Dashboard with charts
│   ├── ExpensesPage.jsx                 # Expense list with CRUD
│   └── ProfilePage.jsx                  # User profile
├── services/
│   ├── auth.service.js                 # Auth API calls
│   ├── expenses.service.js              # Expenses API calls
│   └── categories.service.js            # Categories API calls
├── utils/
│   ├── api.js                           # Base fetch wrapper
│   ├── formatters.js                    # Date/currency formatters
│   └── cn.js                            # Class name merger
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx                # Main layout shell
│   │   ├── Sidebar.jsx                  # Desktop nav
│   │   ├── BottomNav.jsx                # Mobile nav
│   │   └── ProtectedRoute.jsx           # Auth guard
│   ├── ui/
│   │   ├── Button.jsx                   # Button component
│   │   ├── Input.jsx                    # Input component
│   │   ├── Select.jsx                   # Select component
│   │   ├── Modal.jsx                    # Modal component
│   │   ├── Alert.jsx                    # Alert component
│   │   ├── Badge.jsx                    # Badge component
│   │   ├── Icon.jsx                     # Icon component
│   │   └── Skeleton.jsx                 # Loading placeholder
│   ├── expenses/
│   │   ├── ExpenseRow.jsx               # Expense list item
│   │   ├── ExpenseForm.jsx              # Expense form
│   │   ├── ExpenseModal.jsx             # Expense modal
│   │   └── DeleteModal.jsx              # Delete confirmation
│   ├── dashboard/
│   │   ├── SummaryCards.jsx             # Summary stats
│   │   └── CategoryBreakdown.jsx        # Category breakdown
│   └── charts/
│       └── DonutChart.jsx               # Donut chart component
```
