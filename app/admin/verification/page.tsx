'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle, XCircle, Eye, Clock, Search, Filter } from 'lucide-react'

interface VerificationDocument {
  id: string
  retailer_id: string
  retailer_name: string
  retailer_email: string
  document_type: string
  file_url: string
  file_name: string
  status: string
  uploaded_at: string
  business_type?: string
  registration_number?: string
}

export default function AdminVerificationDashboard() {
  const router = useRouter()
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const adminAuth = localStorage.getItem('admin_authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchDocuments()
    }
  }, [])

  const handleAdminLogin = () => {
    // Simple password check (replace with real auth in production)
    if (adminPassword === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      fetchDocuments()
    } else {
      alert('Incorrect admin password')
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/verification/list')
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (docId: string) => {
    if (!confirm('Are you sure you want to APPROVE this document?')) return

    try {
      const response = await fetch('/api/admin/verification/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Document approved!')
        fetchDocuments()
        setSelectedDoc(null)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Approval error:', error)
      alert('Failed to approve document')
    }
  }

  const handleReject = async (docId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    if (!confirm('Are you sure you want to REJECT this document?')) return

    try {
      const response = await fetch('/api/admin/verification/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: docId,
          rejectionReason 
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('❌ Document rejected. Retailer has been notified.')
        fetchDocuments()
        setSelectedDoc(null)
        setRejectionReason('')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Rejection error:', error)
      alert('Failed to reject document')
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const matchesSearch = doc.retailer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.retailer_email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to access verification dashboard</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Admin password"
              className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Demo password: admin123
          </p>
        </div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin - Document Verification</h1>
              <p className="text-gray-600">Review and approve retailer verification documents</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_authenticated')
                setIsAuthenticated(false)
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-gray-600 mb-2">Total Documents</p>
            <p className="text-3xl font-bold">{documents.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 shadow-lg border-2 border-yellow-200">
            <p className="text-gray-600 mb-2">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-700">
              {documents.filter(d => d.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
            <p className="text-gray-600 mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-700">
              {documents.filter(d => d.status === 'approved').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-6 shadow-lg border-2 border-red-200">
            <p className="text-gray-600 mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-700">
              {documents.filter(d => d.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by retailer name or email..."
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 border-2 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
                <option value="rejected">Rejected Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 text-xl">No documents found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="text-blue-600" size={32} />
                      <div>
                        <h3 className="text-xl font-bold">{doc.retailer_name}</h3>
                        <p className="text-sm text-gray-600">{doc.retailer_email}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Document Type</p>
                        <p className="font-semibold">{doc.document_type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Business Type</p>
                        <p className="font-semibold">{doc.business_type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Registration #</p>
                        <p className="font-semibold">{doc.registration_number || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(doc.status)}`}>
                        {doc.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(doc.file_url, '_blank')}
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Eye size={18} />
                      View
                    </button>

                    {doc.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold mb-4">Reject Document</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this document. The retailer will receive this feedback via email.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Image is blurry and unreadable. Please upload a clearer copy."
              className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none mb-4 h-32"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDoc(null)
                  setRejectionReason('')
                }}
                className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDoc.id)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}