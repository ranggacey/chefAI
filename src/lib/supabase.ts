import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          user_id: string
          name: string
          quantity: number
          unit: string
          expiry_date: string | null
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          quantity: number
          unit: string
          expiry_date?: string | null
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          quantity?: number
          unit?: string
          expiry_date?: string | null
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          ingredients: string[]
          instructions: string[]
          prep_time: number
          cook_time: number
          servings: number
          difficulty: string
          cuisine: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          ingredients: string[]
          instructions: string[]
          prep_time: number
          cook_time: number
          servings: number
          difficulty: string
          cuisine: string
          tags: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          ingredients?: string[]
          instructions?: string[]
          prep_time?: number
          cook_time?: number
          servings?: number
          difficulty?: string
          cuisine?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          date: string
          meal_type: string
          recipe_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          meal_type: string
          recipe_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meal_type?: string
          recipe_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          session_id: string
          message_type: 'user' | 'ai' | 'system' | 'recipe'
          content: string
          metadata: any
          tokens_used: number
          response_time_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string
          message_type: 'user' | 'ai' | 'system' | 'recipe'
          content: string
          metadata?: any
          tokens_used?: number
          response_time_ms?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          message_type?: 'user' | 'ai' | 'system' | 'recipe'
          content?: string
          metadata?: any
          tokens_used?: number
          response_time_ms?: number
          created_at?: string
        }
      }
    }
  }
}