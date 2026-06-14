import { getAuditLogs } from '@/services/audit.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const logs = await getAuditLogs()
    return successResponse(logs)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}