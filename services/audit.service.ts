// services/audit.service.ts
import { supabaseServer } from '@/lib/supabase'
import { AuditLog } from '@/types'

export async function createAuditLog(
  adminId: string,
  action: string,
  tableName: string,
  recordId?: string
): Promise<void> {
  const { error } = await supabaseServer
    .from('audit_log')
    .insert({
      admin_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId ?? null,
    })

  if (error) console.error('Audit log failed:', error.message)
  // Non-throwing — audit failure should never break the main operation
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabaseServer
    .from('audit_log')
    .select('*, admin(name, email)')
    .order('timestamp', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}