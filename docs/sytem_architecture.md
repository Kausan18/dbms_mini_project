# BMS — System Architecture

> **Bank Management System** | Next.js + TypeScript + Supabase (PostgreSQL)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        BROWSER                          │
│         Customer  /  Admin  /  Manager                  │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                        │
│              Next.js (App Router)                       │
│     Pages: /dashboard  /accounts  /admin  /manager      │
│     Built with TypeScript + Tailwind CSS                │
└──────────────────────┬──────────────────────────────────┘
                       │  fetch() / axios
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│           Next.js Route Handlers (app/api/)             │
│   • Parses and validates request body                   │
│   • Checks required fields                              │
│   • Returns successResponse() or errorResponse()        │
└──────────────────────┬──────────────────────────────────┘
                       │  calls service functions
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                          │
│                  (services/*.ts)                        │
│   • Contains all business logic                         │
│   • Calls Supabase SDK or RPC functions                 │
│   • Throws errors that the API layer catches            │
└──────────────────────┬──────────────────────────────────┘
                       │  Supabase SDK
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE SDK                           │
│                   (lib/supabase.ts)                     │
│   • supabaseServer — used in API routes                 │
│   • supabaseBrowser — used in frontend components       │
└──────────────────────┬──────────────────────────────────┘
                       │  REST / PostgREST / RPC
                       ▼
┌─────────────────────────────────────────────────────────┐
│               POSTGRESQL DATABASE                       │
│                   (Supabase Cloud)                      │
│   9 Tables + 2 Atomic PostgreSQL Functions              │
│   Constraints · Foreign Keys · Transactions             │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### Frontend Layer
- Renders UI pages for each role
- Calls backend APIs using `fetch()`
- Handles loading states and error messages
- No business logic lives here

### API Layer (`app/api/`)
- One `route.ts` file per endpoint
- Reads and validates the request body
- Calls the appropriate service function
- Returns a consistent JSON response shape:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

### Service Layer (`services/`)
- The only place that talks to the database
- Contains all business rules (e.g. balance checks)
- Calls `.from()`, `.select()`, `.insert()`, `.update()` on Supabase
- For atomic operations, calls `.rpc()` to invoke PostgreSQL functions

### Supabase SDK (`lib/supabase.ts`)
- Exports two clients:
  - `supabaseServer` — used inside `app/api/` route handlers
  - `supabaseBrowser` — used inside frontend components (after auth is added)

### Database Layer
- PostgreSQL hosted on Supabase Cloud
- All constraints enforced at the DB level (NOT NULL, UNIQUE, FK, CHECK)
- Two stored functions handle atomic money movement

---

## 3. Request Lifecycle — Step by Step

### Example: Customer deposits money

```
1. Customer clicks "Deposit" on the frontend
         │
2. Frontend sends:
   POST /api/transactions/deposit
   Body: { account_no, amount, description }
         │
3. app/api/transactions/deposit/route.ts
   • Reads body
   • Validates account_no and amount are present
   • Calls deposit(account_no, amount, description)
         │
4. services/transaction.service.ts → deposit()
   • Calls supabaseServer.rpc('process_transaction', { ... })
   • Checks data.success — throws if false
   • Returns { transaction_id, new_balance }
         │
5. PostgreSQL function: process_transaction()
   • Locks the account row (FOR UPDATE)
   • Checks account exists
   • Updates balance atomically
   • Inserts a record into transaction table
   • Returns JSON result
         │
6. Route handler returns:
   { "success": true, "data": { transaction_id, new_balance } }
         │
7. Frontend updates the balance display
```

---

## 4. Transaction & Transfer Flow (ACID)

### Deposit / Withdrawal
```
POST /api/transactions/deposit  or  /withdraw
         │
         ▼
process_transaction(p_account_no, p_type, p_amount, p_description)
         │
         ├── SELECT balance FROM account FOR UPDATE   ← locks row
         ├── Check sufficient funds (withdrawal only)
         ├── UPDATE account SET balance = new_balance
         └── INSERT INTO transaction (...)
             Returns: { success, transaction_id, new_balance }
```

### Transfer
```
POST /api/transactions/transfer
         │
         ▼
process_transfer(p_sender_account, p_receiver_account, p_amount)
         │
         ├── Lock both account rows
         ├── Check sender has sufficient funds
         ├── Deduct from sender balance
         ├── Add to receiver balance
         ├── INSERT INTO transfer (...)
         └── INSERT INTO transaction (...) for both accounts
             Returns: { success, transfer_id }
```

Both functions are wrapped in an implicit PostgreSQL transaction — if any step fails, everything rolls back automatically.

---

## 5. Loan Approval Flow

```
Customer                 Manager                  Database
   │                        │                        │
   │  POST /api/loans        │                        │
   │─────────────────────────────────────────────────▶│
   │                        │              INSERT loan (status: pending)
   │                        │                        │
   │                        │  GET /api/loans/pending │
   │                        │────────────────────────▶│
   │                        │◀── pending loans list ──│
   │                        │                        │
   │                        │  PUT /api/loans/:id/approve
   │                        │────────────────────────▶│
   │                        │         UPDATE loan SET status = 'approved'
   │                        │         UPDATE loan SET manager_id = ...
   │                        │◀── success ─────────────│
```

---

## 6. Audit Logging Flow

Every admin action (create customer, delete customer, approve/reject loan) automatically triggers a write to the `audit_log` table via `createAuditLog()` in `services/audit.service.ts`. The API route handler calls this after the main operation succeeds.

```
Admin Action (POST/PUT/DELETE)
         │
         ▼
Route Handler
         │
         ├── Perform main DB operation
         └── createAuditLog({ admin_id, action, table_name, record_id })
                   │
                   ▼
         INSERT INTO audit_log (...)
```

---

## 7. Folder Structure

```
app/
├── api/
│   ├── admin/
│   │   ├── customers/        → GET all, POST create
│   │   │   └── [id]/         → PUT update, DELETE remove
│   │   ├── accounts/         → GET all accounts
│   │   └── transactions/     → GET all transactions
│   ├── accounts/
│   │   └── [accountNo]/
│   │       └── transactions/ → GET by account
│   ├── customers/
│   │   └── [customerId]/
│   │       ├── accounts/     → GET customer's accounts
│   │       └── loans/        → GET customer's loans
│   ├── loans/
│   │   ├── pending/          → GET pending loans
│   │   └── [loanId]/
│   │       ├── approve/      → PUT approve
│   │       └── reject/       → PUT reject
│   ├── manager/
│   │   └── loans/
│   │       ├── approved/     → GET approved loans
│   │       └── rejected/     → GET rejected loans
│   ├── transactions/
│   │   ├── deposit/          → POST
│   │   ├── withdraw/         → POST
│   │   └── transfer/         → POST
│   └── auditlogs/            → GET all logs
│
├── (pages)/
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   ├── accounts/
│   ├── transactions/
│   ├── loans/
│   ├── admin/
│   └── manager/
│
services/
│   ├── customer.service.ts
│   ├── account.service.ts
│   ├── transaction.service.ts
│   ├── loan.service.ts
│   └── audit.service.ts
│
lib/
│   ├── supabase.ts           → Supabase client exports
│   └── response.ts           → successResponse / errorResponse helpers
│
types/
│   └── index.ts              → TypeScript types for all 9 tables
```

---

## 8. Authentication (To Be Added Last)

Auth is intentionally deferred until all frontend modules are complete. When added:

```
User submits login form
         │
         ▼
POST /api/auth/login
         │
         ▼
Supabase Auth validates credentials
         │
         ▼
JWT token returned to client
         │
         ▼
Client stores token in cookie/session
         │
         ▼
All subsequent requests carry the JWT
         │
         ▼
middleware.ts intercepts every request
• Verifies JWT
• Extracts role from user_roles table
• Blocks unauthorized access
• Injects user context into request
         │
         ▼
RLS Policies on PostgreSQL enforce:
• Customers see only their own data
• Managers see only loans
• Admins see everything
```

Until auth is added, pass `customer_id`, `admin_id`, and `manager_id` explicitly in request bodies.