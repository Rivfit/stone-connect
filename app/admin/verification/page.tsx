'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  active?: boolean
}

export default function VerificationTab({ active = true }: Props) {
  const [pendingRetailers, setPendingRetailers] = useState<any[]>([])

  useEffect(() => {
    if (!active) return

    const fetchPending = async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('verification_status', 'pending')
      if (error) console.error(error)
      else setPendingRetailers(data)
    }

    fetchPending()
  }, [active])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Retailer Verifications</h2>
      {pendingRetailers.length ? (
        <ul className="space-y-2">
          {pendingRetailers.map((retailer) => (
            <li key={retailer.id} className="p-4 border rounded-lg">
              <p className="font-semibold">{retailer.business_name}</p>
              <p>{retailer.email}</p>
              <p>Status: {retailer.verification_status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No retailers pending verification.</p>
      )}
    </div>
  )
}
