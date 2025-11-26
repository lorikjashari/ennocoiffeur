'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, LogOut, Plus, Clock, User, Scissors } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function ClientDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [clientId, setClientId] = useState<string>('')
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchClientData(parsedUser.id)
    }
  }, [])

  const fetchClientData = async (userId: string) => {
    try {
      // Get client ID from user ID
      const response = await fetch('/api/admin/barbers')
      if (response.ok) {
        // Fetch clients through a workaround
        const clientsResponse = await fetch('/api/admin/appointments')
        if (clientsResponse.ok) {
          const { appointments: allApts } = await clientsResponse.json()
          // Find client ID from appointments
          const clientApt = allApts.find((apt: any) => apt.client?.user?.id === userId)
          if (clientApt) {
            setClientId(clientApt.client.id)
            fetchAppointments(clientApt.client.id)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch client data:', error)
    }
  }

  const fetchAppointments = async (cId: string) => {
    try {
      const response = await fetch(`/api/client/appointments?clientId=${cId}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    }
  }

  const handleCancelAppointment = async (id: string, date: string, startTime: string) => {
    const appointmentDateTime = new Date(`${date}T${startTime}`)
    const now = new Date()
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursDifference < 2) {
      toast({
        title: 'Cannot cancel',
        description: 'You cannot cancel an appointment less than 2 hours before start time',
        variant: 'destructive'
      })
      return
    }

    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      const response = await fetch(`/api/client/appointments?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Appointment canceled',
          description: 'Your appointment has been canceled successfully'
        })
        if (clientId) fetchAppointments(clientId)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to cancel appointment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive'
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T${apt.start_time}`)
    return aptDate >= new Date() && apt.status !== 'canceled'
  })

  const pastAppointments = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T${apt.start_time}`)
    return aptDate < new Date() || apt.status === 'canceled'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-white/10 text-white'
    }
  }

  return (
    <div className="min-h-screen gradient-dark">
      <header className="glass-dark border-b border-white/10 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="ENNO COIFFEUR"
                width={48}
                height={48}
                className="hover-scale"
              />
              <div>
                <h1 className="text-2xl font-bold text-gradient">My Appointments</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/client/book')}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-white/20 hover:bg-white/10">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gold/5 to-transparent rounded-lg border border-gold/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-full">
                      <Calendar className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Scissors className="h-4 w-4" />
                        {appointment.service?.name}
                      </p>
                      <p className="text-sm text-white font-semibold">
                        {formatCurrency(appointment.service?.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {appointment.barber?.user?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.status !== 'canceled' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelAppointment(appointment.id, appointment.date, appointment.start_time)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {upcomingAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Button 
                    onClick={() => router.push('/client/book')}
                    className="bg-gold hover:bg-gold-dark"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastAppointments.slice(0, 5).map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg opacity-75 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(appointment.date)}</p>
                        <p className="text-xs text-muted-foreground">{appointment.service?.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
