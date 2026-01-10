// lib/supabase/orders.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  retailerEmail?: string
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

export async function saveOrder(order: Order) {
  try {
    console.log('💾 Saving order to database:', order.id)
    
    const { data, error } = await supabase
      .from('orders_main')
      .insert([{
        id: order.id,
        customer_data: order.customer,
        cart_items: order.cart,
        cart_total: order.cartTotal,
        commission: order.commission,
        retailer_payout: order.retailerPayout,
        payment_status: 'pending',
        order_status: 'pending',
        payment_id: null,
        retailer_email: order.retailer.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('❌ Error saving order to Supabase:', error)
      throw error
    }

    console.log('✅ Order saved successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to save order:', error)
    throw error
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    console.log('🔍 Fetching order from database:', id)
    
    const { data, error } = await supabase
      .from('orders_main')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Error fetching order:', error)
      throw error
    }

    if (!data) {
      console.log('⚠️ Order not found:', id)
      return null
    }

    // Reconstruct the order object from database format
    const order: Order = {
      id: data.id,
      customer: data.customer_data as Customer,
      cart: data.cart_items as CartItem[],
      cartTotal: parseFloat(data.cart_total),
      commission: parseFloat(data.commission),
      retailerPayout: parseFloat(data.retailer_payout),
      status: data.payment_status === 'paid' ? 'paid' : 'pending',
      pfPaymentId: data.payment_id,
      retailer: {
        email: data.retailer_email
      }
    }

    console.log('✅ Order retrieved successfully')
    return order
  } catch (error) {
    console.error('❌ Error getting order:', error)
    return null
  }
}

export async function updateOrderStatus(id: string, status: 'paid', transactionId?: string) {
  try {
    console.log('🔄 Updating order status:', id, 'to', status)
    
    const { error } = await supabase
      .from('orders_main')
      .update({
        payment_status: status,
        order_status: status,
        payment_id: transactionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Error updating order status:', error)
      throw error
    }

    console.log('✅ Order status updated successfully')
  } catch (error) {
    console.error('❌ Failed to update order status:', error)
    throw error
  }
}

export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders_main')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting all orders:', error)
    return []
  }
}