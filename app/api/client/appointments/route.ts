import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(*),
        barber:barbers(id, user:users(name, phone, email))
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) throw error

    return NextResponse.json({ appointments })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    // Get appointment to check time
    const { data: appointment } = await supabase
      .from('appointments')
      .select('date, start_time')
      .eq('id', id)
      .single()

    if (appointment) {
      const appt = appointment as any
      const appointmentDateTime = new Date(`${appt.date}T${appt.start_time}`)
      const now = new Date()
      const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursDifference < 2) {
        return NextResponse.json(
          { error: 'Cannot cancel appointment less than 2 hours before start time' },
          { status: 400 }
        )
      }
    }

    const { error } = await (supabase as any)
      .from('appointments')
      .update({ status: 'canceled' })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
