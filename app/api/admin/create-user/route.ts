import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await createUser(name, email, password, phone, role)

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
