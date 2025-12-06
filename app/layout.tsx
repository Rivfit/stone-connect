import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from './components/CartContext'
import { RetailerAuthProvider } from './components/RetailerAuthContext'
import { CompareProvider } from '@/app/components/CompareContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stone Connect - Memorial Marketplace',
  description: "South Africa's premier memorial marketplace",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <RetailerAuthProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </RetailerAuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}