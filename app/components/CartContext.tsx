'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  productId: string
  productType: string
  material: string
  basePrice: number
  selectedColor: string
  deceasedName: string
  customMessage: string
  cemeteryName: string
  plotNumber: string
  customerNotes: string
  retailerName: string
  retailerEmail: string
  addedAt: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('stoneconnect_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stoneconnect_cart', JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (item: Omit<CartItem, 'id' | 'addedAt'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now(),
    }
    setCart((prev) => [...prev, newItem])
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.length

  const cartTotal = cart.reduce((sum, item) => sum + item.basePrice, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}