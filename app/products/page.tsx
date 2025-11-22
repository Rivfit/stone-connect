'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import Navbar from '../components/Navbar'
import LocationFilter from '../components/LocationFilter'
import Footer from '@/app/components/Footer'
import { Search, MapPin } from 'lucide-react'

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
    city: string
    province: string
    rating: number
    is_premium: boolean
  } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProvince, setSelectedProvince] = useState('All South Africa')
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedProvince, selectedCity, searchQuery])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        retailers (
          business_name,
          address,
          city,
          province,
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
    setFilteredProducts(sortedProducts)
    setLoading(false)
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Filter by location
    if (selectedProvince !== 'All South Africa') {
      filtered = filtered.filter(product => 
        product.retailers?.province === selectedProvince
      )

      if (selectedCity) {
        filtered = filtered.filter(product => 
          product.retailers?.city === selectedCity
        )
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.type.toLowerCase().includes(query) ||
        product.material.toLowerCase().includes(query) ||
        product.retailers?.business_name.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  const handleLocationChange = (province: string, city: string) => {
    setSelectedProvince(province)
    setSelectedCity(city)
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
          <h1 className="text-4xl font-bold mb-2">
            Browse Memorials
            {selectedCity && ` in ${selectedCity}, ${selectedProvince}`}
            {!selectedCity && selectedProvince !== 'All South Africa' && ` in ${selectedProvince}`}
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect memorial from our trusted retailers
          </p>
        </div>

        {/* Location Filter */}
        <LocationFilter 
          onLocationChange={handleLocationChange}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
        />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by type, material, or retailer..."
              className="w-full pl-14 pr-4 py-4 border-2 rounded-xl text-lg focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-bold text-2xl text-gray-900">{filteredProducts.length}</span> memorial{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            {(selectedProvince !== 'All South Africa' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedProvince('All South Africa')
                  setSelectedCity('')
                  setSearchQuery('')
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                Clear all filters
              </button>
            )}
          </div>
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

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No memorials found
              {selectedCity && ` in ${selectedCity}`}
              {!selectedCity && selectedProvince !== 'All South Africa' && ` in ${selectedProvince}`}
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search in a different location
            </p>
            <button
              onClick={() => {
                setSelectedProvince('All South Africa')
                setSelectedCity('')
                setSearchQuery('')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              View All Memorials
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
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

      <Footer />
    </div>
  )
}