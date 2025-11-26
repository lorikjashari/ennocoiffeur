import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Fetch all users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching users:', error)
      throw error
    }

    console.log('Successfully fetched users:', users?.length || 0)
    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', users: [] },
      { status: 500 }
    )
  }
}

// PATCH - Update user
export async function PATCH(request: NextRequest) {
  try {
    const { id, name, email, phone, role } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (role) updateData.role = role

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete related barber record if exists
    await supabase.from('barbers').delete().eq('user_id', id)

    // Delete related client record if exists
    await supabase.from('clients').delete().eq('user_id', id)

    // Delete appointments where user is barber
    await supabase.from('appointments').delete().eq('barber_id', id)

    // Delete appointments where user is client
    await supabase.from('appointments').delete().eq('client_id', id)

    // Finally delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
