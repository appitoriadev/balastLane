# Expense Tracker — Frontend

React 18 frontend for the ExpenseTracker .NET 10 Clean Architecture API.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling (purple design system) |
| Vite | Dev server + bundler |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start your .NET backend
Make sure your backend is running on `http://localhost:5157`.

### 3. Start the dev server
```bash
npm run dev
```

Vite proxies all `/api` requests to `http://localhost:5157`, so no CORS configuration is needed in development.

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── components/
│   ├── charts/        # DonutChart
│   ├── dashboard/     # SummaryCards, CategoryBreakdown
│   ├── expenses/      # ExpenseRow, ExpenseForm, ExpenseModal, DeleteModal
│   ├── layout/        # AppLayout, Sidebar, BottomNav, ProtectedRoute
│   └── ui/            # Button, Input, Select, Badge, Alert, Modal, Skeleton, Icon
├── constants/         # Category colors, default categories
├── contexts/          # AuthContext, ExpensesContext
├── hooks/             # useCategories
├── pages/             # LoginPage, DashboardPage, ExpensesPage, ProfilePage
├── services/          # auth.service, expenses.service, categories.service
├── styles/            # globals.css (Tailwind base)
└── utils/             # api.js (fetch wrapper), formatters.js, cn.js
```

## Routes

| Path | Page | Auth |
|---|---|---|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Protected |
| `/expenses` | All Expenses | Protected |
| `/profile` | Profile | Protected |
| `/` | Redirects to `/dashboard` | Protected |

## API Integration

All API calls are in `src/services/`. The base fetch wrapper lives in `src/utils/api.js`:
- Attaches `Authorization: Bearer <token>` automatically
- On `401` → clears token and redirects to `/login`
- On `204 No Content` → returns `null`

### Auth
- `POST /api/Auth/login` — `{ username, password }` → `{ token, expiresAt }`

### Expenses
- `GET    /api/Expenses`
- `POST   /api/Expenses`         — `{ title, amount, category, date }`
- `PUT    /api/Expenses/{id}`    — `{ title, amount, category, date }`
- `DELETE /api/Expenses/{id}`

### Categories
- `GET /api/Categories` — used to populate the category dropdown

## Building for Production

```bash
npm run build
```

Set `VITE_API_URL` in `.env` to point at your deployed backend.
