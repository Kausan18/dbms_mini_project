// app/api/auth/signup/route.ts
import { supabaseServer } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, address, password, role } = body

    const phoneRequired = role !== 'admin'
   if (!name || !email || !password || !role || (phoneRequired && !phone)) {
  return errorResponse('name, email, phone, password and role are required')
}

    if (!['customer', 'admin', 'manager'].includes(role)) {
      return errorResponse('role must be one of: customer, admin, manager')
    }

    // Check email doesn't already exist in the chosen role's table
    const table = role === 'customer' ? 'customer' : role === 'admin' ? 'admin' : 'manager'
    const { data: existing } = await supabaseServer.from(table).select('email').eq('email', email).maybeSingle()
    if (existing) return errorResponse('An account with this email already exists for this role')

    let profileId: string
    let profileData: Record<string, unknown>

    if (role === 'customer') {
      const { data, error } = await supabaseServer
        .from('customer')
        .insert({ name, email, phone, address: address || '' })
        .select()
        .single()
      if (error) throw new Error(error.message)
      profileId = data.customer_id
      profileData = data
    } else if (role === 'admin') {
      const { data, error } = await supabaseServer
        .from('admin')
        .insert({ name, email}) // password stored as-is for now (auth added later)
        .select()
        .single()
      if (error) throw new Error(error.message)
      profileId = data.admin_id
      profileData = data
    } else {
      const { data, error } = await supabaseServer
        .from('manager')
        .insert({ name, email, phone })
        .select()
        .single()
      if (error) throw new Error(error.message)
      profileId = data.manager_id
      profileData = data
    }

    return successResponse(
      {
        role,
        profile_id: profileId,
        profile: profileData,
      },
      201
    )
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'Signup failed', 500)
  }
}
