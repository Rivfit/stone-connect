'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    // Check if retailer is logged in (from localStorage)
    const savedRetailer = localStorage.getItem('stone_connect_retailer')
    if (savedRetailer) {
      try {
        setRetailer(JSON.parse(savedRetailer))
      } catch (error) {
        console.error('Error loading retailer:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In production, this would call your API
      // For now, we'll use a simple demo login
      
      // Demo credentials: any email ending with @retailer.com
      if (email.endsWith('@retailer.com') && password === 'demo123') {
        const demoRetailer: Retailer = {
          id: '1',
          email: email,
          business_name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
          is_premium: false,
          rating: 0,
          total_sales: 0,
          total_views: 0,
        }
        
        setRetailer(demoRetailer)
        localStorage.setItem('stone_connect_retailer', JSON.stringify(demoRetailer))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setRetailer(null)
    localStorage.removeItem('stone_connect_retailer')
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