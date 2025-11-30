'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import RetailerNav from '../../../components/RetailerNav'
import { ShoppingBag } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()

  // Placeholder for future order data
  const orders = []

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  if (isLoading || !retailer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-white border-b animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="bg-white rounded-xl p-12 h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track your customer orders</p>
        </div>

        {/* Filter tabs for future use */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button className="pb-4 px-1 border-b-2 border-blue-600 font-medium text-blue-600">
              All Orders
            </button>
            <button className="pb-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Pending
            </button>
            <button className="pb-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Completed
            </button>
            <button className="pb-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Cancelled
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
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
        ) : (
          <div className="space-y-4">
            {/* Future orders list will go here */}
          </div>
        )}
      </div>
    </div>
  )
}