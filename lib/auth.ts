import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

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

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }

    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as 'admin' | 'barber' | 'client',
      photo_url: user.photo_url
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

  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      name,
      email,
      password_hash: passwordHash,
      phone,
      role
    })
    .select()
    .single()

  if (userError) throw userError

  // Create role-specific record
  if (role === 'barber') {
    const { error: barberError } = await supabase
      .from('barbers')
      .insert({
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
      })
    if (barberError) throw barberError
  } else if (role === 'client') {
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        loyalty_points: 0
      })
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
