'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import Navbar from '../components/Navbar'
import { Search } from 'lucide-react'

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
  retailers: {
    business_name: string
    address: string
    rating: number
    is_premium: boolean
  } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
 const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    retailers (
      business_name,
      address,
      rating,
      is_premium
    )
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false })


    if (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
      return
    }

    // Sort products - premium retailers first, then by popularity
    const sortedProducts = data?.sort((a, b) => {
      const aIsPremium = a.retailers?.is_premium || false
      const bIsPremium = b.retailers?.is_premium || false
      
      if (aIsPremium && !bIsPremium) return -1
      if (!aIsPremium && bIsPremium) return 1
      return b.purchases_count - a.purchases_count
    }) || []

    setProducts(sortedProducts)
    setLoading(false)
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Memorials</h1>
          <p className="text-xl text-gray-600">
            Find the perfect memorial from our trusted retailers
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search by type, material, or retailer..."
              className="w-full pl-14 pr-4 py-4 border-2 rounded-xl text-lg focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-bold text-2xl text-gray-900">{products.length}</span> memorials available
          </p>
          <select className="border-2 rounded-lg px-4 py-2 focus:border-blue-500 outline-none">
            <option>Sort by: Popularity</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
            <option>Sort by: Newest</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">No products available yet</p>
            <p className="text-gray-400">Check back soon for our collection</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Stone Connect. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">South Africa's Memorial Marketplace</p>
        </div>
      </footer>
    </div>
  )
}