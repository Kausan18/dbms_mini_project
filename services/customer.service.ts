// services/customer.service.ts
import { supabaseServer } from '@/lib/supabase'
import { Customer } from '@/types'

export async function getCustomerById(customerId: string): Promise<Customer | null> {
  const { data, error } = await supabaseServer
    .from('customer')
    .select('*')
    .eq('customer_id', customerId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createCustomer(payload: Omit<Customer, 'customer_id' | 'created_at'>): Promise<Customer> {
  const { data, error } = await supabaseServer
    .from('customer')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCustomer(customerId: string, payload: Partial<Omit<Customer, 'customer_id' | 'created_at'>>): Promise<Customer> {
  const { data, error } = await supabaseServer
    .from('customer')
    .update(payload)
    .eq('customer_id', customerId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const { error } = await supabaseServer
    .from('customer')
    .delete()
    .eq('customer_id', customerId)

  if (error) throw new Error(error.message)
}

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabaseServer
    .from('customer')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}