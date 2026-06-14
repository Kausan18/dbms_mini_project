import { getLoansByCustomer } from '@/services/loan.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(_req: Request, { params }: { params: Promise<{ customerID: string }> }) {
  try {
    const { customerID } = await params
    const loans = await getLoansByCustomer(customerID)
    return successResponse(loans)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}