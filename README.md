# 🏦 Bank Management System (BMS)

> A DBMS Mini Project — built to demonstrate core database management concepts through a real-world banking application.

---

## 👥 Team

| Member | Role |
|--------|------|
| Kaustubh Shandilya | Backend & Database Lead |
| Lohit Ganesh Naidu| Customer Module |
| Tejas H K | Admin Module |
| Shambhavi Sinha| Manager Module & UI Lead |

---

## 📌 What This Project Is About

We built a centralized banking platform that manages customers, accounts, transactions, and loans. The idea was to go beyond just designing an ER diagram on paper — we wanted to actually implement it as a working full-stack application where you can see DBMS concepts like transactions, foreign keys, constraints, and ACID properties in action.

The system supports three roles:
- **Customer** — can manage their accounts, do transactions, apply for loans
- **Admin** — manages customer records and creates bank accounts
- **Manager** — reviews and approves/rejects loan applications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (REST) |
| Database | PostgreSQL via Supabase |
| Deployment | Vercel (frontend) + Supabase Cloud (database) |

---

## 🗄️ Database Design

We designed 9 tables covering all banking entities:

```
customer        — stores customer profile info
account         — bank accounts linked to customers (1 customer : N accounts)
transaction     — every deposit, withdrawal recorded here
transfer        — tracks money movement between accounts
loan            — loan applications with status tracking
manager         — bank managers who approve/reject loans
admin           — admins who manage customer records
audit_log       — logs every admin action for accountability
user_roles      — role mapping table
```

### Key Relationships
```
Customer (1) ──── (N) Account
Account  (1) ──── (N) Transaction
Customer (1) ──── (N) Loan
Manager  (1) ──── (N) Loan
Admin    (1) ──── (N) Audit Log
```

### DBMS Concepts Implemented

- **Primary Keys** on every table for unique identification
- **Foreign Keys** enforcing referential integrity (e.g. you can't create an account for a non-existent customer)
- **Constraints** — NOT NULL, UNIQUE on emails, CHECK on account types
- **Atomic Transactions** — deposits, withdrawals, and transfers use PostgreSQL functions (`process_transaction`, `process_transfer`) to ensure ACID compliance. If a transfer fails halfway, the entire operation rolls back.
- **Row-Level Locking** on transfer operations to prevent race conditions

---

## 🚀 Features

### Customer
- Sign up and get a unique customer ID
- View dashboard with total balance across all accounts
- Deposit, withdraw, and transfer money between accounts
- Live EMI calculator when applying for loans
- Track loan application status (pending / approved / rejected)
- Full transaction history per account

### Admin
- View all registered customers
- Add, edit, and delete customer records
- Create bank accounts for customers (savings / checking / current)
- Monitor all accounts and transactions across the system
- Every action is recorded in the audit log

### Manager
- View all pending loan applications from customers
- Approve or reject loans — status reflects immediately for the customer
- View approved and rejected loan history
- Dashboard with loan statistics

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # All REST API endpoints
│   │   ├── auth/               # signup, login, logout
│   │   ├── customers/          # customer profile & related data
│   │   ├── accounts/           # account creation & details
│   │   ├── transactions/       # deposit, withdraw, transfer
│   │   ├── loans/              # loan applications & approvals
│   │   ├── admin/              # admin-specific operations
│   │   ├── manager/            # manager-specific operations
│   │   └── auditlogs/          # audit trail
│   ├── customer/               # Customer portal pages
│   ├── admin/                  # Admin portal pages
│   ├── manager/                # Manager portal pages
│   ├── login/
│   └── signup/
│
├── services/                   # Business logic layer
│   ├── customer.service.ts
│   ├── account.service.ts
│   ├── transaction.service.ts
│   ├── loan.service.ts
│   └── audit.service.ts
│
├── components/ui/              # Shared UI components
├── lib/                        # Supabase client, response helpers
└── types/                      # TypeScript types for all tables
```

---

## ⚙️ Running Locally

### Prerequisites
- Node.js 18+
- A Supabase project with the schema set up

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/dbms-mini-project.git
cd dbms-mini-project

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file in the root with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Demo Walkthrough

To demo all three roles, use **three separate browsers** (or one normal + one incognito + Firefox) so their sessions don't interfere with each other.

**Step 1 — Customer signs up**
- Go to `/signup`, select **Customer**, fill in details
- You'll land on the customer dashboard (no accounts yet)

**Step 2 — Admin creates an account for the customer**
- In a second browser, go to `/signup`, select **Admin**
- Navigate to **Accounts** → click **Create Account**
- Select the customer from the dropdown, choose account type → Create
- The customer now has a bank account

**Step 3 — Customer does transactions**
- Back in the customer browser, refresh the dashboard
- Go to **Transactions** → deposit some money, try a withdrawal or transfer

**Step 4 — Customer applies for a loan**
- Go to **Loans** → pick loan type, enter amount and interest rate
- EMI is shown live → click **Submit Application**
- Status shows as **Pending**

**Step 5 — Manager reviews the loan**
- In a third browser, go to `/signup`, select **Manager**
- Navigate to **Loans Application** → the pending loan appears
- Click **Approve** or **Reject**

**Step 6 — Customer sees the result**
- Back in the customer browser, go to **Loans**
- Status now shows **Approved** or **Rejected**

---

## 🌐 Deployment

The project is deployed on **Vercel** connected to **Supabase Cloud**.

Live URL: https://dbms-mini-project-liard.vercel.app

Environment variables are configured in Vercel's dashboard under Project Settings → Environment Variables.

---

## 📚 What We Learned

- How to design a normalized relational database (1NF, 2NF, 3NF) and translate an ER diagram into actual SQL tables
- How PostgreSQL foreign key constraints work in practice — we hit a real FK violation error when trying to delete a customer who still had accounts, which made the concept click instantly
- How to write atomic database functions in SQL to ensure ACID compliance for financial transactions
- How REST APIs map to database operations through a service layer
- How role-based access works at the application level
- The challenge of managing user sessions across multiple roles in the same browser (localStorage scope)

---

## 🔮 Future Scope

- Full authentication with Supabase Auth + JWT
- Row Level Security (RLS) policies on the database
- Email notifications on loan approval/rejection
- Transaction receipt downloads
- Analytics dashboard for admins
- Mobile app

---

## 📄 License

This project was built as an academic mini project. Feel free to use it as a reference.
