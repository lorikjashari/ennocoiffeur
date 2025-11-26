import bcrypt from 'bcryptjs'
import { supabase } from './supabase'
import type { Database } from './database.types'

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'admin' | 'barber' | 'client'
  photo_url: string | null
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid email or password' }
    }

    const u = user as any
    const isValid = await bcrypt.compare(password, u.password_hash)
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }

    const userData: User = {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role as 'admin' | 'barber' | 'client',
      photo_url: u.photo_url
    }

    return { success: true, user: userData }
  } catch (error) {
    return { success: false, error: 'Login failed' }
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  phone: string,
  role: 'admin' | 'barber' | 'client'
) {
  const passwordHash = await bcrypt.hash(password, 10)

  const { data: user, error: userError } = await (supabase as any)
    .from('users')
    .insert([
      {
        name,
        email,
        password_hash: passwordHash,
        phone,
        role
      } satisfies Database['public']['Tables']['users']['Insert']
    ])
    .select()
    .single()

  if (userError) throw userError

  // Create role-specific record
  if (role === 'barber') {
    const { error: barberError } = await (supabase as any)
      .from('barbers')
      .insert([
        {
          user_id: user.id,
          working_hours: {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' },
            saturday: { start: '09:00', end: '16:00' },
            sunday: null
          },
          break_times: [],
          blocked_days: []
        } satisfies Database['public']['Tables']['barbers']['Insert']
      ])
    if (barberError) throw barberError
  } else if (role === 'client') {
    const { error: clientError } = await (supabase as any)
      .from('clients')
      .insert([
        {
          user_id: user.id,
          loyalty_points: 0
        } satisfies Database['public']['Tables']['clients']['Insert']
      ])
    if (clientError) throw clientError
  }

  return user
}

export function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'barber':
      return '/barber/dashboard'
    case 'client':
      return '/client/dashboard'
    default:
      return '/login'
  }
}
