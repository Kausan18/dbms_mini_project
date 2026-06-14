import { getAllTransactions } from '@/services/transaction.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const transactions = await getAllTransactions()
    return successResponse(transactions)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}