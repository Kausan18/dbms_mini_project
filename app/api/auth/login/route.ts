// app/api/auth/login/route.ts
import { supabaseServer } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return errorResponse('email, password and role are required')
    }

    if (!['customer', 'admin', 'manager'].includes(role)) {
      return errorResponse('role must be one of: customer, admin, manager')
    }

    let profile: Record<string, unknown> | null = null
    let profileId: string = ''

    if (role === 'customer') {
      const { data, error } = await supabaseServer
        .from('customer')
        .select('*')
        .eq('email', email)
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) return errorResponse('No customer account found with this email', 401)
      profile = data
      profileId = data.customer_id
    } else if (role === 'admin') {
      const { data, error } = await supabaseServer
        .from('admin')
        .select('*')
        .eq('email', email)
        .eq('password', password) // plain match — auth module replaces this
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) return errorResponse('Invalid email or password', 401)
      profile = data
      profileId = data.admin_id
    } else {
      const { data, error } = await supabaseServer
        .from('manager')
        .select('*')
        .eq('email', email)
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) return errorResponse('No manager account found with this email', 401)
      profile = data
      profileId = data.manager_id
    }

    // Strip password from response
    if (profile && 'password' in profile) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...safeProfile } = profile as Record<string, unknown>
      profile = safeProfile
    }

    return successResponse({
      role,
      profile_id: profileId,
      profile,
    })
  } catch (err: unknown) {
    return errorResponse(err instanceof Error ? err.message : 'Login failed', 500)
  }
}
