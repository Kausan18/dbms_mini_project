# Team Work Distribution

## Bank Management System (BMS)

### Team Size

4 Members

### Development Approach

The project will be developed using a modular architecture where each team member is responsible for a specific module. This allows parallel development and reduces merge conflicts.

---

# Team Structure

| Member   | Role                               |
| -------- | ---------------------------------- |
| Member 1 | Backend & Database Lead            |
| Member 2 | Customer Module Developer          |
| Member 3 | Admin Module Developer             |
| Member 4 | Manager Module Developer & UI Lead |

---

# Member 1 – Backend & Database Lead

## Responsibilities

### Database Design

* Design ER Diagram
* Create Database Schema
* Define Relationships
* Define Constraints
* Perform Normalization (1NF, 2NF, 3NF)

### Supabase Setup

* Create Supabase Project
* Configure PostgreSQL Database
* Configure Authentication
* Setup Row Level Security (RLS)
* Configure Environment Variables

### Backend Development

Develop all REST APIs:

#### Authentication

```text
/api/auth/signup

/api/auth/login

/api/auth/logout
```

#### Customers

```text
/api/customers/*
```

#### Accounts

```text
/api/accounts/*
```

#### Transactions

```text
/api/transactions/*
```

#### Loans

```text
/api/loans/*
```

### Business Logic

* Deposit Funds
* Withdraw Funds
* Transfer Funds
* Loan Processing
* Audit Logging

### Documentation

* PRD
* Database Design
* API Contracts
* System Architecture

## Deliverables

```text
lib/

services/

app/api/

docs/
```

---

# Member 2 – Customer Module Developer

## Responsibilities

Develop all customer-facing interfaces.

### Pages

```text
/login

/signup

/dashboard

/accounts

/transactions

/loans
```

### Features

#### Authentication UI

* Login Page
* Signup Page

#### Dashboard

* Account Summary
* Balance Overview
* Recent Transactions
* Active Loans

#### Account Module

* View Account Details
* View Balance

#### Transaction Module

* Deposit Funds
* Withdraw Funds
* Transfer Funds
* Transaction History

#### Loan Module

* Apply for Loan
* View Loan Status

### API Integration

Consume backend APIs provided by Member 1.

## Deliverables

```text
app/login

app/signup

app/dashboard

app/accounts

app/transactions

app/loans

components/dashboard
```

---

# Member 3 – Admin Module Developer

## Responsibilities

Develop the complete Admin Portal.

### Pages

```text
/admin

/admin/customers

/admin/accounts

/admin/transactions
```

### Features

#### Customer Management

* Add Customer
* Update Customer
* Delete Customer
* View Customer Details

#### Account Management

* View Accounts
* Search Accounts
* Update Account Status

#### Transaction Monitoring

* View All Transactions
* Filter Transactions

### API Integration

Use APIs provided by Member 1.

#### Examples

```text
GET /api/admin/customers

POST /api/admin/customers

PUT /api/admin/customers/:id

DELETE /api/admin/customers/:id
```

## Deliverables

```text
app/admin

components/admin
```

---

# Member 4 – Manager Module Developer & UI Lead

## Responsibilities

Develop the Manager Portal and maintain shared UI components.

### Pages

```text
/manager

/manager/loans

/manager/reports
```

### Features

#### Loan Management

* View Loan Applications
* Approve Loan Requests
* Reject Loan Requests

#### Dashboard Analytics

* Total Loans
* Pending Loans
* Approved Loans
* Rejected Loans

### Shared UI Development

Create reusable components:

```text
Navbar

Sidebar

Cards

Tables

Forms

Dialogs

Buttons
```

Maintain design consistency across the application.

## Deliverables

```text
app/manager

components/layout

components/ui
```

---

# Git Workflow

## Main Branches

```text
main

develop
```

---

## Feature Branches

### Member 1

```text
feature/backend
```

### Member 2

```text
feature/customer-module
```

### Member 3

```text
feature/admin-module
```

### Member 4

```text
feature/manager-module
```

---

# Development Timeline

## Week 1

### Member 1

* Database Design
* Supabase Setup
* Authentication APIs

### Member 2

* Login UI
* Signup UI
* Customer Dashboard UI

### Member 3

* Admin Dashboard UI

### Member 4

* Manager Dashboard UI
* Shared Components

---

## Week 2

### Member 1

* Customer APIs
* Account APIs

### Member 2

* Account Module

### Member 3

* Customer Management Module

### Member 4

* Loan Dashboard

---

## Week 3

### Member 1

* Transaction APIs
* Transfer Logic

### Member 2

* Transaction Module

### Member 3

* Transaction Monitoring

### Member 4

* Loan Approval Module

---

## Week 4

### Member 1

* Audit Logs
* Testing
* Deployment

### Member 2

* Bug Fixes
* API Integration

### Member 3

* Bug Fixes
* API Integration

### Member 4

* Bug Fixes
* UI Refinements

---

# Module Ownership Matrix

| Module               | Owner               |
| -------------------- | ------------------- |
| Database Design      | Member 1            |
| ER Diagram           | Member 1            |
| Supabase Setup       | Member 1            |
| Authentication       | Member 1            |
| REST APIs            | Member 1            |
| Customer Portal      | Member 2            |
| Admin Portal         | Member 3            |
| Manager Portal       | Member 4            |
| Shared UI Components | Member 4            |
| Documentation        | Member 1            |
| Testing              | All Members         |
| Deployment           | Member 1 + Member 4 |

---

# Final Project Deliverables

## Backend

* Database Schema
* REST APIs
* Authentication
* Authorization

## Frontend

* Customer Portal
* Admin Portal
* Manager Portal

## Documentation

* PRD
* Requirements
* System Architecture
* Database Design
* ER Diagram
* API Contracts
* Testing Strategy

## Deployment

* Frontend Hosted on Vercel
* Backend Connected to Supabase

---

# Notes

The Backend & Database Lead (Member 1) acts as the central coordinator for API contracts and database changes. All frontend modules should consume the APIs defined by Member 1 to ensure consistency across the system.

This structure enables parallel development, minimizes merge conflicts, and ensures efficient collaboration throughout the project lifecycle.
