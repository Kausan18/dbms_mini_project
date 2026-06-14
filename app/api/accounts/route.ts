import { createAccount } from '@/services/account.service'
import { successResponse, errorResponse } from '@/lib/response'
import { AccountType } from '@/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_id, account_type } = body

    if (!customer_id || !account_type) {
      return errorResponse('customer_id and account_type are required')
    }

    const validTypes: AccountType[] = ['savings', 'checking', 'current']
    if (!validTypes.includes(account_type)) {
      return errorResponse('account_type must be savings, checking, or current')
    }

    const account = await createAccount(customer_id, account_type)
    return successResponse(account, 201)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}