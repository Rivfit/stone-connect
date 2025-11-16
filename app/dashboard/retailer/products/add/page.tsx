'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../../components/RetailerAuthContext'
import { createClient } from '@/lib/supabase/client'
import RetailerNav from '../../../../components/RetailerNav'
import { ArrowLeft, Upload, Check } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    type: '',
    material: '',
    colors: '',
    basePrice: '',
    description: ''
  })

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  if (isLoading || !retailer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Split colors by comma
      const colorsArray = formData.colors.split(',').map(c => c.trim())

      const { data, error } = await supabase
        .from('products')
        .insert({
          type: formData.type,
          material: formData.material,
          colors: colorsArray,
          base_price: parseFloat(formData.basePrice),
          description: formData.description,
          is_active: true,
          reviews_count: 0,
          purchases_count: 0,
          views_count: 0,
        })
        .select()

      if (error) throw error

      alert('✅ Product added successfully!')
      router.push('/dashboard/retailer/products')
    } catch (error) {
      console.error('Error adding product:', error)
      alert('❌ Error adding product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard/retailer/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <h1 className="text-4xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Product Type *
              </label>
              <input
                type="text"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="e.g., Upright Headstone"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Material *
              </label>
              <select
                name="material"
                required
                value={formData.material}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="">Select material</option>
                <option value="Black Granite">Black Granite</option>
                <option value="Grey Granite">Grey Granite</option>
                <option value="Red Granite">Red Granite</option>
                <option value="White Marble">White Marble</option>
                <option value="Rose Marble">Rose Marble</option>
                <option value="Sandstone">Sandstone</option>
                <option value="Limestone">Limestone</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Available Colors (comma separated) *
              </label>
              <input
                type="text"
                name="colors"
                required
                value={formData.colors}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="e.g., Black, Grey, White"
              />
              <p className="text-sm text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Price (R) *
              </label>
              <input
                type="number"
                name="basePrice"
                required
                min="1000"
                step="100"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="e.g., 8500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none resize-none"
              rows={5}
              placeholder="Detailed description of the product..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Upload className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Image Upload Coming Soon</p>
                <p className="text-sm text-blue-700">
                  We're working on image upload functionality. For now, products will display with placeholder images.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Adding Product...
              </>
            ) : (
              <>
                <Check size={20} />
                Add Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}