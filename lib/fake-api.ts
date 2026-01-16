// QuickBite API - Fetches real data from Supabase

import {
  menuItems as mockMenuItems,
  categories,
  pickupSlots,
  type Cafeteria,
  type MenuItem,
  type Category,
  type PickupSlot,
  type Order,
  type CartItem,
} from "./mock-data"
import { createClient } from "./supabase/client"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getQueueInfo(): Promise<Map<string, { queueSize: number; nextPickup: string }>> {
  const queueMap = new Map<string, { queueSize: number; nextPickup: string }>()

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("orders")
      .select("stall_id, pickup_time, status")
      .in("status", ["pending", "preparing"])
      .order("pickup_time", { ascending: true })

    if (error || !data) {
      return queueMap
    }

    data.forEach((order) => {
      const existing = queueMap.get(order.stall_id)
      if (existing) {
        existing.queueSize += 1
      } else {
        queueMap.set(order.stall_id, {
          queueSize: 1,
          nextPickup: order.pickup_time,
        })
      }
    })

    return queueMap
  } catch (err) {
    console.error("Error fetching queue info:", err)
    return queueMap
  }
}

export async function getCafeterias(): Promise<Cafeteria[]> {
  await delay(300)

  try {
    const supabase = createClient()
    const { data: stalls, error } = await supabase.from("stalls").select("*").order("stall_number", { ascending: true })

    if (error || !stalls || stalls.length === 0) {
      console.error("Error fetching stalls:", error)
      return []
    }

    // Fetch real queue info from Supabase
    const queueInfo = await getQueueInfo()

    // Map Supabase stalls to Cafeteria type
    return stalls.map((stall) => {
      const queue = queueInfo.get(stall.id)
      return {
        id: stall.id,
        name: stall.name,
        image: stall.image || "/main-cafeteria-restaurant.jpg",
        status: stall.status === "open" ? "open" : "closed",
        waitTime: 5,
        queueSize: queue?.queueSize || 0,
        availability: 100,
        stallNumber: stall.stall_number || 1,
        rating: stall.rating || 4.5,
        totalRatings: stall.total_ratings || 0,
        nextPickup: queue?.nextPickup || "No orders",
      } as Cafeteria
    })
  } catch (err) {
    console.error("Error in getCafeterias:", err)
    return []
  }
}

export async function searchCafeterias(query: string): Promise<Cafeteria[]> {
  await delay(150)

  try {
    const supabase = createClient()
    const { data: stalls, error } = await supabase
      .from("stalls")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("stall_number", { ascending: true })

    if (error || !stalls) {
      return []
    }

    const queueInfo = await getQueueInfo()

    return stalls.map((stall) => {
      const queue = queueInfo.get(stall.id)
      return {
        id: stall.id,
        name: stall.name,
        image: stall.image || "/main-cafeteria-restaurant.jpg",
        status: stall.status === "open" ? "open" : "closed",
        waitTime: 5,
        queueSize: queue?.queueSize || 0,
        availability: 100,
        stallNumber: stall.stall_number || 1,
        rating: stall.rating || 4.5,
        totalRatings: stall.total_ratings || 0,
        nextPickup: queue?.nextPickup || "No orders",
      } as Cafeteria
    })
  } catch (err) {
    console.error("Error in searchCafeterias:", err)
    return []
  }
}

export async function getRecommendedItems(): Promise<MenuItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(6)

    if (error || !data || data.length === 0) {
      return []
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: item.image || "/placeholder.svg",
      category: item.category,
      stock: item.stock,
      stallId: item.stall_id,
      stallName: item.stall_name,
      stallNumber: item.stall_number || 1,
      isPopular: true,
    }))
  } catch (err) {
    console.error("Error in getRecommendedItems:", err)
    return []
  }
}

export async function getCafeteria(id: string): Promise<Cafeteria | null> {
  await delay(200)

  try {
    const supabase = createClient()
    const { data: stall, error } = await supabase.from("stalls").select("*").eq("id", id).single()

    if (error || !stall) {
      return null
    }

    const queueInfo = await getQueueInfo()
    const queue = queueInfo.get(id)

    return {
      id: stall.id,
      name: stall.name,
      image: stall.image || "/main-cafeteria-restaurant.jpg",
      status: stall.status === "open" ? "open" : "closed",
      waitTime: 5,
      queueSize: queue?.queueSize || 0,
      availability: 100,
      stallNumber: stall.stall_number || 1,
      rating: stall.rating || 4.5,
      totalRatings: stall.total_ratings || 0,
      nextPickup: queue?.nextPickup || "No orders",
    } as Cafeteria
  } catch (err) {
    console.error("Error in getCafeteria:", err)
    return null
  }
}

export async function getMenuItems(cafeteriaId?: string): Promise<MenuItem[]> {
  try {
    const supabase = createClient()
    let query = supabase.from("menu_items").select("*").order("name")

    if (cafeteriaId) {
      query = query.eq("stall_id", cafeteriaId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return []
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: item.image || "/placeholder.svg",
      category: item.category,
      stock: item.stock,
      stallId: item.stall_id,
      stallName: item.stall_name,
      stallNumber: item.stall_number || 1,
      isPopular: item.stock > 10,
    }))
  } catch (err) {
    console.error("Error in getMenuItems:", err)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  await delay(200)
  return [...categories]
}

export async function getPickupSlots(): Promise<PickupSlot[]> {
  await delay(300)
  return pickupSlots.filter((slot) => slot.available)
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
  await delay(200)
  return mockMenuItems.find((item) => item.id === id) || null
}

export async function placeOrder(
  cartItems: CartItem[],
  paymentMethod: "cash" | "online",
  notes: string,
  cafeteriaId: string,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  await delay(800)

  for (const cartItem of cartItems) {
    const menuItem = mockMenuItems.find((m) => m.id === cartItem.item.id)
    if (!menuItem) {
      return { success: false, error: `Item ${cartItem.item.name} not found` }
    }
    if (menuItem.stock < cartItem.quantity) {
      return { success: false, error: `${menuItem.name} is out of stock` }
    }
  }

  const availableSlot = pickupSlots.find((s) => s.available && s.booked < s.capacity)
  if (!availableSlot) {
    return { success: false, error: "No available pickup slots" }
  }

  const totalAmount = cartItems.reduce((sum, ci) => {
    return sum + ci.item.price * ci.quantity
  }, 0)

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
    cafeteriaName: "Cafeteria",
  }

  return { success: true, order }
}

export async function getOrderStatus(orderId: string): Promise<Order | null> {
  await delay(300)
  return null
}

export async function confirmPayment(orderId: string): Promise<{ success: boolean; error?: string }> {
  await delay(500)
  return { success: true }
}
