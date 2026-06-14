import { updateCustomer, deleteCustomer } from '@/services/customer.service'
import { createAuditLog } from '@/services/audit.service'
import { successResponse, errorResponse } from '@/lib/response'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { admin_id, ...updateData } = body

    if (!admin_id) return errorResponse('admin_id is required')

    const customer = await updateCustomer(id, updateData)
    await createAuditLog(admin_id, 'CUSTOMER_UPDATED', 'customer', id)
    return successResponse(customer)
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { admin_id } = body

    if (!admin_id) return errorResponse('admin_id is required')

    await deleteCustomer(id)
    await createAuditLog(admin_id, 'CUSTOMER_DELETED', 'customer', id)
    return successResponse({ message: 'Customer deleted successfully' })
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'An unexpected error occurred', 500)
  }
}