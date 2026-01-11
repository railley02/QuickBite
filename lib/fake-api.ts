// QuickBite Fake API - Simulates backend calls with delays

import {
  cafeterias,
  menuItems,
  categories,
  pickupSlots,
  type Cafeteria,
  type MenuItem,
  type Category,
  type PickupSlot,
  type Order,
  type CartItem,
} from "./mock-data"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// GET /api/cafeterias - Fetch all cafeterias
export async function getCafeterias(): Promise<Cafeteria[]> {
  await delay(300)
  return [...cafeterias].sort((a, b) => a.stallNumber - b.stallNumber)
}

export async function searchCafeterias(query: string): Promise<Cafeteria[]> {
  await delay(150)
  const lowercaseQuery = query.toLowerCase()
  return cafeterias
    .filter((c) => c.name.toLowerCase().includes(lowercaseQuery))
    .sort((a, b) => a.stallNumber - b.stallNumber)
}

export async function getRecommendedItems(): Promise<MenuItem[]> {
  await delay(200)
  return menuItems.filter((item) => item.isPopular)
}

// GET /api/cafeteria/:id - Fetch single cafeteria
export async function getCafeteria(id: string): Promise<Cafeteria | null> {
  await delay(200)
  return cafeterias.find((c) => c.id === id) || null
}

// GET /api/menu - Fetch all menu items
export async function getMenuItems(cafeteriaId?: string): Promise<MenuItem[]> {
  await delay(500)
  if (cafeteriaId) {
    return menuItems.filter((item) => item.stallId === cafeteriaId)
  }
  return [...menuItems]
}

// GET /api/categories - Fetch all categories
export async function getCategories(): Promise<Category[]> {
  await delay(200)
  return [...categories]
}

// GET /api/slots - Fetch available pickup slots
export async function getPickupSlots(): Promise<PickupSlot[]> {
  await delay(300)
  return pickupSlots.filter((slot) => slot.available)
}

// GET /api/menu/:id - Fetch single menu item
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  await delay(200)
  return menuItems.find((item) => item.id === id) || null
}

// POST /api/orders - Place a new order
export async function placeOrder(
  cartItems: CartItem[],
  paymentMethod: "cash" | "online",
  notes: string,
  cafeteriaId: string,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  await delay(800)

  // Validate items exist and have stock
  for (const cartItem of cartItems) {
    const menuItem = menuItems.find((m) => m.id === cartItem.item.id)
    if (!menuItem) {
      return { success: false, error: `Item ${cartItem.item.name} not found` }
    }
    if (menuItem.stock < cartItem.quantity) {
      return { success: false, error: `${menuItem.name} is out of stock` }
    }
  }

  // Find earliest available slot
  const availableSlot = pickupSlots.find((s) => s.available && s.booked < s.capacity)
  if (!availableSlot) {
    return { success: false, error: "No available pickup slots" }
  }

  // Calculate total
  const totalAmount = cartItems.reduce((sum, ci) => {
    return sum + ci.item.price * ci.quantity
  }, 0)

  // Find cafeteria name
  const cafeteria = cafeterias.find((c) => c.id === cafeteriaId)

  // Create order
  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: Math.floor(Math.random() * 100) + 1,
    items: cartItems,
    status: paymentMethod === "online" ? "confirmed" : "pending",
    pickupSlot: availableSlot,
    totalAmount,
    paymentMethod,
    notes: notes || undefined,
    customerName: "Student User",
    createdAt: new Date().toISOString(),
    cafeteriaId,
    cafeteriaName: cafeteria?.name || "Unknown Cafeteria",
  }

  return { success: true, order }
}

// GET /api/orders/:id - Get order status
export async function getOrderStatus(orderId: string): Promise<Order | null> {
  await delay(300)
  // In real app, this would fetch from database
  return null
}

// POST /api/orders/:id/confirm - Confirm payment for order
export async function confirmPayment(orderId: string): Promise<{ success: boolean; error?: string }> {
  await delay(500)
  return { success: true }
}
