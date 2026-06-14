import { getLoansByStatus } from '@/services/loan.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const loans = await getLoansByStatus('approved')
    return successResponse(loans)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}