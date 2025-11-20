'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../../components/RetailerNav'
import { ArrowLeft, Upload, Check, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploadedImages.length === 0) {
      if (!confirm('No images uploaded. Continue without images?')) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      
      const colorsArray = formData.colors.split(',').map(c => c.trim())

      const { data, error } = await supabase
        .from('products')
        .insert({
          type: formData.type,
          material: formData.material,
          colors: colorsArray,
          base_price: parseFloat(formData.basePrice),
          description: formData.description,
          images: uploadedImages.length > 0 ? uploadedImages : [],
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
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
            <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <ImageIcon size={24} />
              Product Images
            </label>
            
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
              id="image-upload"
            />
            
            <label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
                uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="text-blue-600 mb-3" size={48} />
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {uploadingImages ? 'Uploading...' : 'Click to upload images'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
            </label>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rest of Form */}
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

          <button
            type="submit"
            disabled={isSubmitting || uploadingImages}
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