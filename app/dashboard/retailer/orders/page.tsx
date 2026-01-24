'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../components/RetailerNav'
import { ShoppingBag, Eye, Phone, Mail, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Order {
  id: string
  customer_data: any
  cart_items: any[]
  cart_total: number
  commission: number
  retailer_payout: number
  payment_status: string
  payment_id?: string
  order_status: string
  retailer_email: string
  created_at: string
  updated_at: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  useEffect(() => {
    if (retailer) {
      fetchOrders()
    }
  }, [retailer])

  const fetchOrders = async () => {
    if (!retailer) return

    try {
      console.log('Fetching orders for retailer:', retailer.email)
      
      const { data, error } = await supabase
        .from('orders_main')
        .select('*')
        .eq('retailer_email', retailer.email)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Orders fetched:', data?.length || 0, data)
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      case 'processing':
        return <Package className="text-blue-600" size={20} />
      case 'paid':
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <AlertCircle className="text-gray-600" size={20} />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.payment_status.toLowerCase() === filterStatus)

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.payment_status.toLowerCase() === 'pending').length,
    completed: orders.filter(o => o.payment_status.toLowerCase() === 'paid').length,
    cancelled: orders.filter(o => o.payment_status.toLowerCase() === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.payment_status.toLowerCase() === 'paid')
      .reduce((sum, o) => sum + o.retailer_payout, 0)
  }

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track your customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orderStats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 shadow-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-sm font-semibold mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">{orderStats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
            <p className="text-green-800 text-sm font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-900">{orderStats.completed}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-6 shadow-lg border-2 border-red-200">
            <p className="text-red-800 text-sm font-semibold mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-900">{orderStats.cancelled}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <p className="text-blue-800 text-sm font-semibold mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">{formatPrice(orderStats.totalRevenue)}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                filterStatus === 'all' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Orders ({orderStats.total})
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                filterStatus === 'pending' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({orderStats.pending})
            </button>
            <button 
              onClick={() => setFilterStatus('paid')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                filterStatus === 'paid' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({orderStats.completed})
            </button>
            <button 
              onClick={() => setFilterStatus('cancelled')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                filterStatus === 'cancelled' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelled ({orderStats.cancelled})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={80} />
            <h3 className="text-2xl font-bold mb-4">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? 'Orders will appear here when customers purchase your products'
                : `You don't have any ${filterStatus} orders at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const firstItem = order.cart_items?.[0] || {}
              const customer = order.customer_data || {}
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {/* Product Icon */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl">
                          🪦
                        </div>

                        {/* Order Info */}
                        <div>
                          <h3 className="text-lg font-bold mb-1">
                            {firstItem.productType || 'Product'} {firstItem.selectedColor ? `(${firstItem.selectedColor})` : ''}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.created_at)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(order.payment_status)}`}>
                              {getStatusIcon(order.payment_status)}
                              {order.payment_status}
                            </span>
                            {order.cart_items && order.cart_items.length > 1 && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {order.cart_items.length} items
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Your Payout</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(order.retailer_payout)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total: {formatPrice(order.cart_total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Commission: {formatPrice(order.commission)}
                        </p>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Customer Details:</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {customer.email || 'N/A'}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} />
                          {customer.phone || 'N/A'}
                        </p>
                        {customer.address && (
                          <p className="text-xs text-gray-500">
                            {customer.address}, {customer.city}, {customer.postalCode}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        <Eye size={16} />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Order ID: {selectedOrder.id}</h3>
                <p className="text-gray-600">Created: {formatDate(selectedOrder.created_at)}</p>
              </div>

              {/* Cart Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.cart_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.productType}</p>
                        <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.basePrice)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.customer_data?.firstName} {selectedOrder.customer_data?.lastName}</p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {selectedOrder.customer_data?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {selectedOrder.customer_data?.phone}
                  </p>
                  {selectedOrder.customer_data?.address && (
                    <p className="text-gray-600">
                      {selectedOrder.customer_data.address}, {selectedOrder.customer_data.city}, {selectedOrder.customer_data.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold mb-3">Payment Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.cart_total)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Commission (10%):</span>
                    <span className="font-semibold">-{formatPrice(selectedOrder.commission)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-300 text-lg">
                    <span className="font-bold">Your Payout:</span>
                    <span className="font-bold text-green-600">{formatPrice(selectedOrder.retailer_payout)}</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <p className="text-xs text-gray-600">
                      Payment Status: <span className={`font-semibold ${selectedOrder.payment_status.toLowerCase() === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                    {selectedOrder.payment_id && (
                      <p className="text-xs text-gray-600">Payment ID: {selectedOrder.payment_id}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}