'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  active: boolean
}

export default function SubscriptionsTab({ active }: Props) {
  const [subscribers, setSubscribers] = useState<any[]>([])

  useEffect(() => {
    if (!active) return

    const fetchSubscribers = async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_premium', true)

      if (error) console.error(error)
      else setSubscribers(data)
    }

    fetchSubscribers()
  }, [active])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Premium Retailers</h2>
      {subscribers.length ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Business Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((retailer) => (
              <tr key={retailer.id}>
                <td className="border px-4 py-2">{retailer.business_name}</td>
                <td className="border px-4 py-2">{retailer.email}</td>
                <td className="border px-4 py-2">{new Date(retailer.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No premium subscriptions yet.</p>
      )}
    </div>
  )
}
