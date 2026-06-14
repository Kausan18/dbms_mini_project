// app/api/transactions/deposit/route.ts
import { NextRequest } from 'next/server'
import { deposit } from '@/services/transaction.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { account_no, amount, description } = body

    if (!account_no || !amount) return errorResponse('account_no and amount are required', 400)
    if (typeof amount !== 'number' || amount <= 0) return errorResponse('amount must be a positive number', 400)

    console.error('DEPOSIT ERROR:', ) // keep this temporarily
    const result = await deposit(account_no, amount, description)
    return successResponse(result, 201)
  } catch (err: unknown) {
    console.error('DEPOSIT ERROR:', err)
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}