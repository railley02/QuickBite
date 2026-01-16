"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Home,
  ClipboardList,
  BarChart3,
  UtensilsCrossed,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

type TimeRange = "today" | "week" | "month" | "custom"

interface OrderData {
  id: string
  order_number: number
  customer_name: string
  items: { id: string; name: string; price: number; quantity: number }[]
  total_amount: number
  status: string
  payment_method: string
  created_at: string
}

export default function VendorSalesPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>("today")
  const [currentMonth, setCurrentMonth] = useState("January 2026")
  const [showCustomDateModal, setShowCustomDateModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [user?.stallId])

  const fetchOrders = async () => {
    if (!user?.stallId) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("stall_id", user.stallId)
      .order("created_at", { ascending: false })

    if (data) {
      setOrders(data)
    }
    setIsLoading(false)
  }

  // Filter orders based on time range
  const getFilteredOrders = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at)
      if (timeRange === "today") {
        return orderDate >= today
      } else if (timeRange === "week") {
        return orderDate >= weekAgo
      } else if (timeRange === "month") {
        return orderDate >= monthAgo
      }
      return true
    })
  }

  const filteredOrders = getFilteredOrders()
  const completedOrders = filteredOrders.filter((o) => o.status === "completed")

  // Calculate stats
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const totalOrders = completedOrders.length
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Calculate daily sales for chart
  const dailySales = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.created_at)
      return orderDate >= dayStart && orderDate < dayEnd && o.status === "completed"
    })

    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
      amount: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
    }
  })

  const maxAmount = Math.max(...dailySales.map((d) => d.amount), 1)

  // Calculate top items
  const itemSales = completedOrders
    .flatMap((o) => o.items)
    .reduce(
      (acc, item) => {
        const existing = acc.find((a) => a.name === item.name)
        if (existing) {
          existing.sold += item.quantity
          existing.revenue += item.price * item.quantity
        } else {
          acc.push({ name: item.name, sold: item.quantity, revenue: item.price * item.quantity })
        }
        return acc
      },
      [] as { name: string; sold: number; revenue: number }[],
    )
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)

  const recentOrders = filteredOrders.slice(0, 3).map((o) => ({
    id: o.order_number.toString(),
    customer: o.customer_name,
    items: o.items.map((i) => i.name).join(", "),
    total: o.total_amount,
    payment: o.payment_method === "cash" ? "Cash" : "E-Payment",
    time: new Date(o.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  }))

  const handleExportCSV = () => {
    const csv = [
      ["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date"],
      ...completedOrders.map((o) => [
        o.order_number,
        o.customer_name,
        o.items.map((i) => i.name).join("; "),
        o.total_amount,
        o.payment_method,
        o.status,
        new Date(o.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-${timeRange}-${Date.now()}.csv`
    a.click()
  }

  const handlePrevMonth = () => {
    setCurrentMonth("December 2025")
  }

  const handleNextMonth = () => {
    setCurrentMonth("February 2026")
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
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Sales History</h1>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevMonth} className="p-2 cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-medium text-foreground">{currentMonth}</span>
          <button onClick={handleNextMonth} className="p-2 cursor-pointer">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Time Range Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {(["today", "week", "month", "custom"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => {
                if (range === "custom") {
                  setShowCustomDateModal(true)
                } else {
                  setTimeRange(range)
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize cursor-pointer whitespace-nowrap ${
                timeRange === range ? "bg-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              {range === "today"
                ? "Today"
                : range === "week"
                  ? "This Week"
                  : range === "month"
                    ? "This Month"
                    : "Custom"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-base font-bold text-foreground">₱{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 mt-0.5">+12%</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
            <p className="text-base font-bold text-foreground">{totalOrders}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{totalOrders} completed</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Order</p>
            <p className="text-base font-bold text-foreground">₱{avgOrder.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 mt-0.5">+₱5.20</p>
          </div>
        </div>

        {/* Revenue This Week Chart */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Revenue This Week</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {dailySales.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{
                    height: `${maxAmount ? (day.amount / maxAmount) * 100 : 0}%`,
                    minHeight: day.amount > 0 ? "8px" : "0",
                  }}
                />
                <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Top Items</h2>
          {itemSales.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {itemSales.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">{idx + 1}.</span>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{item.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-sm text-primary font-medium">
              View All Orders →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-foreground">
                        Order #{order.id} - {order.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.items}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">₱{order.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{order.payment}</span>
                    <span>{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCustomDateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Custom Date Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="flex-1 h-12 bg-muted text-foreground font-medium rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTimeRange("custom")
                    setShowCustomDateModal(false)
                  }}
                  className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/vendor" className="flex flex-col items-center text-zinc-600">
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
          <Link href="/vendor/sales" className="flex flex-col items-center text-primary">
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
