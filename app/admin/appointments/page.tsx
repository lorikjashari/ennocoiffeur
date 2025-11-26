'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

export default function AppointmentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (response.ok) {
        toast({
          title: 'Status updated',
          description: `Appointment status changed to ${status}`
        })
        fetchAppointments()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Appointment deleted',
          description: 'Appointment has been deleted successfully'
        })
        fetchAppointments()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete appointment',
        variant: 'destructive'
      })
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
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
    <div className="min-h-screen gradient-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="ENNO COIFFEUR"
              width={48}
              height={48}
              className="hover-scale"
            />
            <div>
              <h1 className="text-3xl font-bold text-gradient">Appointments</h1>
              <p className="text-gray-400">View and manage all appointments</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="glass">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{appointment.client?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.client?.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{appointment.barber?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">Barber</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">{appointment.service?.name}</p>
                    <p className="text-sm text-white font-semibold">
                      {formatCurrency(appointment.service?.price)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-center ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <Select
                      value={appointment.status}
                      onValueChange={(status) => handleStatusChange(appointment.id, status)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No appointments found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
