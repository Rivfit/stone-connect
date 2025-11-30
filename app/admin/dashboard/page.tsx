'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface DashboardData {
  ordersCount: number
  revenue: number
  visits: number
}

export default function DashboardTab() {
  const [data, setData] = useState<DashboardData>({
    ordersCount: 0,
    revenue: 0,
    visits: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')

        if (ordersError) throw ordersError

        // Calculate total revenue (10% commission)
        const revenue = orders.reduce((acc: number, order: any) => {
          return acc + (order.total_amount * 0.1)
        }, 0)

        // Fetch site visits
        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select('*')

        if (visitsError) throw visitsError

        setData({
          ordersCount: orders.length,
          revenue,
          visits: visitsData.length,
        })
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message || error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <p>Loading dashboard...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="font-bold text-lg">Orders</h2>
        <p className="text-3xl">{data.ordersCount}</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="font-bold text-lg">Revenue (10% commission)</h2>
        <p className="text-3xl">R{data.revenue.toFixed(2)}</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="font-bold text-lg">Site Visits</h2>
        <p className="text-3xl">{data.visits}</p>
      </div>
    </div>
  )
}
