import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const barberId = searchParams.get('barberId')
    const date = searchParams.get('date')
    const serviceDuration = parseInt(searchParams.get('duration') || '30')

    if (!barberId || !date) {
      return NextResponse.json(
        { error: 'Barber ID and date are required' },
        { status: 400 }
      )
    }

    // Get barber's working hours
    const { data: barber } = await supabase
      .from('barbers')
      .select('working_hours, break_times, blocked_days')
      .eq('id', barberId)
      .single()

    if (!barber) {
      return NextResponse.json(
        { error: 'Barber not found' },
        { status: 404 }
      )
    }

    // Fix date parsing - use UTC to avoid timezone issues
    const dateObj = new Date(date + 'T12:00:00Z')
    // Compute weekday in lowercase string: 'monday', 'tuesday', ...
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' })
      .format(dateObj)
      .toLowerCase()
    const b = barber as any
    const workingHours = b.working_hours as any
    
    console.log('Date:', date, 'Day:', dayOfWeek, 'Working Hours keys:', workingHours ? Object.keys(workingHours) : [])
    
    if (!workingHours || !workingHours[dayOfWeek] || workingHours[dayOfWeek] === null) {
      return NextResponse.json({
        slots: [],
        debug: {
          date,
          dayOfWeek,
          hasWorkingHours: !!workingHours,
          workingHourKeys: workingHours ? Object.keys(workingHours) : []
        }
      })
    }

    // Check if day is blocked
    const blockedDays = (b.blocked_days as string[]) || []
    if (blockedDays.includes(date)) {
      return NextResponse.json({ slots: [] })
    }

    const daySchedule = workingHours[dayOfWeek]
    const startHour = parseInt(daySchedule.start.split(':')[0])
    const startMinute = parseInt(daySchedule.start.split(':')[1])
    const endHour = parseInt(daySchedule.end.split(':')[0])
    const endMinute = parseInt(daySchedule.end.split(':')[1])

    // Get existing appointments for this barber on this date
    const { data: appointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('barber_id', barberId)
      .eq('date', date)
      .neq('status', 'canceled')

    const appts = (appointments ?? []) as any[]
    const bookedSlots = new Set(
      appts.map(apt => apt.start_time) || []
    )

    // Determine if selected date is today (use local server date)
    const todayStr = new Date().toISOString().split('T')[0]
    const isToday = date === todayStr
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    // Generate time slots
    const slots: string[] = []
    let currentHour = startHour
    let currentMinute = startMinute

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
      
      // Check if this slot would overlap with any existing appointment
      const slotEndMinutes = currentHour * 60 + currentMinute + serviceDuration
      const slotEndHour = Math.floor(slotEndMinutes / 60)
      const slotEndMinute = slotEndMinutes % 60
      
      let isAvailable = true
      
      // Check against all booked appointments
      appts.forEach((apt: any) => {
        const aptStartMinutes = parseInt(apt.start_time.split(':')[0]) * 60 + parseInt(apt.start_time.split(':')[1])
        const aptEndMinutes = parseInt(apt.end_time.split(':')[0]) * 60 + parseInt(apt.end_time.split(':')[1])
        const currentSlotMinutes = currentHour * 60 + currentMinute
        
        // Check for overlap
        if (
          (currentSlotMinutes >= aptStartMinutes && currentSlotMinutes < aptEndMinutes) ||
          (slotEndMinutes > aptStartMinutes && slotEndMinutes <= aptEndMinutes) ||
          (currentSlotMinutes <= aptStartMinutes && slotEndMinutes >= aptEndMinutes)
        ) {
          isAvailable = false
        }
      })

      // Check if slot end time is within working hours
      if (slotEndHour > endHour || (slotEndHour === endHour && slotEndMinute > endMinute)) {
        isAvailable = false
      }

      // If booking for today, do not allow past times
      const slotStartMinutes = currentHour * 60 + currentMinute
      if (isToday && slotStartMinutes <= nowMinutes) {
        isAvailable = false
      }

      if (isAvailable) {
        slots.push(timeSlot)
      }

      // Move to next 15-minute slot
      currentMinute += 15
      if (currentMinute >= 60) {
        currentMinute = 0
        currentHour++
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
}
