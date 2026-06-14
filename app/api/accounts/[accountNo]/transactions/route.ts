import { getTransactionsByAccount } from '@/services/transaction.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(_req: Request, { params }: { params: Promise<{ accountNo: string }> }) {
  try {
    const { accountNo } = await params
    const transactions = await getTransactionsByAccount(accountNo)
    return successResponse(transactions)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}