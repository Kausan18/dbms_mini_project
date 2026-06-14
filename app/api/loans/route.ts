import { applyForLoan } from '@/services/loan.service'
import { successResponse, errorResponse } from '@/lib/response'
import { LoanType } from '@/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_id, loan_amount, interest_rate, loan_type } = body

    if (!customer_id || !loan_amount || !interest_rate || !loan_type) {
      return errorResponse('customer_id, loan_amount, interest_rate and loan_type are required')
    }

    const validTypes: LoanType[] = ['personal', 'home', 'education', 'vehicle', 'business']
    if (!validTypes.includes(loan_type)) {
      return errorResponse('Invalid loan_type')
    }

    const loan = await applyForLoan(customer_id, loan_amount, interest_rate, loan_type)
    return successResponse(loan, 201)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}