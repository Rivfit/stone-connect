'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Retailer {
  id: string
  email: string
  business_name: string
  is_premium: boolean
  rating: number
  total_sales: number
  total_views: number
}

interface RetailerAuthContextType {
  retailer: Retailer | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const RetailerAuthContext = createContext<RetailerAuthContextType | undefined>(undefined)

export function RetailerAuthProvider({ children }: { children: ReactNode }) {
  const [retailer, setRetailer] = useState<Retailer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event)
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchRetailerData(session.user.email!)
      } else if (event === 'SIGNED_OUT') {
        setRetailer(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchRetailerData = async (email: string) => {
    try {
      console.log('📊 Fetching retailer data for:', email)
      
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('❌ Error fetching retailer:', error.message, error.details)
        return false
      }

      if (data) {
        console.log('✅ Retailer data loaded:', data.business_name)
        setRetailer({
          id: data.id,
          email: data.email,
          business_name: data.business_name,
          is_premium: data.is_premium || false,
          rating: data.rating || 0,
          total_sales: data.total_sales || 0,
          total_views: data.total_views || 0
        })
        return true
      } else {
        console.warn('⚠️ No retailer found for email:', email)
        return false
      }
    } catch (error) {
      console.error('❌ Exception fetching retailer:', error)
      return false
    }
  }

  const checkUser = async () => {
    try {
      console.log('🔍 Checking user session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Session error:', error)
        setIsLoading(false)
        return
      }

      if (session?.user) {
        console.log('👤 Session found for:', session.user.email)
        await fetchRetailerData(session.user.email!)
      } else {
        console.log('❌ No active session')
      }
    } catch (error) {
      console.error('❌ Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        console.error('❌ Auth error:', authError.message)
        return false
      }

      if (!authData.user) {
        console.error('❌ No user returned from auth')
        return false
      }

      console.log('✅ Auth successful, fetching retailer data...')
      
      const success = await fetchRetailerData(email)
      
      if (!success) {
        console.error('❌ Failed to fetch retailer data')
        await supabase.auth.signOut()
        return false
      }

      return true
    } catch (error) {
      console.error('❌ Login exception:', error)
      return false
    }
  }

  const logout = async () => {
    console.log('👋 Logging out...')
    await supabase.auth.signOut()
    setRetailer(null)
  }

  return (
    <RetailerAuthContext.Provider value={{ retailer, login, logout, isLoading }}>
      {children}
    </RetailerAuthContext.Provider>
  )
}

export function useRetailerAuth() {
  const context = useContext(RetailerAuthContext)
  if (context === undefined) {
    throw new Error('useRetailerAuth must be used within RetailerAuthProvider')
  }
  return context
}