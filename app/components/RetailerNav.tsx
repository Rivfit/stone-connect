'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRetailerAuth } from './RetailerAuthContext'
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Star, FileCheck } from 'lucide-react'

export default function RetailerNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { retailer, logout } = useRetailerAuth()

  const handleLogout = () => {
    logout()
    router.push('/retailer/login')
  }

  const navItems = [
    { href: '/dashboard/retailer', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/retailer/products', icon: Package, label: 'Products' },
    { href: '/dashboard/retailer/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/dashboard/retailer/verification', icon: FileCheck, label: 'Verification', badge: true },
    { href: '/dashboard/retailer/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Business Name */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🪦</span>
              <span className="font-bold text-xl">Stone Connect</span>
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <p className="font-semibold text-gray-900">{retailer?.business_name}</p>
              {retailer?.is_premium && (
                <p className="text-xs text-yellow-600 flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  Premium
                </p>
              )}
            </div>
          </div>

          {/* Nav Items */}
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
        </div>
      </div>
    </nav>
  )
}