import { getCustomerById, updateCustomer, deleteCustomer } from '@/services/customer.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(_req: Request, { params }: { params: Promise<{ customerID: string }> }) {
  try {
    const { customerID } = await params
    const customer = await getCustomerById(customerID)
    if (!customer) return errorResponse('Customer not found', 404)
    return successResponse(customer)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ customerID: string }> }) {
  try {
    const { customerID } = await params
    const body = await req.json()
    const customer = await updateCustomer(customerID, body)
    return successResponse(customer)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ customerID: string }> }) {
  try {
    const { customerID } = await params
    await deleteCustomer(customerID)
    return successResponse({ message: 'Customer deleted successfully' })
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}