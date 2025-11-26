'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, Scissors, LogOut, Clock, User } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

export default function BarberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [barberId, setBarberId] = useState<string>('')
  const [stats, setStats] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchBarberData(parsedUser.id)
    }
  }, [period])

  const fetchBarberData = async (userId: string) => {
    try {
      // Get barber ID from user ID
      const barberResponse = await fetch('/api/admin/barbers')
      if (barberResponse.ok) {
        const { barbers } = await barberResponse.json()
        const barber = barbers.find((b: any) => b.user.id === userId)
        if (barber) {
          setBarberId(barber.id)
          fetchStats(barber.id)
          fetchAppointments(barber.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch barber data:', error)
    }
  }

  const fetchStats = async (bId: string) => {
    try {
      const response = await fetch(`/api/barber/stats/${bId}?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchAppointments = async (bId: string) => {
    try {
      const response = await fetch(`/api/admin/appointments?barberId=${bId}`)
      if (response.ok) {
        const data = await response.json()
        const all = (data.appointments || [])
          .filter((apt: any) => apt.status !== 'canceled')
          .sort((a: any, b: any) => (
            new Date(`${a.date}T${a.start_time}`).getTime() - new Date(`${b.date}T${b.start_time}`).getTime()
          ))
        setAppointments(all)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (response.ok && barberId) {
        fetchAppointments(barberId)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
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
                <h1 className="text-2xl font-bold text-gradient">Barber Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-white/20 hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={period === 'day' ? 'default' : 'outline'}
            onClick={() => setPeriod('day')}
            size="sm"
          >
            Today
          </Button>
          <Button 
            variant={period === 'week' ? 'default' : 'outline'}
            onClick={() => setPeriod('week')}
            size="sm"
          >
            This Week
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'}
            onClick={() => setPeriod('month')}
            size="sm"
          >
            This Month
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">
                {period === 'day' ? 'Today' : period === 'week' ? 'This week' : 'This month'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                From completed bookings
              </p>
            </CardContent>
          </Card>

          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular Service</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{stats?.mostSelectedService?.name || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.mostSelectedService?.count || 0} bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Calendar className="h-5 w-5 text-white" />
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
                    <div className="text-right">
                      <p className="font-medium flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {appointment.client?.user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment.service?.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Complete
                        </Button>
                      )}
                      {appointment.status !== 'canceled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, 'canceled')}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming appointments
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
