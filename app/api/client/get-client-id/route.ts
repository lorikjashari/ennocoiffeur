import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: client, error } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (error || !client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const c = client as any
    return NextResponse.json({ clientId: c.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client ID' },
      { status: 500 }
    )
  }
}
