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
      service_providers: {
        Row: {
          id: string
          company_name: string
          contact_name: string | null
          email: string
          phone: string | null
          vendor_number: string
          service_categories: string[]
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_name?: string | null
          email: string
          phone?: string | null
          vendor_number: string
          service_categories?: string[]
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          company_name?: string
          contact_name?: string | null
          email?: string
          phone?: string | null
          vendor_number?: string
          service_categories?: string[]
          status?: 'active' | 'inactive'
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string | null
        }
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'supervisor' | 'user'
          status: 'active' | 'inactive'
          create_service: boolean
          approve_service: boolean
          manage_users: boolean
          create_service_receipt: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'supervisor' | 'user'
          status?: 'active' | 'inactive'
          create_service?: boolean
          approve_service?: boolean
          manage_users?: boolean
          create_service_receipt?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'supervisor' | 'user'
          status?: 'active' | 'inactive'
          create_service?: boolean
          approve_service?: boolean
          manage_users?: boolean
          create_service_receipt?: boolean
        }
      }
    }
  }
}