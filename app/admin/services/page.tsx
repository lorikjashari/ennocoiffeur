'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_minutes: '',
    description: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        ...(editingService && { id: editingService.id })
      }

      const response = await fetch('/api/admin/services', {
        method: editingService ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: editingService ? 'Service updated' : 'Service created',
          description: `${formData.name} has been ${editingService ? 'updated' : 'created'} successfully`
        })
        setIsOpen(false)
        setEditingService(null)
        setFormData({ name: '', price: '', duration_minutes: '', description: '' })
        fetchServices()
      } else {
        throw new Error('Failed to save service')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      description: service.description || ''
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Service deleted',
          description: 'Service has been deleted successfully'
        })
        fetchServices()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      })
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
              <h1 className="text-3xl font-bold text-gradient">Services</h1>
              <p className="text-gray-400">Manage salon services</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (CHF)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="glass">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{service.name}</span>
                  <span className="text-white font-semibold">{formatCurrency(service.price)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description || 'No description'}
                </p>
                <p className="text-sm font-medium mb-4">
                  Duration: {service.duration_minutes} minutes
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No services found. Create your first service!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
