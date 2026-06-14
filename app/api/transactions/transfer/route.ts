import { transfer } from '@/services/transaction.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sender_account, receiver_account, amount, description } = body

    if (!sender_account || !receiver_account || !amount) {
      return errorResponse('sender_account, receiver_account and amount are required')
    }
    if (typeof amount !== 'number' || amount <= 0) return errorResponse('amount must be a positive number')
    if (sender_account === receiver_account) return errorResponse('sender and receiver cannot be the same account')

    const result = await transfer(sender_account, receiver_account, amount, description)
    return successResponse(result, 201)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}