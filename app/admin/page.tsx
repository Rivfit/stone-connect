'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Lock,
  LogOut,
  FileText,
  Star,
  Package
} from 'lucide-react'

interface Order {
  id: string
  customer_email: string
  product_price: number
  commission: number
  platform_commission: number
  order_status: string
  payment_status: string
  created_at: string
  products?: {
    type: string
    material: string
  }
  retailers?: {
    business_name: string
  }
  cart_items?: any[]
  customer_data?: any
}

interface VerificationDoc {
  id: string
  retailer_id: string
  document_type: string
  file_url: string
  file_name: string
  status: string
  rejection_reason?: string
  uploaded_at: string
  retailers?: {
    business_name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'verification' | 'subscriptions'>('dashboard')
  const [loading, setLoading] = useState(true)

  // Dashboard stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    platformCommission: 0,
    premiumSubscribers: 0,
    pendingVerifications: 0,
    completedOrders: 0,
    pendingOrders: 0
  })

  // Data states
  const [orders, setOrders] = useState<Order[]>([])
  const [verificationDocs, setVerificationDocs] = useState<VerificationDoc[]>([])
  const [premiumRetailers, setPremiumRetailers] = useState<any[]>([])
  const [selectedDoc, setSelectedDoc] = useState<VerificationDoc | null>(null)
  const [reviewNote, setReviewNote] = useState('')

  const ADMIN_PASSWORD = 'admin123' // Change this to your secure password

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchAllData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_authenticated', 'true')
      fetchAllData()
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchOrders(),
        fetchVerificationDocs(),
        fetchPremiumRetailers()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders_main')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to match old format for display
      const transformedOrders = data?.map(order => ({
        id: order.id,
        customer_email: order.customer_data?.email || 'N/A',
        product_price: parseFloat(order.cart_total || 0),
        commission: parseFloat(order.commission || 0),
        platform_commission: parseFloat(order.commission || 0),
        order_status: order.order_status || 'pending',
        payment_status: order.payment_status || 'pending',
        created_at: order.created_at,
        // Extract product info from cart_items
        products: {
          type: order.cart_items?.[0]?.productType || 'Multiple items',
          material: ''
        },
        retailers: {
          business_name: order.retailer_email || 'N/A'
        },
        cart_items: order.cart_items,
        customer_data: order.customer_data
      })) || []

      setOrders(transformedOrders)

      // Calculate stats
      const totalRevenue = transformedOrders.reduce((sum, order) => 
        sum + (order.product_price || 0), 0)
      
      const platformCommission = transformedOrders.reduce((sum, order) => 
        sum + (order.commission || 0), 0)

      const completed = transformedOrders.filter(o => o.payment_status === 'paid').length
      const pending = transformedOrders.filter(o => o.payment_status === 'pending').length

      setStats(prev => ({
        ...prev,
        totalOrders: transformedOrders.length,
        totalRevenue,
        platformCommission,
        completedOrders: completed,
        pendingOrders: pending
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchVerificationDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select(`
          *,
          retailers (business_name, email)
        `)
        .order('uploaded_at', { ascending: false })

      if (error) throw error

      setVerificationDocs(data || [])

      const pending = data?.filter(doc => doc.status === 'pending').length || 0
      setStats(prev => ({ ...prev, pendingVerifications: pending }))
    } catch (error) {
      console.error('Error fetching verification docs:', error)
    }
  }

  const fetchPremiumRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_premium', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPremiumRetailers(data || [])
      setStats(prev => ({ ...prev, premiumSubscribers: data?.length || 0 }))
    } catch (error) {
      console.error('Error fetching premium retailers:', error)
    }
  }

  const handleApproveDocument = async (docId: string) => {
    if (!confirm('Approve this document?')) return

    try {
      const response = await fetch('/api/admin/approve-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: docId,
          action: 'approve'
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Document approved!')
        setSelectedDoc(null)
        fetchVerificationDocs()
      } else {
        throw new Error(data.error || 'Failed to approve document')
      }
    } catch (error) {
      console.error('Error approving document:', error)
      alert('❌ Error approving document')
    }
  }

  const handleRejectDocument = async (docId: string) => {
    if (!reviewNote.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    if (!confirm('Reject this document?')) return

    try {
      const response = await fetch('/api/admin/approve-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: docId,
          action: 'reject',
          rejectionReason: reviewNote
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Document rejected')
        setSelectedDoc(null)
        setReviewNote('')
        fetchVerificationDocs()
      } else {
        throw new Error(data.error || 'Failed to reject document')
      }
    } catch (error) {
      console.error('Error rejecting document:', error)
      alert('❌ Error rejecting document')
    }
  }

  const handleViewDocument = (doc: VerificationDoc) => {
    console.log('🔍 === DOCUMENT VIEW DEBUG ===')
    console.log('📄 Full document object:', doc)
    console.log('🔗 File URL:', doc.file_url)
    console.log('📝 File name:', doc.file_name)
    
    if (!doc.file_url) {
      alert('❌ No file URL available for this document')
      return
    }

    try {
      const url = new URL(doc.file_url)
      console.log('🌐 URL breakdown:')
      console.log('  - Protocol:', url.protocol)
      console.log('  - Host:', url.hostname)
      console.log('  - Path:', url.pathname)
      console.log('  - Full URL:', url.href)
      
      if (url.pathname.includes('/authenticated/')) {
        console.warn('⚠️ WARNING: URL contains /authenticated/ - this will cause 401 error!')
        alert('⚠️ This document is set as private in Cloudinary. It needs to be re-uploaded with public access.')
      }
      
      window.open(doc.file_url, '_blank')
    } catch (error) {
      console.error('❌ Invalid URL:', error)
      alert('❌ Invalid document URL')
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter password to access dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none mb-4"
              placeholder="Enter admin password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'orders' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders ({stats.totalOrders})
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'verification' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Verification ({stats.pendingVerifications})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'subscriptions' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Premium ({stats.premiumSubscribers})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingBag size={32} />
                      <span className="text-sm opacity-80">Total</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                    <p className="text-sm opacity-80">Orders</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign size={32} />
                      <span className="text-sm opacity-80">Commission</span>
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(stats.platformCommission)}</p>
                    <p className="text-sm opacity-80">Platform Revenue</p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Clock size={32} />
                      <span className="text-sm opacity-80">Pending</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.pendingVerifications}</p>
                    <p className="text-sm opacity-80">Verifications</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Star size={32} />
                      <span className="text-sm opacity-80">Premium</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.premiumSubscribers}</p>
                    <p className="text-sm opacity-80">Subscribers</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sales Value:</span>
                        <span className="font-bold">{formatPrice(stats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Platform Commission (10%):</span>
                        <span className="font-bold">{formatPrice(stats.platformCommission)}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Premium Subscriptions:</span>
                        <span className="font-bold">{formatPrice(stats.premiumSubscribers * 1500)}/mo</span>
                      </div>
                      <div className="pt-3 border-t flex justify-between text-lg">
                        <span className="font-bold">Total Platform Revenue:</span>
                        <span className="font-bold text-green-600">
                          {formatPrice(stats.platformCommission + (stats.premiumSubscribers * 1500))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Order Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-600" size={24} />
                          <span>Completed</span>
                        </div>
                        <span className="font-bold text-2xl">{stats.completedOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="text-yellow-600" size={24} />
                          <span>Pending</span>
                        </div>
                        <span className="font-bold text-2xl">{stats.pendingOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="text-blue-600" size={24} />
                          <span>Processing</span>
                        </div>
                        <span className="font-bold text-2xl">
                          {stats.totalOrders - stats.completedOrders - stats.pendingOrders}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Retailer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Commission</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{order.id.slice(0, 8)}</td>
                          <td className="px-4 py-3 text-sm">{order.customer_email}</td>
                          <td className="px-4 py-3 text-sm">
                            {order.products?.type || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {order.retailers?.business_name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">
                            {formatPrice(order.product_price)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            {formatPrice(order.commission || order.platform_commission)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(order.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div className="space-y-4">
                {verificationDocs
                  .filter(doc => doc.status === 'pending')
                  .reduce((acc: any[], doc) => {
                    const existing = acc.find(item => item.retailer_id === doc.retailer_id)
                    if (existing) {
                      existing.documents.push(doc)
                    } else {
                      acc.push({
                        retailer_id: doc.retailer_id,
                        business_name: doc.retailers?.business_name,
                        email: doc.retailers?.email,
                        documents: [doc]
                      })
                    }
                    return acc
                  }, [])
                  .map((retailer) => (
                    <div key={retailer.retailer_id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">{retailer.business_name}</h3>
                        <p className="text-gray-600">{retailer.email}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {retailer.documents.map((doc: VerificationDoc) => (
                          <div key={doc.id} className="border-2 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="text-blue-600" size={20} />
                              <span className="font-semibold text-sm">
                                {doc.document_type.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{doc.file_name}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                onClick={() => setSelectedDoc(doc)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                {verificationDocs.filter(doc => doc.status === 'pending').length === 0 && (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
                    <h3 className="text-xl font-bold mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending verifications</p>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Business Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {premiumRetailers.map((retailer) => (
                        <tr key={retailer.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                              <Star className="text-yellow-500" size={16} fill="currentColor" />
                              {retailer.business_name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{retailer.email}</td>
                          <td className="px-4 py-3 text-sm">{retailer.phone}</td>
                          <td className="px-4 py-3 text-sm">{retailer.city}, {retailer.province}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(retailer.created_at)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            R1,500/mo
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Document</h2>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Business</p>
                <p className="font-semibold">{selectedDoc.retailers?.business_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Document Type</p>
                <p className="font-semibold">{selectedDoc.document_type.replace('_', ' ').toUpperCase()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">File</p>
                <button
                  onClick={() => handleViewDocument(selectedDoc)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Download size={16} />
                  {selectedDoc.file_name}
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Rejection Reason (if rejecting)</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full border-2 p-3 rounded-lg outline-none resize-none"
                  rows={3}
                  placeholder="Provide reason for rejection..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApproveDocument(selectedDoc.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Approve
                </button>
                <button
                  onClick={() => handleRejectDocument(selectedDoc.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}