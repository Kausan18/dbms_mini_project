import { getAccountsByCustomer } from '@/services/account.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(_req: Request, { params }: { params: Promise<{ customerID: string }> }) {
  try {
    const { customerID } = await params
    const accounts = await getAccountsByCustomer(customerID)
    return successResponse(accounts)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}