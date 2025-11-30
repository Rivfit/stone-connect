'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useRetailerAuth } from './RetailerAuthContext'
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Star, FileCheck, Menu, X } from 'lucide-react'

export default function RetailerNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { retailer, logout } = useRetailerAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/retailer/login')
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: '/dashboard/retailer', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/retailer/products', icon: Package, label: 'Products' },
    { href: '/dashboard/retailer/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/dashboard/retailer/verification', icon: FileCheck, label: 'Verification', badge: true },
    { href: '/dashboard/retailer/settings', icon: Settings, label: 'Settings' },
  ]

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Business Name */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/stone-black.png" 
                alt="Stone Connect" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-lg sm:text-xl hidden sm:inline">Stone Connect</span>
            </Link>
            <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-900">{retailer?.business_name}</p>
              {retailer?.is_premium && (
                <p className="text-xs text-yellow-600 flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  Premium
                </p>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ml-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-1">
            {/* Business Name on Mobile */}
            <div className="px-4 py-2 border-b mb-2">
              <p className="font-semibold text-gray-900">{retailer?.business_name}</p>
              {retailer?.is_premium && (
                <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                  <Star size={12} fill="currentColor" />
                  Premium Retailer
                </p>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 transition-colors relative ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
                )}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t mt-2 pt-4"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}