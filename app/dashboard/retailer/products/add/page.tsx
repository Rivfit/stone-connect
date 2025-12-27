'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../../components/RetailerNav'
import { ArrowLeft, Upload, Check, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isVerified, setIsVerified] = useState(false)
  const [checkingVerification, setCheckingVerification] = useState(true)

  const [formData, setFormData] = useState({
    type: '',
    material: '',
    colors: '',
    basePrice: '',
    description: '',
    installationIncluded: false,
    installationOption: 'included',
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

      const hasAllApproved = data && data.length >= 3 && 
        data.every(doc => doc.status === 'approved')
      
      setIsVerified(hasAllApproved)
    } catch (error) {
      console.error('Error checking verification:', error)
    } finally {
      setCheckingVerification(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({
        ...formData,
        [name]: checked
      })
    } else {
      setFormData({
        ...formData,
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
        const formDataImg = new FormData()
        formDataImg.append('file', file)
        formDataImg.append('upload_preset', 'stone_connect_unsigned')
        formDataImg.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)
        formDataImg.append('folder', `products/${retailer?.id}`)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formDataImg,
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
    
    if (!retailer) {
      alert('Error: No retailer information found')
      return
    }

    if (!isVerified) {
      alert('Your account must be verified before you can add products')
      router.push('/dashboard/retailer/verification')
      return
    }
    
    if (uploadedImages.length === 0) {
      if (!confirm('No images uploaded. Continue without images?')) {
        return
      }
    }

    if (!formData.installationIncluded && formData.installationOption === 'range') {
      if (!formData.installationPriceMin || !formData.installationPriceMax) {
        alert('Please provide both minimum and maximum installation prices for the range option.')
        return
      }
      if (parseFloat(formData.installationPriceMin) >= parseFloat(formData.installationPriceMax)) {
        alert('Maximum installation price must be greater than minimum price.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const colorsArray = formData.colors.split(',').map(c => c.trim())

      const installationData = {
        installation_included: formData.installationIncluded,
        installation_option: formData.installationIncluded ? 'included' : formData.installationOption,
        installation_price_min: !formData.installationIncluded && formData.installationOption === 'range' 
          ? parseFloat(formData.installationPriceMin) 
          : null,
        installation_price_max: !formData.installationIncluded && formData.installationOption === 'range' 
          ? parseFloat(formData.installationPriceMax) 
          : null,
      }

      console.log('Creating product for retailer:', retailer.id)

      const { data, error } = await supabase
        .from('products')
        .insert({
          retailer_id: retailer.id,
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
          ...installationData
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Product created successfully:', data)
      alert('✅ Product added successfully!')
      router.push('/dashboard/retailer/products')
    } catch (error: any) {
      console.error('Error adding product:', error)
      alert(`❌ Error adding product: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !retailer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (checkingVerification) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RetailerNav />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Checking verification status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isVerified) {
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

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8 text-center">
            <AlertCircle className="mx-auto text-yellow-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Account Not Verified</h2>
            <p className="text-yellow-700 mb-6">
              You must complete the verification process before you can add products.
            </p>
            <Link
              href="/dashboard/retailer/verification"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Go to Verification →
            </Link>
          </div>
        </div>
      </div>
    )
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

          {/* Installation Section */}
          <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Installation Options</h3>
            
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="installationIncluded"
                  checked={formData.installationIncluded}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-700">
                  Installation is included in the product price
                </span>
              </label>
            </div>

            {!formData.installationIncluded && (
              <div className="space-y-4 mt-4 pl-8 border-l-4 border-blue-300">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Installation Pricing Option *
                  </label>
                  <select
                    name="installationOption"
                    value={formData.installationOption}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="range">Price Range</option>
                    <option value="contact">Contact for Quote</option>
                  </select>
                </div>

                {formData.installationOption === 'range' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">
                        Min Price (R) *
                      </label>
                      <input
                        type="number"
                        name="installationPriceMin"
                        required={!formData.installationIncluded && formData.installationOption === 'range'}
                        min="0"
                        step="100"
                        value={formData.installationPriceMin}
                        onChange={handleChange}
                        className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="e.g., 500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">
                        Max Price (R) *
                      </label>
                      <input
                        type="number"
                        name="installationPriceMax"
                        required={!formData.installationIncluded && formData.installationOption === 'range'}
                        min="0"
                        step="100"
                        value={formData.installationPriceMax}
                        onChange={handleChange}
                        className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="e.g., 1500"
                      />
                    </div>
                  </div>
                )}

                {formData.installationOption === 'contact' && (
                  <div className="bg-white border border-blue-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      ℹ️ Customers will see: <strong>"Installation available - Contact for quote"</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
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