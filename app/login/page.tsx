'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Lock, Mail, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('user', JSON.stringify(data.user))

        toast({
          title: 'Welcome back!',
          description: `Logged in as ${data.user.name}`
        })

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (data.user.role === 'barber') {
          router.push('/barber/dashboard')
        } else {
          router.push('/client/dashboard')
        }
      } else {
        const error = await response.json()
        toast({
          title: 'Login failed',
          description: error.error || 'Invalid credentials',
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

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 hover-scale">
            <Image
              src="/logo.png"
              alt="ENNO COIFFEUR Logo"
              width={128}
              height={128}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass-card border-white/20 hover-lift">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gradient">
              Welcome Back
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Sign in to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-dark h-12 pl-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-dark h-12 pl-4"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-12 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials removed for production */}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          © 2025 ENNO COIFFEUR • Geneva, Switzerland
        </p>
      </div>
    </div>
  )
}
