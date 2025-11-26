'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Calendar, Scissors, User, Clock } from 'lucide-react'
import { formatCurrency, addMinutesToTime } from '@/lib/utils'

export default function BookAppointmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [clientId, setClientId] = useState<string>('')
  const [services, setServices] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [selectedService, setSelectedService] = useState('')
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchClientId(parsedUser.id)
    }
    fetchServices()
    fetchBarbers()
  }, [])

  useEffect(() => {
    if (selectedBarber && selectedDate && selectedService) {
      fetchAvailableSlots()
    }
  }, [selectedBarber, selectedDate, selectedService])

  const fetchClientId = async (userId: string) => {
    try {
      const response = await fetch(`/api/client/get-client-id?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setClientId(data.clientId)
      } else {
        toast({
          title: 'Error',
          description: 'Client profile not found. Please contact admin.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to fetch client ID:', error)
      toast({
        title: 'Error',
        description: 'Failed to load client information',
        variant: 'destructive'
      })
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
  }

  const fetchBarbers = async () => {
    try {
      const response = await fetch('/api/admin/barbers')
      if (response.ok) {
        const data = await response.json()
        setBarbers(data.barbers)
      }
    } catch (error) {
      console.error('Failed to fetch barbers:', error)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const service = services.find(s => s.id === selectedService)
      const duration = service?.duration_minutes || 30

      const response = await fetch(
        `/api/client/available-slots?barberId=${selectedBarber}&date=${selectedDate}&duration=${duration}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.slots)
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error)
      setAvailableSlots([])
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !clientId) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      const service = services.find(s => s.id === selectedService)
      const endTime = addMinutesToTime(selectedTime, service.duration_minutes)

      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barber_id: selectedBarber,
          client_id: clientId,
          service_id: selectedService,
          date: selectedDate,
          start_time: selectedTime,
          end_time: endTime,
          status: 'pending'
        })
      })

      if (response.ok) {
        toast({
          title: 'Appointment booked!',
          description: 'Your appointment has been created successfully'
        })
        router.push('/client/dashboard')
      } else {
        const error = await response.json()
        toast({
          title: 'Booking failed',
          description: error.error || 'Failed to book appointment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  return (
    <div className="min-h-screen gradient-dark p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="glass card-hover animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="ENNO COIFFEUR"
                width={48}
                height={48}
                className="hover-scale"
              />
              <div>
                <CardTitle className="text-2xl text-gradient flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-white" />
                  Book an Appointment
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">Select your preferred service and time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Select Service */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Step 1: Choose a Service
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'ring-2 ring-white bg-white/5'
                        : 'hover:bg-white/5 border-white/10'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                      <p className="text-white font-bold mt-1">{formatCurrency(service.price)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Step 2: Select Barber */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Step 2: Choose a Barber
              </Label>
              <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a barber" />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.user?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 3: Select Date */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Step 3: Choose a Date
              </Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 4: Select Time */}
            {selectedBarber && selectedDate && selectedService && (
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Step 4: Choose a Time
                </Label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? 'default' : 'outline'}
                        className={selectedTime === slot ? 'bg-white text-black hover:bg-white/90' : ''}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-white/5 rounded-lg border border-white/10">
                    No available time slots for this date
                  </p>
                )}
              </div>
            )}

            {/* Booking Summary */}
            {selectedService && selectedBarber && selectedDate && selectedTime && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Service:</span>{' '}
                    <span className="font-medium">{selectedServiceData?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Barber:</span>{' '}
                    <span className="font-medium">
                      {barbers.find(b => b.id === selectedBarber)?.user?.name}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Date:</span>{' '}
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time:</span>{' '}
                    <span className="font-medium">{selectedTime}</span>
                  </p>
                  <p className="text-lg font-bold text-white pt-2 border-t border-white/20">
                    Total: {formatCurrency(selectedServiceData?.price || 0)}
                  </p>
                </div>
              </div>
            )}

            {/* Book Button */}
            <Button
              onClick={handleBooking}
              disabled={!selectedService || !selectedBarber || !selectedDate || !selectedTime || isLoading}
              className="w-full bg-gold hover:bg-gold-dark h-12 text-lg"
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
