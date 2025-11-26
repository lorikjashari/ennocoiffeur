import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month
    
    const today = new Date()
    let startDate = new Date()
    
    if (period === 'day') {
      startDate = today
    } else if (period === 'week') {
      startDate.setDate(today.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(today.getMonth() - 1)
    }

    // Get all appointments for the period
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(price),
        barber:barbers(user:users(name))
      `)
      .gte('date', startDate.toISOString().split('T')[0])
      .neq('status', 'canceled')

    if (error) throw error

    // Calculate statistics
    const totalAppointments = appointments?.length || 0
    const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.service?.price || 0), 0) || 0
    
    // Most booked barber
    const barberCounts: { [key: string]: { name: string; count: number } } = {}
    appointments?.forEach(apt => {
      const barberName = apt.barber?.user?.name || 'Unknown'
      if (!barberCounts[barberName]) {
        barberCounts[barberName] = { name: barberName, count: 0 }
      }
      barberCounts[barberName].count++
    })
    
    const mostBookedBarber = Object.values(barberCounts)
      .sort((a, b) => b.count - a.count)[0] || null

    // Get service statistics
    const { data: serviceStats } = await supabase
      .from('appointments')
      .select(`
        service_id,
        service:services(name)
      `)
      .gte('date', startDate.toISOString().split('T')[0])
      .neq('status', 'canceled')

    const serviceCounts: { [key: string]: number } = {}
    serviceStats?.forEach(apt => {
      const serviceName = apt.service?.name || 'Unknown'
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
    })

    const mostPopularService = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }))[0] || null

    // Get total users
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    const { count: totalBarbers } = await supabase
      .from('barbers')
      .select('*', { count: 'exact', head: true })

    // Peak hours analysis
    const hourCounts: { [key: number]: number } = {}
    appointments?.forEach(apt => {
      const hour = parseInt(apt.start_time.split(':')[0])
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const peakHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))

    return NextResponse.json({
      totalAppointments,
      totalRevenue,
      totalClients,
      totalBarbers,
      mostBookedBarber,
      mostPopularService,
      peakHours,
      appointmentsByDay: appointments?.reduce((acc, apt) => {
        const date = apt.date
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as { [key: string]: number })
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
