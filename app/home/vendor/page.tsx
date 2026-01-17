"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ClipboardList, BarChart3, UtensilsCrossed, User, AlertTriangle, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

interface VendorOrder {
  id: string
  order_number: number
  customer_name: string
  items: { id: string; name: string; price: number; quantity: number }[]
  total_amount: number
  status: "pending" | "preparing" | "ready" | "completed"
  payment_method: string
  pickup_time: string
  created_at: string
  stall_id: string
}

interface VendorMenuItem {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

interface StallInfo {
  id: string
  name: string
  stall_number: number
  status: "open" | "closed"
  operating_hours: string
}

export default function VendorHomePage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [stall, setStall] = useState<StallInfo | null>(null)
  const [orders, setOrders] = useState<VendorOrder[]>([])
  const [menuItems, setMenuItems] = useState<VendorMenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const fetchData = async () => {
    if (!user?.stallId) {
      setIsLoading(false)
      return
    }

    const { data: stallData, error: stallError } = await supabase
      .from("stalls")
      .select("*")
      .eq("id", user.stallId)
      .single()

    if (stallData) {
      setStall(stallData)
    }

    const { data: stallOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("stall_id", user.stallId)
      .order("created_at", { ascending: false })

    if (stallOrders) {
      setOrders(stallOrders)
    }

    const { data: menuData, error: menuError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("stall_id", user.stallId)

    if (menuData) {
      setMenuItems(menuData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Set up realtime subscription
    const channel = supabase
      .channel("vendor-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        fetchData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        fetchData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "stalls" }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.stallId])

  const toggleOpen = async () => {
    if (!stall) return
    const newStatus = stall.status === "open" ? "closed" : "open"
    await supabase.from("stalls").update({ status: newStatus }).eq("id", stall.id)
    setStall({ ...stall, status: newStatus })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)
    fetchData()
  }

  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.created_at).toDateString()
    const today = new Date().toDateString()
    return orderDate === today
  })

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const preparingCount = orders.filter((o) => o.status === "preparing").length
  const readyCount = orders.filter((o) => o.status === "ready").length
  const todaySales = todayOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total_amount, 0)

  const lowStockItems = menuItems.filter((i) => i.stock <= 5 && i.stock > 0)
  const activeOrders = orders.filter((o) => o.status !== "completed")

  const nextPickupOrder = activeOrders
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .sort((a, b) => a.pickup_time.localeCompare(b.pickup_time))[0]
  const nextPickup = nextPickupOrder?.pickup_time || "—"

  const markAllReady = async () => {
    const preparingOrders = orders.filter((o) => o.status === "preparing")
    for (const order of preparingOrders) {
      await updateOrderStatus(order.id, "ready")
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center">
        <img src="/images/unknown.jpg" alt="QuickBite" className="w-32 h-32 mb-4" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FF6901] to-orange-500 px-4 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-sm">QUICKBITE</p>
            <h1 className="text-xl font-bold text-white">
              Stall {stall?.stall_number || 1} - {stall?.name || user?.stallName || "My Cafeteria"}
            </h1>
          </div>
          <button
            onClick={toggleOpen}
            className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
              stall?.status === "open" ? "bg-white text-[#FF6901]" : "bg-orange-800 text-white"
            }`}
          >
            {stall?.status === "open" ? "Close" : "Open"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <span className={`w-2 h-2 rounded-full ${stall?.status === "open" ? "bg-green-400" : "bg-red-300"}`} />
          <span className="text-white/90 text-sm">
            {stall?.status === "open"
              ? isPaused
                ? "Paused - Not Accepting Orders"
                : "Open & Accepting Orders"
              : "Closed"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
            <span className="font-bold text-xl text-white">{pendingCount}</span>
            <p className="text-white/80 text-xs">Pending</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
            <span className="font-bold text-xl text-white">{preparingCount}</span>
            <p className="text-white/80 text-xs">Preparing</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
            <span className="font-bold text-xl text-white">{readyCount}</span>
            <p className="text-white/80 text-xs">Ready</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
            <span className="font-bold text-lg text-white">₱{todaySales.toLocaleString()}</span>
            <p className="text-white/80 text-xs">Today</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="flex gap-4 mt-4 text-white/90 text-sm">
          <span>In Queue: {activeOrders.length}</span>
          <span>Next Pickup: {nextPickup}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-700">Low Stock Alert</p>
                <p className="text-sm text-red-600">
                  {lowStockItems.map((i) => `${i.name} (${i.stock} left)`).join(", ")}
                </p>
              </div>
            </div>
            <Link
              href="/vendor/menu"
              className="mt-3 block w-full bg-red-500 text-white text-center py-2.5 rounded-lg font-medium text-sm cursor-pointer"
            >
              Go to Inventory
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={markAllReady}
            disabled={preparingCount === 0}
            className="bg-green-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 cursor-pointer"
          >
            Update All Ready
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`py-3 rounded-xl font-medium cursor-pointer ${
              isPaused ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
            }`}
          >
            {isPaused ? "Resume Orders" : "Pause Orders"}
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <Link href="/vendor/orders" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Manage Orders</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link href="/vendor/menu" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Manage Menu</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link href="/vendor/sales" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">View Reports</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/vendor" className="flex flex-col items-center text-primary">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/vendor/orders" className="flex flex-col items-center text-zinc-600">
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <Link href="/vendor/menu" className="flex flex-col items-center text-zinc-600">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs mt-1">Menu</span>
          </Link>
          <Link href="/vendor/sales" className="flex flex-col items-center text-zinc-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Reports</span>
          </Link>
          <Link href="/profile/vendor" className="flex flex-col items-center text-zinc-600">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
