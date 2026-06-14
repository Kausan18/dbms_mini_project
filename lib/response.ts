// lib/response.ts
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export function successResponse<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { success: true, data }
  return NextResponse.json(body, { status })
}

export function errorResponse(message: string, status = 400) {
  const body: ApiResponse = { success: false, error: message }
  return NextResponse.json(body, { status })
}