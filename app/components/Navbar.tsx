'use client'

import Link from 'next/link'
import { ShoppingCart, User, Star, Menu, X, Scale } from 'lucide-react'
import { useCart } from './CartContext'
import { useCompare } from './CompareContext'
import { useState } from 'react'

export default function Navbar() {
  const { cartCount } = useCart()
  const { compareList } = useCompare()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/stone.png" 
              alt="Stone Connect Logo" 
              className="h-20 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Stone Connect
              </h1>
              <p className="text-xs text-gray-400">Memorial Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
            <Link href="/retailer/signup" className="hover:text-blue-400 transition-colors">
              Sell on Stone Connect
            </Link>
            
            {/* Compare Link */}
            <Link href="/compare" className="relative hover:text-blue-400 transition-colors flex items-center gap-2">
              <Scale size={20} />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {compareList.length}
                </span>
              )}
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 pt-2 space-y-3 border-t border-gray-700">
            <Link 
              href="/" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-blue-400 transition-colors py-2 font-semibold"
            >
              Browse Products
            </Link>
            <Link 
              href="/premium" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-yellow-400 transition-colors py-2 flex items-center gap-2"
            >
              <Star size={16} fill="currentColor" />
              Premium Retailers
            </Link>
            <Link 
              href="/retailer/signup" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Sell on Stone Connect
            </Link>
            <Link 
              href="/compare" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-blue-400 transition-colors py-2 flex items-center gap-2"
            >
              <Scale size={20} />
              Compare Products
              {compareList.length > 0 && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {compareList.length}
                </span>
              )}
            </Link>
            <Link 
              href="/cart" 
              onClick={() => setShowMobileMenu(false)}
              className="block hover:text-blue-400 transition-colors py-2 flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Shopping Cart
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link 
              href="/login" 
              onClick={() => setShowMobileMenu(false)}
              className="block bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}