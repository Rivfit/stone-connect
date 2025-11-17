import { createClient } from '@/lib/supabase/server'
import Navbar from '../components/Navbar'
import { Star, MapPin, Eye, TrendingUp, Mail, Phone, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

export default async function PremiumPage() {
  const supabase = createClient()

  // Fetch premium retailers
  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')
    .eq('is_premium', true)
    .order('rating', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Star className="text-yellow-500" fill="currentColor" size={48} />
            Premium Verified Retailers
          </h1>
          <p className="text-xl text-gray-600">Our most trusted and highly-rated memorial specialists</p>
        </div>

        {(!retailers || retailers.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Star className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-3xl font-bold mb-4">No Premium Retailers Yet</h2>
            <p className="text-xl text-gray-600 mb-8">
              Be the first to upgrade to Premium and get featured here!
            </p>
            <Link
              href="/retailer/signup"
              className="inline-block bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
            >
              Become a Premium Retailer
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {retailers.map((retailer: { id: Key | null | undefined; business_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; address: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; rating: any; total_sales: any; total_views: any }) => (
              <div
                key={retailer.id}
                className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 border-3 border-yellow-400 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-gray-900">{retailer.business_name}</h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        {retailer.address}
                      </p>
                      {retailer.email && (
                        <p className="flex items-center gap-2">
                          <Mail size={18} className="text-blue-600" />
                          {retailer.email}
                        </p>
                      )}
                      {retailer.phone && (
                        <p className="flex items-center gap-2">
                          <Phone size={18} className="text-blue-600" />
                          {retailer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ PREMIUM
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="text-yellow-500" size={20} fill="currentColor" />
                      <span className="font-bold text-2xl">{retailer.rating || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center border-x">
                    <p className="font-bold text-2xl text-green-600">{retailer.total_sales || 0}</p>
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-2xl text-blue-600">{retailer.total_views || 0}</p>
                    <p className="text-sm text-gray-600">Profile Views</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/products"
                    className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-center"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="text-yellow-600" fill="currentColor" />
            Premium Membership Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold">Priority Placement</p>
                <p className="text-sm text-gray-700">Products shown first in search results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold">Homepage Featured Spot</p>
                <p className="text-sm text-gray-700">Prominent advertising on homepage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold">Enhanced Analytics</p>
                <p className="text-sm text-gray-700">Advanced insights and reporting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold">Premium Badge</p>
                <p className="text-sm text-gray-700">Stand out with verified status</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/retailer/signup"
              className="inline-block bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
            >
              Become a Premium Retailer - R1,500/month
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Stone Connect. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">South Africa's Memorial Marketplace</p>
        </div>
      </footer>
    </div>
  )
}