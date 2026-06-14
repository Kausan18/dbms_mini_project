# BMS — Database Schema Design

> **Bank Management System** | PostgreSQL on Supabase Cloud

---

## 1. Overview

The database contains **9 tables** organized around three core domains:

| Domain | Tables |
|--------|--------|
| User Management | `customer`, `admin`, `manager`, `user_roles` |
| Banking Operations | `account`, `transaction`, `transfer` |
| Loan & Audit | `loan`, `audit_log` |

All primary keys are `UUID` generated automatically by PostgreSQL (`gen_random_uuid()`). All timestamps default to `now()`.

---

## 2. Entity Relationship Diagram

```
ADMIN
 │
 │ 1
 │
 │ N
AUDIT_LOG


CUSTOMER ──────────────────────────────────────────┐
 │                                                  │
 │ 1                                                │ 1
 │                                                  │
 │ N                                                │ N
ACCOUNT                                            LOAN ──────── MANAGER
 │                                                        N       1
 │ 1
 │
 │ N
TRANSACTION


ACCOUNT (sender) ──┐
                   ├── TRANSFER
ACCOUNT (receiver) ┘
```

### Cardinality Summary

| Relationship | Type |
|---|---|
| Customer → Account | 1 : N (one customer, many accounts) |
| Account → Transaction | 1 : N (one account, many transactions) |
| Customer → Loan | 1 : N (one customer, many loan applications) |
| Manager → Loan | 1 : N (one manager approves many loans) |
| Admin → Audit Log | 1 : N (one admin, many logged actions) |
| Account → Transfer (as sender) | 1 : N |
| Account → Transfer (as receiver) | 1 : N |

---

## 3. Table Definitions

---

### `customer`

Stores personal information for all bank customers.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `customer_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `name` | VARCHAR | NOT NULL | Full name |
| `email` | VARCHAR | NOT NULL, UNIQUE | Login identifier |
| `phone` | VARCHAR | NOT NULL | Contact number |
| `address` | TEXT | | Mailing address |
| `created_at` | TIMESTAMP | DEFAULT now() | Auto-set on insert |

---

### `account`

Each customer can have one or more bank accounts.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `account_no` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `customer_id` | UUID | FK → customer(customer_id), NOT NULL | Owner of the account |
| `account_type` | VARCHAR | NOT NULL | e.g. 'savings', 'current' |
| `balance` | NUMERIC | NOT NULL, DEFAULT 0, CHECK (balance >= 0) | Never goes negative |
| `status` | VARCHAR | NOT NULL, DEFAULT 'active' | 'active' or 'inactive' |
| `created_at` | TIMESTAMP | DEFAULT now() | Auto-set on insert |

**Foreign Key behaviour:** `ON DELETE CASCADE` — deleting a customer removes their accounts.

---

### `transaction`

Records every deposit and withdrawal on an account.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `transaction_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `account_no` | UUID | FK → account(account_no), NOT NULL | Which account |
| `transaction_type` | VARCHAR | NOT NULL, CHECK IN ('deposit','withdrawal') | Type enforced |
| `amount` | NUMERIC | NOT NULL, CHECK (amount > 0) | Always positive |
| `description` | TEXT | | Optional note |
| `transaction_date` | TIMESTAMP | DEFAULT now() | Auto-set on insert |

**Note:** Rows in this table are inserted by the `process_transaction()` PostgreSQL function, not directly from the service layer.

---

### `transfer`

Records every fund transfer between two accounts.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `transfer_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `sender_account` | UUID | FK → account(account_no), NOT NULL | Debit side |
| `receiver_account` | UUID | FK → account(account_no), NOT NULL | Credit side |
| `amount` | NUMERIC | NOT NULL, CHECK (amount > 0) | Transfer amount |
| `transfer_date` | TIMESTAMP | DEFAULT now() | Auto-set on insert |

**Note:** Inserted by the `process_transfer()` PostgreSQL function atomically along with balance updates.

---

### `loan`

Stores loan applications and their current approval status.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `loan_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `customer_id` | UUID | FK → customer(customer_id), NOT NULL | Applicant |
| `manager_id` | UUID | FK → manager(manager_id), NULLABLE | Set when approved/rejected |
| `loan_amount` | NUMERIC | NOT NULL, CHECK (loan_amount > 0) | Requested amount |
| `interest_rate` | NUMERIC | NOT NULL | Annual rate percentage |
| `loan_type` | VARCHAR | NOT NULL | e.g. 'personal', 'home', 'education' |
| `status` | VARCHAR | NOT NULL, DEFAULT 'pending' | 'pending' / 'approved' / 'rejected' |
| `application_date` | TIMESTAMP | DEFAULT now() | Auto-set on insert |

**Workflow:** Loans start as `pending`. Manager sets `status` to `approved` or `rejected` and their `manager_id` is stamped on the record.

---

### `manager`

Stores manager accounts used for loan approval.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `manager_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `name` | VARCHAR | NOT NULL | Full name |
| `email` | VARCHAR | NOT NULL, UNIQUE | Unique login |
| `phone` | VARCHAR | | Contact number |

---

### `admin`

Stores admin accounts for portal access.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `admin_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `name` | VARCHAR | NOT NULL | Full name |
| `email` | VARCHAR | NOT NULL, UNIQUE | Unique login |
| `password` | VARCHAR | NOT NULL | Hashed password (bcrypt) |

---

### `audit_log`

Automatically records every admin action for accountability.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `log_id` | UUID | PK, DEFAULT gen_random_uuid() | Auto-generated |
| `admin_id` | UUID | FK → admin(admin_id), NOT NULL | Who performed the action |
| `action` | VARCHAR | NOT NULL | e.g. 'CREATE_CUSTOMER', 'DELETE_CUSTOMER' |
| `table_name` | VARCHAR | NOT NULL | Which table was affected |
| `record_id` | VARCHAR | NOT NULL | ID of the affected record |
| `timestamp` | TIMESTAMP | DEFAULT now() | When it happened |

---

### `user_roles`

Maps Supabase Auth user IDs to roles. Used for RBAC once auth is enabled.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `user_id` | UUID | PK | Matches Supabase auth.users.id |
| `role` | VARCHAR | NOT NULL, CHECK IN ('customer','admin','manager') | Role assignment |
| `reference_id` | UUID | NOT NULL | Points to customer_id / admin_id / manager_id |

---

## 4. PostgreSQL Functions

Two atomic stored functions handle all money movement. They are called via `supabase.rpc()` from the service layer.

---

### `process_transaction`

Handles deposits and withdrawals atomically.

```sql
process_transaction(
  p_account_no  UUID,
  p_type        VARCHAR,   -- 'deposit' or 'withdrawal'
  p_amount      NUMERIC,
  p_description TEXT
) RETURNS JSON
```

**What it does, in order:**
1. `SELECT balance FROM account WHERE account_no = p_account_no FOR UPDATE` — locks the row
2. Returns error JSON if account not found
3. Returns error JSON if withdrawal amount exceeds balance
4. Updates `account.balance`
5. Inserts a record into `transaction`
6. Returns `{ success: true, transaction_id, new_balance }`

**ACID guarantee:** If the INSERT into `transaction` fails after the balance update, PostgreSQL rolls back the entire operation automatically.

---

### `process_transfer`

Handles fund transfers between two accounts atomically.

```sql
process_transfer(
  p_sender_account    UUID,
  p_receiver_account  UUID,
  p_amount            NUMERIC,
  p_description       TEXT
) RETURNS JSON
```

**What it does, in order:**
1. Locks both account rows with `FOR UPDATE`
2. Validates sender has sufficient funds
3. Deducts from sender balance
4. Adds to receiver balance
5. Inserts into `transfer` table
6. Returns `{ success: true, transfer_id }`

---

## 5. DBMS Concepts Implemented

| Concept | Where Used |
|---------|-----------|
| Primary Keys | All 9 tables — UUID type |
| Foreign Keys | account→customer, transaction→account, loan→customer, loan→manager, audit_log→admin, transfer→account |
| NOT NULL | All required fields across all tables |
| UNIQUE | email in customer, admin, manager |
| CHECK constraints | balance >= 0, amount > 0, status IN (...), transaction_type IN (...) |
| Atomicity | process_transaction and process_transfer functions |
| Consistency | CHECK constraints ensure balance never goes negative |
| Isolation | FOR UPDATE row locking prevents race conditions on balance |
| Durability | Committed transactions persist permanently via PostgreSQL WAL |
| Normalization | 3NF — no transitive dependencies, no repeating groups |

---

## 6. Normalization Notes

**1NF** — All columns hold atomic values. No arrays or nested data stored in any column.

**2NF** — All non-key columns depend on the full primary key. No partial dependencies (all PKs are single-column UUIDs).

**3NF** — No transitive dependencies. Customer info is not repeated in account or transaction — only `customer_id` is stored as FK. Balance is stored only in `account`, not duplicated elsewhere.

---

## 7. Row Level Security (RLS)

Currently **disabled** on all tables during development. Will be enabled after auth is complete with these policies:

| Table | Customer Policy | Admin Policy | Manager Policy |
|-------|----------------|--------------|----------------|
| customer | own row only | all rows | none |
| account | own accounts only | all rows | none |
| transaction | own account's txns | all rows | none |
| loan | own loans only | all rows | all rows |
| audit_log | none | own logs | none |
| manager | none | all rows | own row |