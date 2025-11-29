'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import RetailerNav from '../../../components/RetailerNav'
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Download } from 'lucide-react'

interface Document {
  type: 'id' | 'registration' | 'proof_of_address'
  name: string
  status: 'pending' | 'approved' | 'rejected' | 'not_uploaded'
  uploadedAt?: string
  rejectionReason?: string
  fileUrl?: string
}

export default function VerificationPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified')
  const [documents, setDocuments] = useState<Document[]>([
    { type: 'id', name: "Owner's ID Document", status: 'not_uploaded' },
    { type: 'registration', name: 'Business Registration Certificate', status: 'not_uploaded' },
    { type: 'proof_of_address', name: 'Proof of Address', status: 'not_uploaded' }
  ])
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  useEffect(() => {
    if (retailer) {
      fetchVerificationStatus()
    }
  }, [retailer])

  const fetchVerificationStatus = async () => {
    try {
      // TODO: Fetch actual verification status from API
      // For now, mock data
      setVerificationStatus('pending')
      setDocuments([
        { type: 'id', name: "Owner's ID Document", status: 'approved', uploadedAt: '2025-01-15' },
        { type: 'registration', name: 'Business Registration Certificate', status: 'pending', uploadedAt: '2025-01-15' },
        { type: 'proof_of_address', name: 'Proof of Address', status: 'not_uploaded' }
      ])
    } catch (error) {
      console.error('Error fetching verification status:', error)
    }
  }

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(documentType)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)
      formData.append('retailerId', retailer?.id || '')

      const response = await fetch('/api/retailer/upload-document', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Document uploaded successfully! We will review it within 24-48 hours.')
        fetchVerificationStatus()
      } else {
        alert('Failed to upload document: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={24} />
      case 'pending':
        return <Clock className="text-yellow-600" size={24} />
      case 'rejected':
        return <XCircle className="text-red-600" size={24} />
      default:
        return <AlertTriangle className="text-gray-400" size={24} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getOverallStatusBanner = () => {
    const allApproved = documents.every(doc => doc.status === 'approved')
    const anyRejected = documents.some(doc => doc.status === 'rejected')
    const anyPending = documents.some(doc => doc.status === 'pending')
    const anyNotUploaded = documents.some(doc => doc.status === 'not_uploaded')

    if (allApproved) {
      return (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-green-600" size={32} />
            <h2 className="text-2xl font-bold text-green-800">Account Verified! 🎉</h2>
          </div>
          <p className="text-green-700">
            Your account is fully verified. You can now list products and start selling on Stone Connect!
          </p>
        </div>
      )
    }

    if (anyRejected) {
      return (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="text-red-600" size={32} />
            <h2 className="text-2xl font-bold text-red-800">Documents Rejected</h2>
          </div>
          <p className="text-red-700">
            Some of your documents were rejected. Please review the reasons below and re-upload corrected documents.
          </p>
        </div>
      )
    }

    if (anyPending && !anyNotUploaded) {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="text-yellow-600" size={32} />
            <h2 className="text-2xl font-bold text-yellow-800">Verification In Progress</h2>
          </div>
          <p className="text-yellow-700">
            Your documents are being reviewed. This typically takes 24-48 hours. We'll notify you via email once complete.
          </p>
        </div>
      )
    }

    return (
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-blue-600" size={32} />
          <h2 className="text-2xl font-bold text-blue-800">Verification Required</h2>
        </div>
        <p className="text-blue-700 mb-3">
          Please upload the required documents to verify your account and start selling on Stone Connect.
        </p>
        <p className="text-sm text-blue-600">
          ⚠️ You cannot list products until your account is verified.
        </p>
      </div>
    )
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-2">Account Verification</h1>
        <p className="text-gray-600 mb-8">Upload your documents to verify your account</p>

        {/* Overall Status Banner */}
        {getOverallStatusBanner()}

        {/* Documents List */}
        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.type} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={32} />
                  <div>
                    <h3 className="text-xl font-bold">{doc.name}</h3>
                    {doc.uploadedAt && (
                      <p className="text-sm text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(doc.status)}`}>
                    {doc.status === 'not_uploaded' ? 'Not Uploaded' : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Rejection Reason */}
              {doc.status === 'rejected' && doc.rejectionReason && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{doc.rejectionReason}</p>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold mb-2">Requirements:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {doc.type === 'id' && (
                    <>
                      <li>• Valid South African ID, Passport, or Driver's License</li>
                      <li>• Must be clear and readable</li>
                      <li>• Not expired</li>
                    </>
                  )}
                  {doc.type === 'registration' && (
                    <>
                      <li>• CIPC certificate, CK1 form, or proof of incorporation</li>
                      <li>• Must match business name on registration</li>
                      <li>• For sole proprietors: Affidavit or tax clearance</li>
                    </>
                  )}
                  {doc.type === 'proof_of_address' && (
                    <>
                      <li>• Utility bill, bank statement, or municipal account</li>
                      <li>• Must not be older than 3 months</li>
                      <li>• Must show business address</li>
                    </>
                  )}
                  <li>• Accepted formats: PDF, JPG, PNG</li>
                  <li>• Maximum file size: 5MB</li>
                </ul>
              </div>

              {/* Upload Button */}
              {(doc.status === 'not_uploaded' || doc.status === 'rejected') && (
                <div>
                  <input
                    type="file"
                    id={`upload-${doc.type}`}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(doc.type, file)
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor={`upload-${doc.type}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold cursor-pointer transition-colors ${
                      uploading === doc.type
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : doc.status === 'rejected'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {uploading === doc.type ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        {doc.status === 'rejected' ? 'Re-upload Document' : 'Upload Document'}
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Download/View Button for uploaded docs */}
              {doc.status === 'approved' && doc.fileUrl && (
                <button
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                  className="flex items-center justify-center gap-2 w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                >
                  <Download size={20} />
                  View Uploaded Document
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="text-blue-600" size={24} />
            Need Help?
          </h3>
          <p className="text-gray-700 mb-3">
            If you're having trouble uploading documents or have questions about the verification process:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>📧 Email: rerglobalventures@gmail.com</p>
            <p>📞 Phone: +27 83 574 7160</p>
            <p>⏰ Business Hours: Mon-Fri, 8:00 AM - 5:00 PM SAST</p>
          </div>
        </div>
      </div>
    </div>
  )
}