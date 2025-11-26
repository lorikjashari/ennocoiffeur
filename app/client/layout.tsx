'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }
    
    const userData = JSON.parse(user)
    if (userData.role !== 'client') {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}
