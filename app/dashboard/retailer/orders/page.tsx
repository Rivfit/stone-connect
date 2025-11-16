'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import RetailerNav from '../../../components/RetailerNav'
import { ShoppingBag } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  if (isLoading || !retailer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Orders</h1>

        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
          <ShoppingBag className="mx-auto mb-4 text-gray-400" size={80} />
          <h3 className="text-2xl font-bold mb-4">No orders yet</h3>
          <p className="text-gray-600 mb-6">
            Orders will appear here when customers purchase your products
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-sm text-blue-900">
              <strong>Coming soon:</strong> Real-time order notifications, order management, 
              customer details, and payment tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}