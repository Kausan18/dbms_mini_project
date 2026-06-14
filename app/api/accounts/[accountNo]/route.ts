import { getAccountByNo } from '@/services/account.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(_req: Request, { params }: { params: Promise<{ accountNo: string }> }) {
  try {
    const { accountNo } = await params
    const account = await getAccountByNo(accountNo)
    if (!account) return errorResponse('Account not found', 404)
    return successResponse(account)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}