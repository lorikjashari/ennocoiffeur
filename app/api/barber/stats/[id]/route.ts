import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const barberId = params.id
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    
    const today = new Date()
    let startDate = new Date()
    
    if (period === 'day') {
      startDate = today
    } else if (period === 'week') {
      startDate.setDate(today.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(today.getMonth() - 1)
    }

    // Get barber's appointments
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(name, price)
      `)
      .eq('barber_id', barberId)
      .gte('date', startDate.toISOString().split('T')[0])
      .neq('status', 'canceled')

    if (error) throw error

    const appts = (appointments ?? []) as any[]
    const totalAppointments = appts.length
    const totalRevenue = appts.reduce((sum, apt) => sum + (apt.service?.price || 0), 0) || 0

    // Most selected service
    const serviceCounts: { [key: string]: number } = {}
    appts.forEach((apt: any) => {
      const serviceName = apt.service?.name || 'Unknown'
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
    })

    const mostSelectedService = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }))[0] || null

    return NextResponse.json({
      totalAppointments,
      totalRevenue,
      mostSelectedService,
      appointmentsByDay: appts.reduce((acc: any, apt: any) => {
        const date = apt.date as string
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as { [key: string]: number })
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch barber statistics' },
      { status: 500 }
    )
  }
}
