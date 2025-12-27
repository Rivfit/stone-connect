'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../components/RetailerNav'
import Link from 'next/link'
import { Plus, Eye, TrendingUp, Edit, Trash2, X, Upload, Check, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  retailer_id: string
  type: string
  material: string
  colors: string[]
  base_price: number
  images?: string[]
  description: string
  is_active: boolean
  reviews_count: number
  purchases_count: number
  views_count: number
  installation_included?: boolean
  installation_option?: 'included' | 'range' | 'contact'
  installation_price_min?: number
  installation_price_max?: number
  created_at: string
}

export default function ManageProductsPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [editFormData, setEditFormData] = useState({
    type: '',
    material: '',
    colors: '',
    basePrice: '',
    description: '',
    installationIncluded: false,
    installationOption: 'included' as 'included' | 'range' | 'contact',
    installationPriceMin: '',
    installationPriceMax: ''
  })

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  useEffect(() => {
    if (retailer) {
      checkVerificationStatus()
      fetchProducts()
    }
  }, [retailer])

  const checkVerificationStatus = async () => {
    if (!retailer) return

    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select('status')
        .eq('retailer_id', retailer.id)
      
      if (error) throw error

      // Check if all required documents are approved
      const hasAllApproved = data && data.length >= 3 && 
        data.every(doc => doc.status === 'approved')
      
      setIsVerified(hasAllApproved)
    } catch (error) {
      console.error('Error checking verification:', error)
    }
  }

  const fetchProducts = async () => {
    if (!retailer) return

    try {
      console.log('Fetching products for retailer:', retailer.id)
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('retailer_id', retailer.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Products fetched:', data?.length || 0)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setUploadedImages(product.images || [])
    setEditFormData({
      type: product.type,
      material: product.material,
      colors: product.colors.join(', '),
      basePrice: product.base_price.toString(),
      description: product.description,
      installationIncluded: product.installation_included || false,
      installationOption: product.installation_option || 'included',
      installationPriceMin: product.installation_price_min?.toString() || '',
      installationPriceMax: product.installation_price_max?.toString() || ''
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setEditFormData({
        ...editFormData,
        [name]: checked
      })
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'stone_connect_unsigned')
        formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const data = await response.json()
        return data.secure_url
      })

      const urls = await Promise.all(uploadPromises)
      setUploadedImages([...uploadedImages, ...urls])
      alert(`✅ ${urls.length} image(s) uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Error uploading images. Please try again.')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    if (!editFormData.installationIncluded && editFormData.installationOption === 'range') {
      if (!editFormData.installationPriceMin || !editFormData.installationPriceMax) {
        alert('Please provide both minimum and maximum installation prices for the range option.')
        return
      }
      if (parseFloat(editFormData.installationPriceMin) >= parseFloat(editFormData.installationPriceMax)) {
        alert('Maximum installation price must be greater than minimum price.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const colorsArray = editFormData.colors.split(',').map(c => c.trim())

      const installationData = {
        installation_included: editFormData.installationIncluded,
        installation_option: editFormData.installationIncluded ? 'included' : editFormData.installationOption,
        installation_price_min: !editFormData.installationIncluded && editFormData.installationOption === 'range' 
          ? parseFloat(editFormData.installationPriceMin) 
          : null,
        installation_price_max: !editFormData.installationIncluded && editFormData.installationOption === 'range' 
          ? parseFloat(editFormData.installationPriceMax) 
          : null,
      }

      const { error } = await supabase
        .from('products')
        .update({
          type: editFormData.type,
          material: editFormData.material,
          colors: colorsArray,
          base_price: parseFloat(editFormData.basePrice),
          description: editFormData.description,
          images: uploadedImages,
          ...installationData
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      alert('✅ Product updated successfully!')
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('❌ Error updating product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      alert('✅ Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('❌ Error deleting product')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const getInstallationDisplay = (product: Product) => {
    if (product.installation_included) {
      return <span className="text-green-600 text-sm">✓ Installation included</span>
    }
    if (product.installation_option === 'range' && product.installation_price_min && product.installation_price_max) {
      return <span className="text-blue-600 text-sm">Installation: {formatPrice(product.installation_price_min)} - {formatPrice(product.installation_price_max)}</span>
    }
    if (product.installation_option === 'contact') {
      return <span className="text-gray-600 text-sm">Installation: Contact for quote</span>
    }
    return null
  }

  if (isLoading || !retailer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Verification Warning */}
        {!isVerified && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-yellow-800 text-lg mb-2">Account Not Verified</h3>
              <p className="text-yellow-700 mb-3">
                You cannot add products until your account is verified. Please complete the verification process.
              </p>
              <Link
                href="/dashboard/retailer/verification"
                className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Go to Verification →
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Products</h1>
            <p className="text-gray-600">View and manage all your listed products</p>
          </div>
          {isVerified && (
            <Link
              href="/dashboard/retailer/products/add"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-4">No products yet</h3>
            <p className="text-gray-600 mb-6">
              {isVerified 
                ? 'Start by adding your first memorial product'
                : 'Complete verification to start adding products'}
            </p>
            {isVerified && (
              <Link
                href="/dashboard/retailer/products/add"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.type}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🪦</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.type}</h3>
                  <p className="text-gray-600 mb-1 font-semibold">{product.material}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-green-600 mb-2">{formatPrice(product.base_price)}</p>
                  
                  <div className="mb-4">
                    {getInstallationDisplay(product)}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{product.views_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      <span>{product.purchases_count || 0} sold</span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}