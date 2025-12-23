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
    // Check if user is logged in with Supabase
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Fetch retailer data from Supabase
        const { data, error } = await supabase
          .from('retailers')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (data) {
          setRetailer({
            id: data.id,
            email: data.email,
            business_name: data.business_name,
            is_premium: data.is_premium || false,
            rating: data.rating || 0,
            total_sales: data.total_sales || 0,
            total_views: data.total_views || 0
          })
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError || !authData.user) {
        console.error('Auth error:', authError)
        return false
      }

      // Fetch retailer data
      const { data: retailerData, error: retailerError } = await supabase
        .from('retailers')
        .select('*')
        .eq('email', email)
        .single()

      if (retailerError || !retailerData) {
        console.error('Retailer fetch error:', retailerError)
        return false
      }

      setRetailer({
        id: retailerData.id,
        email: retailerData.email,
        business_name: retailerData.business_name,
        is_premium: retailerData.is_premium || false,
        rating: retailerData.rating || 0,
        total_sales: retailerData.total_sales || 0,
        total_views: retailerData.total_views || 0
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
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