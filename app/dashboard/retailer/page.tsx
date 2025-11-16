'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../components/RetailerAuthContext'
import RetailerNav from '../../components/RetailerNav'
import Link from 'next/link'
import { TrendingUp, Eye, Package, DollarSign, ArrowRight, Star } from 'lucide-react'

export default function RetailerDashboard() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!retailer) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  // Calculate estimated revenue (90% of total sales)
  const estimatedRevenue = (retailer.total_sales || 0) * 8000 * 0.9 // avg R8000 per sale

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <Eye className="text-blue-600" size={32} />
              <span className="text-xs text-blue-600 font-semibold">THIS MONTH</span>
            </div>
            <p className="text-4xl font-bold mb-1">{retailer.total_views || 0}</p>
            <p className="text-gray-700 font-semibold">Profile Views</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <TrendingUp className="text-green-600" size={32} />
              <span className="text-xs text-green-600 font-semibold">ALL TIME</span>
            </div>
            <p className="text-4xl font-bold mb-1">{retailer.total_sales || 0}</p>
            <p className="text-gray-700 font-semibold">Total Sales</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <Star className="text-purple-600" size={32} fill="currentColor" />
              <span className="text-xs text-purple-600 font-semibold">RATING</span>
            </div>
            <p className="text-4xl font-bold mb-1">{retailer.rating || 0}</p>
            <p className="text-gray-700 font-semibold">Average Rating</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <DollarSign className="text-yellow-600" size={32} />
              <span className="text-xs text-yellow-600 font-semibold">REVENUE</span>
            </div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(estimatedRevenue)}</p>
            <p className="text-gray-700 font-semibold">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dashboard/retailer/products/add"
            className="bg-white border-2 border-blue-200 p-8 rounded-xl hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  Add New Product
                </h3>
                <p className="text-gray-600">List a new memorial product</p>
              </div>
              <ArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform" size={32} />
            </div>
          </Link>

          <Link
            href="/dashboard/retailer/products"
            className="bg-white border-2 border-green-200 p-8 rounded-xl hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                  Manage Products
                </h3>
                <p className="text-gray-600">Edit or remove existing products</p>
              </div>
              <ArrowRight className="text-green-600 group-hover:translate-x-2 transition-transform" size={32} />
            </div>
          </Link>
        </div>

        {/* Premium Upgrade Banner */}
        {!retailer.is_premium && (
          <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 border-2 border-yellow-400 p-8 rounded-xl">
            <div className="flex items-start gap-6">
              <Star className="text-yellow-600 flex-shrink-0" size={48} fill="currentColor" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Upgrade to Premium</h3>
                <p className="text-gray-700 mb-4">
                  Get 3x more visibility with priority placement, homepage features, and premium badge for only R1,500/month
                </p>
                <Link
                  href="/dashboard/retailer/settings"
                  className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Upgrade Now
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-8 shadow-lg mt-8">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={24} />
                <div>
                  <p className="font-semibold">Welcome to Stone Connect!</p>
                  <p className="text-sm text-gray-600">Start by adding your first product</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}