'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Edit, Trash2, Users, Search } from 'lucide-react'

export default function ManageUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [filterRole, setFilterRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client' as 'admin' | 'barber' | 'client'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      console.log('API Response:', data)
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        console.error('Failed to fetch users, status:', response.status, 'error:', data.error)
        setUsers([])
        toast({
          title: 'Error',
          description: data.error || 'Failed to load users',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setUsers([])
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          ...formData
        })
      })

      if (response.ok) {
        toast({
          title: 'User updated',
          description: 'User has been updated successfully'
        })
        setIsEditDialogOpen(false)
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update user',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'User deleted',
          description: `${userName} has been deleted successfully`
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete user',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      barber: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      client: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
    return colors[role as keyof typeof colors] || 'bg-white/10 text-white'
  }

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = q === '' ||
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      (user.phone || '').toLowerCase().includes(q)
    return matchesRole && matchesSearch
  })

  return (
    <div className="min-h-screen gradient-dark p-8">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gradient">Manage Users</h1>
            <p className="text-gray-400">View, edit, and delete users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterRole === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRole('all')}
              className={filterRole === 'all' ? 'btn-primary' : 'btn-ghost'}
            >
              All ({users.length})
            </Button>
            <Button
              variant={filterRole === 'client' ? 'default' : 'outline'}
              onClick={() => setFilterRole('client')}
              className={filterRole === 'client' ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' : 'btn-ghost'}
            >
              Clients ({users.filter(u => u.role === 'client').length})
            </Button>
            <Button
              variant={filterRole === 'barber' ? 'default' : 'outline'}
              onClick={() => setFilterRole('barber')}
              className={filterRole === 'barber' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30' : 'btn-ghost'}
            >
              Barbers ({users.filter(u => u.role === 'barber').length})
            </Button>
            <Button
              variant={filterRole === 'admin' ? 'default' : 'outline'}
              onClick={() => setFilterRole('admin')}
              className={filterRole === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30' : 'btn-ghost'}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">{searchQuery || filterRole !== 'all' ? 'No users match your filters' : 'No users found'}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
            <Card key={user.id} className="glass card-hover animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <span className="text-white font-bold text-lg">{user.name?.[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                {user.phone && (
                  <div className="text-sm">
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white">{user.phone}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 btn-secondary"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-dark border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gradient">Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="barber">Barber</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full btn-primary" onClick={handleUpdate}>
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
