'use client'

import Link from 'next/link'
import { ShoppingCart, User, Star } from 'lucide-react'
import { useCart } from './CartContext'

export default function Navbar() {
  const { cartCount } = useCart()

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-3xl">🪦</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Stone Connect
              </h1>
              <p className="text-xs text-gray-400">Memorial Marketplace</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-400 transition-colors font-semibold">
              Browse
            </Link>
            <Link href="/premium" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
              <Star size={16} fill="currentColor" />
              Premium
            </Link>
            <Link href="/become-retailer" className="hover:text-blue-400 transition-colors">
              Sell on Stone Connect
            </Link>
            
            <Link href="/cart" className="relative hover:text-blue-400 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/login" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <User size={18} />
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}