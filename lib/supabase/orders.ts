type Customer = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

type CartItem = {
  id: string
  productType: string
  selectedColor: string
  basePrice: number
}

export type Order = {
  id: string
  customer: Customer
  cart: CartItem[]
  cartTotal: number
  commission: number
  retailerPayout: number
  status: 'pending' | 'paid'
  pfPaymentId?: string
  retailer: {
    email: string
  }
}

// Simple in-memory storage (replace with a real DB)
const orders: Record<string, Order> = {}

export function saveOrder(order: Order) {
  orders[order.id] = order
}

export function getOrderById(id: string) {
  return orders[id]
}

export function updateOrderStatus(id: string, status: 'paid', pfPaymentId?: string) {
  if (orders[id]) {
    orders[id].status = status
    if (pfPaymentId) orders[id].pfPaymentId = pfPaymentId
  }
}
