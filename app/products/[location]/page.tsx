'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '../../components/ProductCard'
import ProductModal from '../../components/ProductModal'
import Navbar from '../../components/Navbar'
import Footer from '@/app/components/Footer'
import { MapPin, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  type: string
  material: string
  colors: string[]
  base_price: number
  description: string
  reviews_count: number
  purchases_count: number
  views_count: number
  images?: string[]
  created_at: string
  retailers: {
    id: string
    business_name: string
    address: string
    city: string
    province: string
    rating: number
    is_premium: boolean
  } | null
}

export default function LocationPage({ params }: { params: { location: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popularity')

  const locationSlug = params?.location ?? ""
  const cityName = locationSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  useEffect(() => {
    fetchLocationProducts()
  }, [locationSlug])

  const fetchLocationProducts = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          retailers (
            id,
            business_name,
            address,
            city,
            province,
            rating,
            is_premium
          )
        `)
        .eq('is_active', true)

      if (error) throw error

      const locationProducts = data?.filter(product => {
        if (!product.retailers) return false
        const productCity = product.retailers.city.toLowerCase().replace(/\s+/g, '-')
        return productCity === locationSlug.toLowerCase()
      }) || []

      const sortedProducts = locationProducts.sort((a, b) => {
        const aIsPremium = a.retailers?.is_premium || false
        const bIsPremium = b.retailers?.is_premium || false
        
        if (aIsPremium && !bIsPremium) return -1
        if (!aIsPremium && bIsPremium) return 1
        
        return b.purchases_count - a.purchases_count
      })

      setProducts(sortedProducts)
    } catch (error) {
      console.error('Error fetching location products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.type.toLowerCase().includes(query) ||
      product.material.toLowerCase().includes(query) ||
      product.retailers?.business_name.toLowerCase().includes(query)
    )
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.base_price - b.base_price
      case 'price-high':
        return b.base_price - a.base_price
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return b.purchases_count - a.purchases_count
    }
  })

  const uniqueRetailers = [...new Set(products.map(p => p.retailers?.business_name))].filter(Boolean)
  const province = products[0]?.retailers?.province || 'South Africa'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to All Products
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold">
              Memorial Retailers in {cityName}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {province !== 'South Africa' && `${province} • `}
            {uniqueRetailers.length} retailer{uniqueRetailers.length !== 1 ? 's' : ''} • 
            {' '}{products.length} memorial{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-3">
            Quality Memorial Services in {cityName}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Stone Connect connects you with verified memorial retailers in {cityName}, {province}. 
            Compare prices, view designs, and order custom headstones and memorials from trusted local suppliers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by type, material, or retailer..."
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
          >
            <option value="popularity">Sort by: Popularity</option>
            <option value="price-low">Sort by: Price (Low to High)</option>
            <option value="price-high">Sort by: Price (High to Low)</option>
            <option value="newest">Sort by: Newest</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading products in {cityName}...</p>
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No retailers yet in {cityName}
            </h3>
            <p className="text-gray-600 mb-6">
              We're constantly expanding. Check back soon or browse all locations.
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              View All Memorials
            </Link>
          </div>
        )}

        {!loading && sortedProducts.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-2xl text-gray-900">{sortedProducts.length}</span> memorial{sortedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onViewDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </div>
  )
}