# SYSTEM_ARCHITECTURE.md

# System Architecture

## High-Level Architecture

Customer/Admin/Manager

↓

Frontend (Next.js)

↓

API Layer (Next.js Route Handlers)

↓

Service Layer

↓

Supabase SDK

↓

PostgreSQL Database

---

# Component Overview

## Frontend

Responsible for:

* User Interface
* Form Validation
* Dashboard Rendering

## API Layer

Responsible for:

* Request Validation
* Authentication
* Authorization

## Service Layer

Responsible for:

* Business Logic
* Database Operations

## Database Layer

Responsible for:

* Data Storage
* Constraints
* Relationships
* Transactions

---

# Authentication Flow

User Login

↓

Supabase Auth

↓

JWT Token

↓

Protected Routes

---

# Transaction Flow

Deposit/Withdraw/Transfer Request

↓

Validation

↓

Database Transaction

↓

Transaction Record Creation

↓

Response
