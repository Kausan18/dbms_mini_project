import { getLoansByStatus } from '@/services/loan.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    if (status === 'approved') {
      return successResponse(await getLoansByStatus('approved'))
    } else if (status === 'rejected') {
      return successResponse(await getLoansByStatus('rejected'))
    } else {
      // default — return all statuses combined
      const [pending, approved, rejected] = await Promise.all([
        getLoansByStatus('pending'),
        getLoansByStatus('approved'),
        getLoansByStatus('rejected'),
      ])
      return successResponse({ pending, approved, rejected })
    }
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}