'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Scale, X, Eye } from 'lucide-react'

// Compare Context
interface CompareContextType {
  compareList: string[]
  addToCompare: (productId: string) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

// Compare Provider
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('compareList')
        if (saved) {
          setCompareList(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Error loading compare list:', error)
      }
    }
  }, [])

  // Save to localStorage whenever compareList changes (client-side only)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('compareList', JSON.stringify(compareList))
      } catch (error) {
        console.error('Error saving compare list:', error)
      }
    }
  }, [compareList, mounted])

  const addToCompare = (productId: string) => {
    if (compareList.length >= 4) {
      alert('You can only compare up to 4 products at a time. Please remove one to add another.')
      return
    }
    if (!compareList.includes(productId)) {
      setCompareList([...compareList, productId])
    }
  }

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(id => id !== productId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (productId: string) => {
    return compareList.includes(productId)
  }

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
      {mounted && compareList.length > 0 && <CompareFloatingBar />}
    </CompareContext.Provider>
  )
}

// Hook to use compare context
export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}

// Floating Compare Bar (shows at bottom when items are in compare list)
function CompareFloatingBar() {
  const { compareList, clearCompare } = useCompare()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Scale size={24} />
          </div>
          <div>
            <p className="font-bold text-lg">Compare Products</p>
            <p className="text-sm text-blue-100">
              {compareList.length} {compareList.length === 1 ? 'product' : 'products'} selected
              {compareList.length >= 2 ? ' - Ready to compare!' : ' - Add more to compare'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length >= 2 ? (
            <a
              href={`/compare?products=${compareList.join(',')}`}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Eye size={20} />
              Compare Now
            </a>
          ) : (
            <div className="text-sm text-blue-100 px-6 py-3">
              Add {2 - compareList.length} more to compare
            </div>
          )}
          
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 bg-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-colors border-2 border-white/30"
          >
            <X size={18} />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>
    </div>
  )
}