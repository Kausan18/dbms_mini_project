// services/account.service.ts
import { supabaseServer } from '@/lib/supabase'
import { Account, AccountType } from '@/types'

export async function createAccount(customerId: string, accountType: AccountType): Promise<Account> {
  const { data, error } = await supabaseServer
    .from('account')
    .insert({ customer_id: customerId, account_type: accountType, balance: 0, status: 'active' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getAccountByNo(accountNo: string): Promise<Account | null> {
  const { data, error } = await supabaseServer
    .from('account')
    .select('*')
    .eq('account_no', accountNo)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getAccountsByCustomer(customerId: string): Promise<Account[]> {
  const { data, error } = await supabaseServer
    .from('account')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllAccounts(): Promise<Account[]> {
  const { data, error } = await supabaseServer
    .from('account')
    .select('*, customer(name, email)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateAccountStatus(accountNo: string, status: Account['status']): Promise<Account> {
  const { data, error } = await supabaseServer
    .from('account')
    .update({ status })
    .eq('account_no', accountNo)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}