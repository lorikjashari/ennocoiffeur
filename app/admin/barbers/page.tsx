'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Settings } from 'lucide-react'

export default function BarbersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [barbers, setBarbers] = useState<any[]>([])
  const [selectedBarber, setSelectedBarber] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [workingHours, setWorkingHours] = useState<any>({})

  useEffect(() => {
    fetchBarbers()
  }, [])

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

  const handleEditSchedule = (barber: any) => {
    setSelectedBarber(barber)
    setWorkingHours(barber.working_hours || {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '16:00' },
      sunday: null
    })
    setIsOpen(true)
  }

  const handleSaveSchedule = async () => {
    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBarber.id,
          working_hours: workingHours
        })
      })

      if (response.ok) {
        toast({
          title: 'Schedule updated',
          description: 'Barber schedule has been updated successfully'
        })
        setIsOpen(false)
        fetchBarbers()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive'
      })
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div className="min-h-screen gradient-dark p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/logo.png"
            alt="ENNO COIFFEUR"
            width={48}
            height={48}
            className="hover-scale"
          />
          <div>
            <h1 className="text-3xl font-bold text-gradient">Barbers</h1>
            <p className="text-gray-400">Manage barber schedules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-white font-bold">{barber.user?.name?.[0]}</span>
                  </div>
                  {barber.user?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Email:</span> {barber.user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Phone:</span> {barber.user?.phone || 'N/A'}
                  </p>
                </div>
                <Button
                  onClick={() => handleEditSchedule(barber)}
                  className="w-full bg-gold hover:bg-gold-dark"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {barbers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No barbers found</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Manage Schedule - {selectedBarber?.user?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="capitalize">{day}</Label>
                  <div className="col-span-2 flex gap-2 items-center">
                    <Input
                      type="time"
                      value={workingHours[day]?.start || ''}
                      onChange={(e) => setWorkingHours({
                        ...workingHours,
                        [day]: workingHours[day] 
                          ? { ...workingHours[day], start: e.target.value }
                          : { start: e.target.value, end: '18:00' }
                      })}
                      placeholder="Start"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={workingHours[day]?.end || ''}
                      onChange={(e) => setWorkingHours({
                        ...workingHours,
                        [day]: workingHours[day]
                          ? { ...workingHours[day], end: e.target.value }
                          : { start: '09:00', end: e.target.value }
                      })}
                      placeholder="End"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWorkingHours({
                        ...workingHours,
                        [day]: null
                      })}
                    >
                      Off
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleSaveSchedule}
                className="w-full bg-gold hover:bg-gold-dark mt-4"
              >
                Save Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
