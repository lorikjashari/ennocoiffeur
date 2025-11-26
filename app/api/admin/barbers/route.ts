import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: barbers, error } = await supabase
      .from('barbers')
      .select(`
        id,
        working_hours,
        break_times,
        blocked_days,
        user:users!barbers_user_id_fkey(id, name, email, phone, photo_url)
      `)

    if (error) throw error

    // Transform user array to single object
    const transformedBarbers = (barbers ?? []).map((barber: any) => ({
      ...barber,
      user: Array.isArray(barber.user) ? barber.user[0] : barber.user
    }))

    return NextResponse.json({ barbers: transformedBarbers })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch barbers' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, working_hours, break_times, blocked_days } = await request.json()

    const updateData: any = {}
    if (working_hours !== undefined) updateData.working_hours = working_hours
    if (break_times !== undefined) updateData.break_times = break_times
    if (blocked_days !== undefined) updateData.blocked_days = blocked_days

    const { data: barber, error } = await (supabase as any)
      .from('barbers')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        working_hours,
        break_times,
        blocked_days,
        user:users(id, name, email, phone)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ barber })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update barber' },
      { status: 500 }
    )
  }
}
