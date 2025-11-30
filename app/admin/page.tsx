'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import VerificationTab from './verification/page' // move your verification content here

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verification'>('dashboard')

  // Dashboard state
  const [orders, setOrders] = useState<any[]>([])
  const [revenue, setRevenue] = useState(0)
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')

      if (ordersError) throw ordersError

      setOrders(ordersData || [])

      // Revenue: 10% commission
      const totalRevenue = ordersData?.reduce((acc, order) => {
        return acc + (order.total_amount || 0) * 0.1
      }, 0) || 0
      setRevenue(totalRevenue)

      // Premium subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_premium', true)

      if (subscriptionsError) throw subscriptionsError

      setSubscriptions(subscriptionsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardData()
  }, [activeTab])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'verification' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('verification')}
        >
          Verification
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div>
          {isLoading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-white rounded-xl shadow">
                  <h3 className="font-bold text-lg">Total Orders</h3>
                  <p className="text-2xl">{orders.length}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow">
                  <h3 className="font-bold text-lg">Revenue (10% commission)</h3>
                  <p className="text-2xl">R{revenue.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow">
                  <h3 className="font-bold text-lg">Premium Subscriptions</h3>
                  <p className="text-2xl">{subscriptions.length}</p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-bold mb-4">Orders</h2>
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Order ID</th>
                      <th className="border px-4 py-2">Customer</th>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="border px-4 py-2">{order.id}</td>
                        <td className="border px-4 py-2">{order.customer_name}</td>
                        <td className="border px-4 py-2">R{order.total_amount}</td>
                        <td className="border px-4 py-2">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'verification' && (
        <VerificationTab />
      )}
    </div>
  )
}
