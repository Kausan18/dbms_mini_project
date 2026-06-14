# BMS — Team Guide: What's Done & How to Proceed

> **Bank Management System** | For Members 2, 3, and 4

---

## What Has Been Completed (Member 1 — Backend Lead)

The entire backend is built and tested. Your frontend modules can be developed in parallel right now — all APIs are ready and waiting.

### Infrastructure
- PostgreSQL database live on Supabase with 9 tables, all constraints defined
- `lib/supabase.ts` — Supabase client ready to import
- `lib/response.ts` — `successResponse()` and `errorResponse()` helpers
- `types/index.ts` — TypeScript types for every table

### Service Layer (business logic)
- `services/customer.service.ts`
- `services/account.service.ts`
- `services/transaction.service.ts`
- `services/loan.service.ts`
- `services/audit.service.ts`

### API Endpoints — All Tested ✅

| Method | Endpoint | Status |
|--------|----------|--------|
| POST | `/api/admin/customers` | ✅ |
| GET | `/api/admin/customers` | ✅ |
| PUT | `/api/admin/customers/:id` | ✅ |
| DELETE | `/api/admin/customers/:id` | ✅ |
| GET | `/api/admin/accounts` | ✅ |
| GET | `/api/admin/transactions` | ✅ |
| POST | `/api/accounts` | ✅ |
| GET | `/api/accounts/:accountNo` | ✅ |
| GET | `/api/accounts/:accountNo/transactions` | ✅ |
| POST | `/api/transactions/deposit` | ✅ |
| POST | `/api/transactions/withdraw` | ✅ |
| POST | `/api/transactions/transfer` | ✅ |
| POST | `/api/loans` | ✅ |
| GET | `/api/loans/pending` | ✅ |
| PUT | `/api/loans/:loanId/approve` | ✅ |
| PUT | `/api/loans/:loanId/reject` | ✅ |
| GET | `/api/customers/:customerId` | ✅ |
| GET | `/api/customers/:customerId/accounts` | ✅ |
| GET | `/api/customers/:customerId/loans` | ✅ |
| GET | `/api/manager/loans` | ✅ |
| GET | `/api/manager/loans/approved` | ✅ |
| GET | `/api/manager/loans/rejected` | ✅ |
| GET | `/api/auditlogs` | ✅ |

### What Member 1 Will Add at the End
Authentication is intentionally deferred. Once all frontend modules are complete, Member 1 will add:
- `POST /api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
- JWT middleware to protect all routes
- Supabase Auth integration
- Row Level Security policies on the database

**Until then: pass `customer_id`, `admin_id`, `manager_id` directly in request bodies. Hardcode the UUIDs from Supabase Table Editor while developing.**

---

## Ground Rules for Everyone

**Base URL (local dev)**
```
http://localhost:3000
```

**Every request needs this header**
```
Content-Type: application/json
```

**Every response follows this shape**
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "error message here" }
```

**Always check `response.data.success` before using the data in your components.**

**Git workflow**
- Pull from `develop` before starting work each day
- Work only on your own feature branch
- Raise a PR to `develop` when a page is complete
- Never push directly to `main`

---

---

# Member 2 — Customer Module

**Branch:** `feature/customer-module`  
**Pages to build:** `/login` `/signup` `/dashboard` `/accounts` `/transactions` `/loans`

---

## Step-by-Step Guide

### Step 1 — Set up shared components first

Before building any page, import the shared UI components from Member 4's branch once they are available:
- `Navbar`, `Sidebar`, `StatCard`, `DataTable`, `FormDialog`, `ConfirmDialog`, `Badge`, `LoadingSpinner`

If Member 4 hasn't finished them yet, build placeholder versions and replace them later.

---

### Step 2 — Login & Signup pages

These are UI-only for now. Auth will be wired up by Member 1 at the end.

Build the forms with full validation (required fields, email format, password length). On submit, show a success message or mock a redirect to `/dashboard`. You will replace the submit handler with the real auth API call later.

```
/login
  └── Email + Password fields
  └── Submit → (mock redirect to /dashboard for now)

/signup
  └── Name, Email, Phone, Address, Password fields
  └── Submit → (mock for now)
```

---

### Step 3 — Dashboard page

**Route:** `/dashboard`

Fetch and display in this order:

```
1. GET /api/customers/:customerId
   → Show: customer name in the header, email, phone

2. GET /api/customers/:customerId/accounts
   → Show: one StatCard per account with account_type and balance

3. GET /api/accounts/:accountNo/transactions  (for the first/primary account)
   → Show: last 5 transactions in a table

4. GET /api/customers/:customerId/loans
   → Show: active loan count or latest loan status badge
```

For now, hardcode a `customerId` UUID at the top of the file:
```typescript
const CUSTOMER_ID = 'paste-uuid-from-supabase-here'
```

This will be replaced with `session.user.id` when auth is added.

---

### Step 4 — Accounts page

**Route:** `/accounts`

```
GET /api/customers/:customerId/accounts
→ Show each account in a card:
   - Account number (account_no)
   - Account type (savings / current)
   - Balance (formatted as currency)
   - Status badge (active / inactive)

On click → navigate to /accounts/:accountNo for transaction history
```

---

### Step 5 — Transactions page

**Route:** `/transactions`

Three actions on this page:

**Deposit**
```typescript
POST /api/transactions/deposit
Body: { account_no, amount, description }
```

**Withdraw**
```typescript
POST /api/transactions/withdraw
Body: { account_no, amount, description }
```

**Transfer**
```typescript
POST /api/transactions/transfer
Body: { sender_account, receiver_account, amount }
```

**Transaction History**
```typescript
GET /api/accounts/:accountNo/transactions
→ Show: date, type badge, amount, description in a table
```

After a successful deposit/withdraw/transfer, refetch the account balance and transaction history to update the UI.

---

### Step 6 — Loans page

**Route:** `/loans`

**Apply for a loan**
```typescript
POST /api/loans
Body: {
  customer_id: "uuid",
  loan_amount: 10000,
  interest_rate: 8.5,
  loan_type: "personal"   // personal / home / education / car
}
```

**View loan status**
```typescript
GET /api/customers/:customerId/loans
→ Show each loan in a table:
   - Loan type
   - Amount
   - Interest rate
   - Status badge (pending / approved / rejected)
   - Application date
```

---

### API Quick Reference for Member 2

| What you need | Method | Endpoint | Body |
|---|---|---|---|
| Customer profile | GET | `/api/customers/:customerId` | — |
| Customer's accounts | GET | `/api/customers/:customerId/accounts` | — |
| Customer's loans | GET | `/api/customers/:customerId/loans` | — |
| Account details | GET | `/api/accounts/:accountNo` | — |
| Transaction history | GET | `/api/accounts/:accountNo/transactions` | — |
| Deposit | POST | `/api/transactions/deposit` | `{ account_no, amount, description }` |
| Withdraw | POST | `/api/transactions/withdraw` | `{ account_no, amount, description }` |
| Transfer | POST | `/api/transactions/transfer` | `{ sender_account, receiver_account, amount }` |
| Apply for loan | POST | `/api/loans` | `{ customer_id, loan_amount, interest_rate, loan_type }` |

---

---

# Member 3 — Admin Module

**Branch:** `feature/admin-module`  
**Pages to build:** `/admin` `/admin/customers` `/admin/accounts` `/admin/transactions`

---

## Step-by-Step Guide

### Step 1 — Admin Dashboard (`/admin`)

Fetch summary stats for the overview cards:

```typescript
// Total customers
GET /api/admin/customers → count array.length

// Total accounts
GET /api/admin/accounts → count array.length

// Total transactions
GET /api/admin/transactions → count array.length

// Recent audit activity
GET /api/auditlogs → show last 5 entries
```

Display using `StatCard` components from Member 4.

---

### Step 2 — Customer Management (`/admin/customers`)

This is the most feature-heavy page. Build in this order:

**List all customers**
```typescript
GET /api/admin/customers
→ Show in a DataTable with columns:
   Name | Email | Phone | Created At | Actions
```

**Add a customer** (button opens a FormDialog)
```typescript
POST /api/admin/customers
Body: { name, email, phone, address, admin_id }

// admin_id: hardcode from Supabase admin table for now
const ADMIN_ID = 'paste-admin-uuid-here'
```

**Update a customer** (edit icon in table row)
```typescript
PUT /api/admin/customers/:id
Body: { admin_id, ...fields to update }
// Send only the fields that changed
```

**Delete a customer** (delete icon → ConfirmDialog → confirm)
```typescript
DELETE /api/admin/customers/:id
Body: { admin_id }

⚠️  IMPORTANT: If the customer has accounts, this will fail with a
foreign key error. Show a warning in the UI before confirming:
"This will permanently delete the customer. Ensure they have no active accounts."
```

After every POST / PUT / DELETE, refetch `GET /api/admin/customers` to refresh the table.

---

### Step 3 — Account Management (`/admin/accounts`)

Read-only view.

```typescript
GET /api/admin/accounts
→ Show in DataTable:
   Account No | Customer ID | Type | Balance | Status | Created At

// Add a search/filter input on the frontend to filter by customer_id or status
// No backend filter endpoint needed — filter the array client-side
```

---

### Step 4 — Transaction Monitoring (`/admin/transactions`)

Read-only view.

```typescript
GET /api/admin/transactions
→ Show in DataTable:
   Date | Account No | Type | Amount | Description

// Add a client-side filter by transaction_type (deposit / withdrawal)
// Add a date range filter if time allows
```

---

### Step 5 — Audit Log (add to Admin Dashboard)

```typescript
GET /api/auditlogs
→ Show in a table:
   Timestamp | Admin ID | Action | Table | Record ID
```

This requires no extra work — just call the endpoint and render.

---

### API Quick Reference for Member 3

| What you need | Method | Endpoint | Body |
|---|---|---|---|
| All customers | GET | `/api/admin/customers` | — |
| Add customer | POST | `/api/admin/customers` | `{ name, email, phone, address, admin_id }` |
| Update customer | PUT | `/api/admin/customers/:id` | `{ admin_id, ...fields }` |
| Delete customer | DELETE | `/api/admin/customers/:id` | `{ admin_id }` |
| All accounts | GET | `/api/admin/accounts` | — |
| All transactions | GET | `/api/admin/transactions` | — |
| Audit logs | GET | `/api/auditlogs` | — |

---

---

# Member 4 — Manager Module & UI Lead

**Branch:** `feature/manager-module`  
**Pages to build:** `/manager` `/manager/loans` `/manager/reports`  
**Also responsible for:** All shared UI components used across every module

---

## Step-by-Step Guide

### Step 1 — Build shared UI components FIRST

This is your highest priority because Members 2 and 3 depend on these. Build and export them before starting your own pages.

Create all components in `components/ui/` and export from `components/ui/index.ts`.

**Components to build:**

**`Navbar`**
- Logo on the left
- Navigation links in the middle (role-aware — show different links per role later)
- User info / logout button on the right

**`Sidebar`**
- Collapsible
- Links list passed as props
- Active link highlighting

**`StatCard`**
```typescript
// Props
interface StatCardProps {
  label: string      // e.g. "Total Loans"
  value: number      // e.g. 42
  color?: string     // accent color
}
```

**`DataTable`**
```typescript
// Generic reusable table
interface DataTableProps {
  columns: { key: string; label: string }[]
  data: Record<string, any>[]
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
}
```

**`Badge`**
```typescript
// Status pill with colour coding
// pending → yellow
// approved / active → green
// rejected / inactive → red
interface BadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
}
```

**`FormDialog`**
- Modal with a form inside
- Props: `title`, `fields`, `onSubmit`, `onClose`

**`ConfirmDialog`**
- Simple yes/no modal
- Props: `message`, `onConfirm`, `onCancel`

**`LoadingSpinner`**
- Centered spinner shown during API calls

---

### Step 2 — Manager Dashboard (`/manager`)

```typescript
// Fetch all 4 counts in parallel using Promise.all
const [all, pending, approved, rejected] = await Promise.all([
  fetch('/api/manager/loans'),
  fetch('/api/loans/pending'),
  fetch('/api/manager/loans/approved'),
  fetch('/api/manager/loans/rejected'),
])

// Display as 4 StatCards:
// Total Loans | Pending | Approved | Rejected
```

---

### Step 3 — Loan Management (`/manager/loans`)

This is your main page. Build it as a tabbed interface:

**Tab 1 — Pending (Approval Queue)**
```typescript
GET /api/loans/pending
→ Show each loan in a table with:
   Customer ID | Loan Type | Amount | Interest Rate | Applied On | Actions

// Actions: Approve button + Reject button per row
```

**Approve action**
```typescript
PUT /api/loans/:loanId/approve
Body: { manager_id: MANAGER_ID }

const MANAGER_ID = 'paste-manager-uuid-from-supabase-here'
```

**Reject action**
```typescript
PUT /api/loans/:loanId/reject
Body: { manager_id: MANAGER_ID }
```

After approve or reject, remove the loan from the pending list immediately (optimistic update), then refetch to confirm.

**Tab 2 — All Loans**
```typescript
GET /api/manager/loans
→ Show all loans with status Badge on each row
```

---

### Step 4 — Reports page (`/manager/reports`)

```typescript
// Approved loans
GET /api/manager/loans/approved
→ Show in a table with totals:
   - Total approved amount (sum of loan_amount)
   - Count of approved loans

// Rejected loans
GET /api/manager/loans/rejected
→ Show count and list
```

Optional: Add a simple bar chart showing approved vs rejected vs pending counts. You can use `recharts` which is available in the project.

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Pending', count: pendingCount },
  { name: 'Approved', count: approvedCount },
  { name: 'Rejected', count: rejectedCount },
]
```

---

### API Quick Reference for Member 4

| What you need | Method | Endpoint | Body |
|---|---|---|---|
| All loans | GET | `/api/manager/loans` | — |
| Pending loans | GET | `/api/loans/pending` | — |
| Approved loans | GET | `/api/manager/loans/approved` | — |
| Rejected loans | GET | `/api/manager/loans/rejected` | — |
| Approve a loan | PUT | `/api/loans/:loanId/approve` | `{ manager_id }` |
| Reject a loan | PUT | `/api/loans/:loanId/reject` | `{ manager_id }` |

---

---

## Test Data Available in Supabase

The following are already seeded. Get the UUIDs from Supabase → Table Editor.

| Record | Table | How to find |
|--------|-------|-------------|
| Test Admin | `admin` | Table Editor → admin → copy `admin_id` |
| john@test.com | `customer` | Table Editor → customer → copy `customer_id` |
| Savings account | `account` | Table Editor → account → copy `account_no` |
| Test Manager | `manager` | Table Editor → manager → copy `manager_id` |

---

## Common Mistakes to Avoid

**Don't fetch on every render** — use `useEffect` with an empty dependency array `[]` for initial data loads.

**Don't store sensitive IDs in localStorage** — keep them in React state or context for now. Auth will handle this properly later.

**Check `response.data.success`** before accessing `response.data.data`. If `success` is false, show an error toast or message.

**Don't duplicate API call logic** — create a small `hooks/useApi.ts` or a simple utility function to handle fetch + error handling in one place. Example:

```typescript
// utils/api.ts
export async function apiCall(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error)
  return json.data
}
```

Then in your components:
```typescript
const customers = await apiCall('/api/admin/customers')
const result = await apiCall('/api/transactions/deposit', {
  method: 'POST',
  body: JSON.stringify({ account_no, amount, description }),
})
```

**Amount must be a number, not a string** — when reading from an input field, always parse:
```typescript
const amount = parseFloat(e.target.value)
```

---

## Integration Checklist (before merging to develop)

- [ ] All pages render without console errors
- [ ] All API calls use the correct endpoint and body shape
- [ ] Loading states shown during API calls
- [ ] Error messages shown when API returns `success: false`
- [ ] No hardcoded data — everything comes from the API
- [ ] Forms validate required fields before submitting
- [ ] Shared components imported from `components/ui/`, not duplicated
- [ ] Branch is up to date with `develop` before raising PR