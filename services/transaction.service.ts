// services/transaction.service.ts
import { supabaseServer } from '@/lib/supabase'
import { Transaction, Transfer } from '@/types'

export async function deposit(accountNo: string, amount: number, description?: string) {
  const { data, error } = await supabaseServer
    .rpc('process_transaction', {
      p_account_no: accountNo,
      p_type: 'deposit',
      p_amount: amount,
      p_description: description ?? '',
    })

  if (error) throw new Error(error.message)
  if (!data.success) throw new Error(data.error)
  return data
}

export async function withdraw(accountNo: string, amount: number, description?: string) {
  const { data, error } = await supabaseServer
    .rpc('process_transaction', {
      p_account_no: accountNo,
      p_type: 'withdrawal',
      p_amount: amount,
      p_description: description ?? '',
    })

  if (error) throw new Error(error.message)
  if (!data.success) throw new Error(data.error)
  return data
}

export async function transfer(senderAccount: string, receiverAccount: string, amount: number, description?: string): Promise<Transfer> {
  const { data, error } = await supabaseServer
    .rpc('process_transfer', {
      p_sender_account: senderAccount,
      p_receiver_account: receiverAccount,
      p_amount: amount,
      p_description: description ?? null,
    })
    .single()

  if (error) throw new Error(error.message)
  return data as Transfer
}

export async function getTransactionsByAccount(accountNo: string): Promise<Transaction[]> {
  const { data, error } = await supabaseServer
    .from('transaction')
    .select('*')
    .eq('account_no', accountNo)
    .order('transaction_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabaseServer
    .from('transaction')
    .select('*, account(customer_id)')
    .order('transaction_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}