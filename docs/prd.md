# Bank Management System (BMS)

## Product Requirements Document (PRD)

---

# 1. Project Overview

## Project Name

**Bank Management System (BMS)**

## Project Type

DBMS Mini Project

## Development Team

* Kaustubh Shandilya
* Team Members: TBD

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes

### Database

* PostgreSQL (Supabase)

### Authentication

* Supabase Auth

### Deployment

* Vercel
* Supabase Cloud

---

# 2. Problem Statement

Traditional banking operations involve handling large amounts of customer data, account records, transactions, and loan applications.

Manual systems often lead to:

* Data redundancy
* Data inconsistency
* Security risks
* Slow transaction processing
* Poor record management

The goal is to build a centralized digital banking platform that securely manages customer accounts, banking transactions, and loan processing while maintaining database integrity.

---

# 3. Proposed Solution

The Bank Management System will provide:

* Customer account management
* Transaction management
* Loan management
* Administrative control
* Role-based access
* Secure authentication
* Audit logging

The platform will support three user roles:

1. Customer
2. Admin
3. Manager

---

# 4. User Roles

## Customer

### Capabilities

* Register/Login
* View Profile
* View Account Information
* Check Balance
* Deposit Money
* Withdraw Money
* Transfer Money
* View Transaction History
* Apply for Loans

---

## Admin

### Capabilities

* Add Customers
* Update Customer Information
* Delete Customer Records
* View Accounts
* View Transactions
* Monitor System Activities

---

## Manager

### Capabilities

* View Loan Applications
* Approve Loans
* Reject Loans
* Manage Loan Records

---

# 5. Functional Requirements

## FR-1 Authentication

Users must be able to:

* Register
* Login
* Logout

Role-based access should be enforced.

---

## FR-2 Customer Management

Admins should be able to:

* Create customer records
* Update customer details
* Delete customer records
* View customer information

---

## FR-3 Account Management

Customers should be able to:

* View account details
* View account balance

Admins should be able to:

* Create bank accounts
* Manage account records

---

## FR-4 Transaction Management

Customers should be able to:

* Deposit funds
* Withdraw funds
* Transfer funds
* View transaction history

All transactions should be recorded.

---

## FR-5 Loan Management

Customers should be able to:

* Apply for loans

Managers should be able to:

* Review applications
* Approve loans
* Reject loans

---

## FR-6 Audit Logging

All administrative actions should be logged.

Examples:

* Customer creation
* Customer deletion
* Loan approval
* Loan rejection

---

# 6. Database Design

---

## CUSTOMER

| Column           | Type      |
| ---------------- | --------- |
| customer_id (PK) | VARCHAR   |
| name             | VARCHAR   |
| email            | VARCHAR   |
| phone            | VARCHAR   |
| address          | TEXT      |
| created_at       | TIMESTAMP |

---

## ACCOUNT

| Column           | Type      |
| ---------------- | --------- |
| account_no (PK)  | VARCHAR   |
| customer_id (FK) | VARCHAR   |
| account_type     | VARCHAR   |
| balance          | DECIMAL   |
| status           | VARCHAR   |
| created_at       | TIMESTAMP |

---

## TRANSACTION

| Column              | Type      |
| ------------------- | --------- |
| transaction_id (PK) | VARCHAR   |
| account_no (FK)     | VARCHAR   |
| transaction_type    | VARCHAR   |
| amount              | DECIMAL   |
| description         | TEXT      |
| transaction_date    | TIMESTAMP |

---

## TRANSFER

| Column           | Type      |
| ---------------- | --------- |
| transfer_id (PK) | VARCHAR   |
| sender_account   | VARCHAR   |
| receiver_account | VARCHAR   |
| amount           | DECIMAL   |
| transfer_date    | TIMESTAMP |

---

## MANAGER

| Column          | Type    |
| --------------- | ------- |
| manager_id (PK) | VARCHAR |
| name            | VARCHAR |
| email           | VARCHAR |
| phone           | VARCHAR |

---

## LOAN

| Column           | Type      |
| ---------------- | --------- |
| loan_id (PK)     | VARCHAR   |
| customer_id (FK) | VARCHAR   |
| manager_id (FK)  | VARCHAR   |
| loan_amount      | DECIMAL   |
| interest_rate    | DECIMAL   |
| loan_type        | VARCHAR   |
| status           | VARCHAR   |
| application_date | TIMESTAMP |

---

## ADMIN

| Column        | Type    |
| ------------- | ------- |
| admin_id (PK) | VARCHAR |
| name          | VARCHAR |
| email         | VARCHAR |
| password      | VARCHAR |

---

## AUDIT_LOG

| Column        | Type      |
| ------------- | --------- |
| log_id (PK)   | VARCHAR   |
| admin_id (FK) | VARCHAR   |
| action        | VARCHAR   |
| table_name    | VARCHAR   |
| record_id     | VARCHAR   |
| timestamp     | TIMESTAMP |

---

# 7. Database Relationships

```text
CUSTOMER
│
├── ACCOUNT
│      │
│      └── TRANSACTION
│
├── LOAN
│
└── TRANSFER

MANAGER
│
└── LOAN

ADMIN
│
└── AUDIT_LOG
```

## Cardinality

```text
Customer → Account (1:N)

Account → Transaction (1:N)

Customer → Loan (1:N)

Manager → Loan (1:N)

Admin → Audit Log (1:N)
```

---

# 8. API Specifications

## Authentication APIs

```http
POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout
```

---

## Customer APIs

```http
GET /api/customers/:customerId

PUT /api/customers/:customerId

DELETE /api/customers/:customerId

GET /api/customers/:customerId/accounts

GET /api/customers/:customerId/loans
```

---

## Account APIs

```http
POST /api/accounts

GET /api/accounts/:accountNo
```

---

## Transaction APIs

```http
POST /api/transactions/deposit

POST /api/transactions/withdraw

POST /api/transactions/transfer

GET /api/accounts/:accountNo/transactions
```

---

## Loan APIs

```http
POST /api/loans

GET /api/loans/pending

PUT /api/loans/:loanId/approve

PUT /api/loans/:loanId/reject
```

---

## Manager APIs

```http
GET /api/manager/loans

GET /api/manager/loans/approved

GET /api/manager/loans/rejected
```

---

## Admin APIs

```http
POST /api/admin/customers

PUT /api/admin/customers/:id

DELETE /api/admin/customers/:id

GET /api/admin/customers

GET /api/admin/accounts

GET /api/admin/transactions
```

---

## Audit APIs

```http
GET /api/auditlogs
```

---

# 9. Project Folder Structure

```text
├── app
│   ├── api
│   │   ├── auth
│   │   ├── customers
│   │   ├── accounts
│   │   ├── transactions
│   │   ├── loans
│   │   ├── admin
│   │   └── manager
│   │
│   ├── login
│   ├── signup
│   ├── dashboard
│   ├── accounts
│   ├── transactions
│   ├── loans
│   ├── admin
│   └── manager
│
├── components
│   ├── dashboard
│   └── layout
│
├── services
├── types
├── hooks
├── utils
├── constants
├── middleware
├── lib
├── docs
└── public
---

# 10. Security Requirements

* JWT Authentication
* Supabase Authentication
* Protected API Routes
* Role-Based Access Control
* Password Hashing
* Input Validation
* Audit Logging

---

# 11. DBMS Concepts Implemented

## Primary Keys

Used for unique identification.

## Foreign Keys

Used for table relationships.

## Constraints

* NOT NULL
* UNIQUE
* CHECK
* FOREIGN KEY

## Transactions

Used for:

* Deposits
* Withdrawals
* Transfers

## ACID Properties

### Atomicity

All transfer operations succeed or fail together.

### Consistency

Database remains valid after each transaction.

### Isolation

Transactions execute independently.

### Durability

Committed changes persist permanently.

---

# 12. Future Enhancements

* Credit Card Management
* ATM Module
* SMS Notifications
* Email Notifications
* AI-Based Loan Recommendation
* Fraud Detection System
* Financial Analytics Dashboard

---

# 13. Expected Outcome

The system will provide a secure and centralized banking platform capable of managing customer accounts, financial transactions, and loan applications while demonstrating core DBMS concepts and modern web development practices.

---

# 14. Conclusion

The Bank Management System is designed to showcase practical implementation of Database Management System concepts through a real-world banking application. The project emphasizes database normalization, secure transaction processing, role-based management, and scalable architecture using Next.js and Supabase.
