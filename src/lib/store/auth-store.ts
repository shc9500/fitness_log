import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      initialized: false,

      initialize: async () => {
        if (get().initialized) return
        
        set({ loading: true })
        const supabase = createClient()
        
        try {
          const { data: { user } } = await supabase.auth.getUser()
          set({ user, initialized: true })
        } catch (error) {
          console.error('Auth initialization error:', error)
        } finally {
          set({ loading: false })
        }

        supabase.auth.onAuthStateChange((event, session) => {
          set({ user: session?.user || null })
        })
      },

      setUser: (user) => set({ user }),

      signIn: async (email, password) => {
        set({ loading: true })
        const supabase = createClient()
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
          if (error) {
            return { error: error.message }
          }
          
          set({ user: data.user })
          return { error: null }
        } catch (error) {
          return { error: '로그인 중 오류가 발생했습니다.' }
        } finally {
          set({ loading: false })
        }
      },

      signUp: async (email, password) => {
        set({ loading: true })
        const supabase = createClient()
        
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          
          if (error) {
            return { error: error.message }
          }
          
          return { error: null }
        } catch (error) {
          return { error: '회원가입 중 오류가 발생했습니다.' }
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        set({ loading: true })
        const supabase = createClient()
        
        try {
          await supabase.auth.signOut()
          set({ user: null })
        } catch (error) {
          console.error('Sign out error:', error)
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        initialized: state.initialized 
      }),
    }
  )
)