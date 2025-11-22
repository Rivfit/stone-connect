'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Package, Clock, CheckCircle, XCircle, User, MapPin, Mail, Phone } from 'lucide-react'

export default function CustomerDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if customer is logged in
    const customerData = localStorage.getItem('customer')
    if (!customerData) {
      router.push('/login')
      return
    }

    setCustomer(JSON.parse(customerData))
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      // TODO: Fetch actual orders from API
      // For now, mock data
      setOrders([
        {
          id: 'ORD-001',
          date: '2025-01-15',
          status: 'processing',
          total: 15000,
          items: 'Granite Headstone - Black',
          retailer: 'Premium Memorials'
        },
        {
          id: 'ORD-002',
          date: '2024-12-20',
          status: 'completed',
          total: 8500,
          items: 'Marble Memorial Plaque',
          retailer: 'Stone Masters'
        }
      ])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="text-yellow-600" size={20} />
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Package className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const handleLogout = () => {
    localStorage.removeItem('customer')
    router.push('/')
  }

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {customer.firstName}!</h1>
              <p className="text-blue-100">Manage your orders and account details</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Account Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="text-blue-600" size={24} />
                </div>
                <h2 className="text-xl font-bold">Account Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-600" />
                  <div>
                    <label className="text-sm text-gray-600 block">Email</label>
                    <p className="font-semibold">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-600" />
                  <div>
                    <label className="text-sm text-gray-600 block">Phone</label>
                    <p className="font-semibold">{customer.phone || 'Not provided'}</p>
                  </div>
                </div>

                {customer.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-600 mt-1" />
                    <div>
                      <label className="text-sm text-gray-600 block">Address</label>
                      <p className="font-semibold text-sm">{customer.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total Orders</span>
                  <span className="font-bold text-xl">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Active Orders</span>
                  <span className="font-bold text-xl text-yellow-600">
                    {orders.filter(o => o.status === 'processing').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">Start browsing our memorial products</p>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">
                          <strong>Item:</strong> {order.items}
                        </p>
                        <p className="text-gray-700">
                          <strong>Retailer:</strong> {order.retailer}
                        </p>
                        <p className="text-gray-700">
                          <strong>Total:</strong> <span className="text-green-600 font-bold">{formatPrice(order.total)}</span>
                        </p>
                      </div>

                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}