// services/loan.service.ts
import { supabaseServer } from '@/lib/supabase'
import { Loan, LoanType } from '@/types'

export async function applyForLoan(
  customerId: string,
  loanAmount: number,
  interestRate: number,
  loanType: LoanType
): Promise<Loan> {
  const { data, error } = await supabaseServer
    .from('loan')
    .insert({
      customer_id: customerId,
      loan_amount: loanAmount,
      interest_rate: interestRate,
      loan_type: loanType,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getPendingLoans(): Promise<Loan[]> {
  const { data, error } = await supabaseServer
    .from('loan')
    .select('*, customer(name, email)')
    .eq('status', 'pending')
    .order('application_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getLoansByCustomer(customerId: string): Promise<Loan[]> {
  const { data, error } = await supabaseServer
    .from('loan')
    .select('*')
    .eq('customer_id', customerId)
    .order('application_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function approveLoan(loanId: string, managerId: string): Promise<Loan> {
  const { data, error } = await supabaseServer
    .from('loan')
    .update({ status: 'approved', manager_id: managerId })
    .eq('loan_id', loanId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Loan not found or already processed')
  return data
}

export async function rejectLoan(loanId: string, managerId: string): Promise<Loan> {
  const { data, error } = await supabaseServer
    .from('loan')
    .update({ status: 'rejected', manager_id: managerId })
    .eq('loan_id', loanId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Loan not found or already processed')
  return data
}

export async function getLoansByStatus(status: Loan['status']): Promise<Loan[]> {
  const { data, error } = await supabaseServer
    .from('loan')
    .select('*, customer(name, email), manager(name)')
    .eq('status', status)
    .order('application_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}