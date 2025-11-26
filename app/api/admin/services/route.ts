import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, duration_minutes, description } = await request.json()

    const { data: service, error } = await supabase
      .from('services')
      .insert({ name, price, duration_minutes, description })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name, price, duration_minutes, description } = await request.json()

    const { data: service, error } = await supabase
      .from('services')
      .update({ name, price, duration_minutes, description })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
