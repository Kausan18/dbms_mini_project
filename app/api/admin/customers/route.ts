import { getAllCustomers, createCustomer } from '@/services/customer.service'
import { createAuditLog } from '@/services/audit.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const customers = await getAllCustomers()
    return successResponse(customers)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, address, admin_id } = body

    if (!name || !email || !phone) return errorResponse('name, email and phone are required')
    if (!admin_id) return errorResponse('admin_id is required')

    const customer = await createCustomer({ name, email, phone, address })
    await createAuditLog(admin_id, 'CUSTOMER_CREATED', 'customer', customer.customer_id)
    return successResponse(customer, 201)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}