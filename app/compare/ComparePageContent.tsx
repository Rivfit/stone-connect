'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { X, Star, MapPin, ArrowRight, Plus, Package, Palette } from 'lucide-react'

interface Product {
  id: string
  type: string
  material: string
  base_price: number
  colors: string[]
  description: string
  images?: string[]
  retailers?: {
    id: string
    business_name: string
    email: string
    phone: string
    city: string
    province: string
    rating: number
    is_premium: boolean
    reviews_count: number
  }
}

export default function ComparePageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    const ids = searchParams.get('products')?.split(',').filter(Boolean) || []
    setCompareIds(ids)
    
    if (ids.length > 0) {
      fetchProducts(ids)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchProducts = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, retailers(*)')
        .in('id', ids)

      if (error) {
        console.error('Supabase error details:', error)
        setProducts([])
        return
      }
      
      console.log('Successfully fetched products:', data)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (productId: string) => {
    const newIds = compareIds.filter(id => id !== productId)
    setCompareIds(newIds)
    
    const params = new URLSearchParams()
    if (newIds.length > 0) {
      params.set('products', newIds.join(','))
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
    
    setProducts(products.filter(p => p.id !== productId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    )
  }

  if (compareIds.length === 0 || products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">⚖️</div>
        <h1 className="text-4xl font-bold mb-4">Compare Products</h1>
        <p className="text-xl text-gray-600 mb-8">
          No products selected for comparison. Browse our catalog and add products to compare side-by-side.
        </p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Products
          <ArrowRight size={20} />
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Compare Products</h1>
        <p className="text-gray-600">Side-by-side comparison of {products.length} memorial products</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 w-48 sticky left-0 bg-gray-50 z-10">
                  Features
                </th>
                {products.map((product) => (
                  <th key={product.id} className="px-6 py-4 text-center min-w-[300px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.type}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="font-bold text-lg">{product.type}</h3>
                        <p className="text-sm text-gray-600">{product.material}</p>
                      </div>
                      
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Base Price
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <span className="font-bold text-2xl text-green-600">
                      {formatPrice(product.base_price)}
                    </span>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Material
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <span className="font-semibold">{product.material}</span>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Type
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <span>{product.type}</span>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  <div className="flex items-center gap-2">
                    <Palette size={18} />
                    Colors Available
                  </div>
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {color}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Description
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4">
                    <p className="text-sm text-gray-600 text-left">
                      {product.description || 'No description available'}
                    </p>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Retailer
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold">{product.retailers?.business_name}</span>
                        {product.retailers?.is_premium && (
                          <Star size={16} className="text-yellow-500" fill="currentColor" />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        {product.retailers?.city}, {product.retailers?.province}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Retailer Rating
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Star size={18} className="text-yellow-500" fill="currentColor" />
                      <span className="font-bold">{product.retailers?.rating || 0}</span>
                      <span className="text-sm text-gray-500">
                        ({product.retailers?.reviews_count || 0} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white">
                  Contact Retailer
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">{product.retailers?.phone || 'N/A'}</p>
                      <p className="text-blue-600">{product.retailers?.email}</p>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-gray-50">
                  Actions
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-center">
                    <div className="flex flex-col gap-2">
                      <a
                        href={`/products/${product.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Details
                        <ArrowRight size={18} />
                      </a>
                      <a
                        href={`/products/${product.id}?action=buy`}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Buy Now
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {products.length < 4 && (
        <div className="mt-8 text-center">
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <Plus size={20} />
            Add More Products to Compare
          </a>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">💡 Comparison Tips</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• Compare materials to find the best quality for your needs</li>
          <li>• Check retailer ratings for reliable service</li>
          <li>• Base prices may increase with customization</li>
          <li>• Contact retailers directly for accurate quotes</li>
          <li>• Consider location for installation logistics</li>
          <li>• Premium retailers offer verified quality assurance</li>
        </ul>
      </div>
    </div>
  )
}