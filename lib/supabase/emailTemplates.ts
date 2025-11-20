// lib/emailTemplates.ts

export function buyerEmailTemplate(order: any) {
  return `
    <h1>Thank you for your purchase!</h1>
    <p>Hi ${order.customer.firstName},</p>
    <p>You successfully purchased:</p>
    <ul>
      ${order.cart
        .map(
          (item: any) =>
            `<li>${item.productType} (${item.selectedColor}) - R${item.basePrice}</li>`
        )
        .join('')}
    </ul>
    <p>Total Paid: R${order.cartTotal.toFixed(2)}</p>
    <p>The retailer will contact you directly regarding delivery.</p>
    <p>Order reference: <strong>${order.id}</strong></p>
  `
}

export function retailerEmailTemplate(order: any) {
  return `
    <h1>New Order Received</h1>
    <p>Customer Details:</p>
    <ul>
      <li>Name: ${order.customer.firstName} ${order.customer.lastName}</li>
      <li>Email: ${order.customer.email}</li>
      <li>Phone: ${order.customer.phone}</li>
      <li>Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}</li>
    </ul>
    <p>Order Details:</p>
    <ul>
      ${order.cart
        .map(
          (item: any) =>
            `<li>${item.productType} (${item.selectedColor}) - R${item.basePrice}</li>`
        )
        .join('')}
    </ul>
    <p>Total Paid: R${order.cartTotal.toFixed(2)}</p>
    <p>Platform Commission: R${order.commission.toFixed(2)}</p>
    <p>Retailer Payout: R${order.retailerPayout.toFixed(2)}</p>
    <p>Order reference: <strong>${order.id}</strong></p>
  `
}
