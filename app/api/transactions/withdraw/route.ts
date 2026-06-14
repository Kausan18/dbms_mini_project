import { withdraw } from '@/services/transaction.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { account_no, amount, description } = body

    if (!account_no || !amount) return errorResponse('account_no and amount are required')
    if (typeof amount !== 'number' || amount <= 0) return errorResponse('amount must be a positive number')

    const transaction = await withdraw(account_no, amount, description)
    return successResponse(transaction, 201)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}