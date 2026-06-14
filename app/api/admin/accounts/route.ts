import { getAllAccounts } from '@/services/account.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const accounts = await getAllAccounts()
    return successResponse(accounts)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}