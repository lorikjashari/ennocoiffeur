'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Scissors, 
  TrendingUp,
  LogOut,
  UserPlus,
  ClipboardList,
  Settings
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const chartData = stats?.appointmentsByDay 
    ? Object.entries(stats.appointmentsByDay).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('fr-CH', { month: 'short', day: 'numeric' }),
        appointments: count
      }))
    : []

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
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
                <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => router.push('/admin/users')}
            className="h-auto py-4 btn-secondary"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Create User
          </Button>
          <Button 
            onClick={() => router.push('/admin/manage-users')}
            className="h-auto py-4 btn-primary"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </Button>
          <Button 
            onClick={() => router.push('/admin/appointments')}
            className="h-auto py-4"
            variant="outline"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Appointments
          </Button>
          <Button 
            onClick={() => router.push('/admin/services')}
            className="h-auto py-4"
            variant="outline"
          >
            <Scissors className="h-5 w-5 mr-2" />
            Services
          </Button>
          <Button 
            onClick={() => router.push('/admin/barbers')}
            className="h-auto py-4"
            variant="outline"
          >
            <Settings className="h-5 w-5 mr-2" />
            Barbers
          </Button>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                From confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered clients
              </p>
            </CardContent>
          </Card>

          <Card className="glass card-hover animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Barbers</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBarbers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active barbers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments Over Time</CardTitle>
              <CardDescription>Daily appointment count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="appointments" stroke="#D4AF37" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Most booked barber and service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gold/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Most Booked Barber</p>
                  <p className="text-lg font-bold">{stats?.mostBookedBarber?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">{stats?.mostBookedBarber?.count || 0}</p>
                  <p className="text-xs text-muted-foreground">appointments</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gold/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Most Popular Service</p>
                  <p className="text-lg font-bold">{stats?.mostPopularService?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">{stats?.mostPopularService?.count || 0}</p>
                  <p className="text-xs text-muted-foreground">bookings</p>
                </div>
              </div>

              {stats?.peakHours && stats.peakHours.length > 0 && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Peak Hours</p>
                  <div className="flex gap-2">
                    {stats.peakHours.map((peak: any) => (
                      <div key={peak.hour} className="flex-1 text-center">
                        <p className="text-lg font-bold">{peak.hour}:00</p>
                        <p className="text-xs text-muted-foreground">{peak.count} bookings</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
