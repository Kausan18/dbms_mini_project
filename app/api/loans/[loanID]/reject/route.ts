import { rejectLoan } from '@/services/loan.service'
import { createAuditLog } from '@/services/audit.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function PUT(req: Request, { params }: { params: Promise<{ loanID: string }> }) {
  try {
    const { loanID } = await params
    const body = await req.json()
    const { manager_id } = body

    if (!manager_id) return errorResponse('manager_id is required')

    const loan = await rejectLoan(loanID, manager_id)
    await createAuditLog(manager_id, 'LOAN_REJECTED', 'loan', loanID)
    return successResponse(loan)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}