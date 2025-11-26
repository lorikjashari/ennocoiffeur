import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const barberId = searchParams.get('barberId')

    if (!barberId) {
      return NextResponse.json(
        { error: 'Barber ID is required' },
        { status: 400 }
      )
    }

    const { data: barber, error } = await supabase
      .from('barbers')
      .select('id, working_hours, break_times, blocked_days, user:users(name, email)')
      .eq('id', barberId)
      .single()

    if (error || !barber) {
      return NextResponse.json(
        { error: 'Barber not found', details: error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      barber,
      workingHourType: typeof barber.working_hours,
      workingHourKeys: barber.working_hours ? Object.keys(barber.working_hours) : []
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch barber', details: String(error) },
      { status: 500 }
    )
  }
}
