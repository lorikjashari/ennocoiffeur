export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string
          phone: string | null
          role: 'admin' | 'barber' | 'client'
          created_at: string
          photo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash: string
          phone?: string | null
          role: 'admin' | 'barber' | 'client'
          created_at?: string
          photo_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string
          phone?: string | null
          role?: 'admin' | 'barber' | 'client'
          created_at?: string
          photo_url?: string | null
        }
      }
      barbers: {
        Row: {
          id: string
          user_id: string
          working_hours: Json
          break_times: Json
          blocked_days: Json
        }
        Insert: {
          id?: string
          user_id: string
          working_hours?: Json
          break_times?: Json
          blocked_days?: Json
        }
        Update: {
          id?: string
          user_id?: string
          working_hours?: Json
          break_times?: Json
          blocked_days?: Json
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          loyalty_points: number
        }
        Insert: {
          id?: string
          user_id: string
          loyalty_points?: number
        }
        Update: {
          id?: string
          user_id?: string
          loyalty_points?: number
        }
      }
      services: {
        Row: {
          id: string
          name: string
          price: number
          duration_minutes: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          duration_minutes: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          duration_minutes?: number
          description?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          barber_id: string
          client_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'canceled' | 'completed'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          barber_id: string
          client_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'canceled' | 'completed'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          barber_id?: string
          client_id?: string
          service_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'canceled' | 'completed'
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
