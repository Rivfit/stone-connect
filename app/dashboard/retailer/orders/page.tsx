'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../components/RetailerNav'
import { ShoppingBag, Eye, Phone, Mail, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Order {
  id: string
  customer_id: string
  retailer_id: string
  product_id: string
  selected_color: string
  deceased_name: string
  custom_message?: string
  product_price: number
  platform_commission: number
  retailer_payout: number
  payment_status: string
  payment_id?: string
  order_status: string
  customer_email: string
  customer_phone: string
  created_at: string
  updated_at: string
  commission: number
  products?: {
    type: string
    material: string
    images?: string[]
  }
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
      console.log('Fetching orders for retailer:', retailer.id)
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            type,
            material,
            images
          )
        `)
        .eq('retailer_id', retailer.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Orders fetched:', data?.length || 0)
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
    : orders.filter(order => order.order_status.toLowerCase() === filterStatus)

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.order_status.toLowerCase() === 'pending').length,
    completed: orders.filter(o => o.order_status.toLowerCase() === 'completed').length,
    cancelled: orders.filter(o => o.order_status.toLowerCase() === 'cancelled').length,
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
              onClick={() => setFilterStatus('completed')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                filterStatus === 'completed' 
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
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {order.products?.images && order.products.images.length > 0 ? (
                          <img 
                            src={order.products.images[0]} 
                            alt={order.products.type}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🪦
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div>
                        <h3 className="text-lg font-bold mb-1">
                          {order.products?.type || 'Product'} - {order.products?.material || 'Material'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(order.order_status)}`}>
                            {getStatusIcon(order.order_status)}
                            {order.order_status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status.toLowerCase() === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            Payment: {order.payment_status}
                          </span>
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
                        Product: {formatPrice(order.product_price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Commission: {formatPrice(order.commission || order.platform_commission)}
                      </p>
                    </div>
                  </div>

                  {/* Customer & Product Details */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Customer Details:</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {order.customer_email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} />
                          {order.customer_phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Order Details:</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>In Memory of:</strong> {order.deceased_name}</p>
                        <p><strong>Selected Color:</strong> {order.selected_color}</p>
                        {order.custom_message && (
                          <p className="text-xs italic bg-gray-50 p-2 rounded mt-2">
                            "{order.custom_message}"
                          </p>
                        )}
                      </div>
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
            ))}
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
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedOrder.products?.images && selectedOrder.products.images.length > 0 ? (
                    <img 
                      src={selectedOrder.products.images[0]} 
                      alt={selectedOrder.products.type}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🪦
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {selectedOrder.products?.type} - {selectedOrder.products?.material}
                  </h3>
                  <p className="text-gray-600">Order ID: {selectedOrder.id}</p>
                  <p className="text-gray-600">Created: {formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {selectedOrder.customer_email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {selectedOrder.customer_phone}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>In Memory of:</strong> {selectedOrder.deceased_name}</p>
                    <p><strong>Color:</strong> {selectedOrder.selected_color}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.order_status)}`}>
                        {selectedOrder.order_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.custom_message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Custom Message</h4>
                  <p className="text-sm italic">"{selectedOrder.custom_message}"</p>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold mb-3">Payment Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product Price:</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.product_price)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Commission:</span>
                    <span className="font-semibold">-{formatPrice(selectedOrder.commission || selectedOrder.platform_commission)}</span>
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