import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const barberId = searchParams.get('barberId')

    let query = supabase
      .from('appointments')
      .select(`
        *,
        service:services(*),
        barber:barbers(id, user:users(*)),
        client:clients(id, user:users(*))
      `)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (barberId) {
      query = query.eq('barber_id', barberId)
    }

    const { data: appointments, error } = await query

    if (error) throw error

    return NextResponse.json({ appointments })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { barber_id, client_id, service_id, date, start_time, end_time, status, notes } = await request.json()

    // Check for overlapping appointments
    const { data: overlapping } = await supabase
      .from('appointments')
      .select('*')
      .eq('barber_id', barber_id)
      .eq('date', date)
      .neq('status', 'canceled')
      .or(`and(start_time.lte.${start_time},end_time.gt.${start_time}),and(start_time.lt.${end_time},end_time.gte.${end_time})`)

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        barber_id,
        client_id,
        service_id,
        date,
        start_time,
        end_time,
        status: status || 'pending',
        notes
      })
      .select(`
        *,
        service:services(*),
        barber:barbers(id, user:users(*)),
        client:clients(id, user:users(*))
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ appointment })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, notes, date, start_time, end_time } = await request.json()

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (date !== undefined) updateData.date = date
    if (start_time !== undefined) updateData.start_time = start_time
    if (end_time !== undefined) updateData.end_time = end_time

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        service:services(*),
        barber:barbers(id, user:users(*)),
        client:clients(id, user:users(*))
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ appointment })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
