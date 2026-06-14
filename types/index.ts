// types/index.ts

export type AccountType = 'savings' | 'checking' | 'current'
export type AccountStatus = 'active' | 'inactive' | 'frozen'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'
export type LoanType = 'personal' | 'home' | 'education' | 'vehicle' | 'business'
export type LoanStatus = 'pending' | 'approved' | 'rejected'

export interface Customer {
  customer_id: string
  user_id?: string
  name: string
  email: string
  phone: string
  address?: string
  created_at: string
}

export interface Admin {
  admin_id: string
  user_id?: string
  name: string
  email: string
  created_at: string
}

export interface Manager {
  manager_id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  created_at: string
}

export interface Account {
  account_no: string
  customer_id: string
  account_type: AccountType
  balance: number
  status: AccountStatus
  created_at: string
}

export interface Transaction {
  transaction_id: string
  account_no: string
  transaction_type: TransactionType
  amount: number
  description?: string
  transaction_date: string
}

export interface Transfer {
  transfer_id: string
  sender_account: string
  receiver_account: string
  amount: number
  transfer_date: string
}

export interface Loan {
  loan_id: string
  customer_id: string
  manager_id?: string
  loan_amount: number
  interest_rate: number
  loan_type: LoanType
  status: LoanStatus
  application_date: string
}

export interface AuditLog {
  log_id: string
  admin_id?: string
  action: string
  table_name: string
  record_id?: string
  timestamp: string
}

// API response wrapper
export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}