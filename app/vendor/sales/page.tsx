"use client"

import { useState } from "react"
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
import { useVendor } from "@/lib/vendor-context"

type TimeRange = "today" | "week" | "month" | "custom"

const mockSalesData = {
  today: { total: 2840, orders: 28, avgOrder: 101 },
  week: { total: 18450, orders: 156, avgOrder: 118 },
  month: { total: 72600, orders: 634, avgOrder: 114 },
  custom: { total: 45200, orders: 412, avgOrder: 110 },
}

const mockDailySales = [
  { day: "Mon", amount: 2400 },
  { day: "Tue", amount: 3200 },
  { day: "Wed", amount: 2800 },
  { day: "Thu", amount: 3500 },
  { day: "Fri", amount: 4200 },
  { day: "Sat", amount: 2350 },
  { day: "Sun", amount: 0 },
]

const mockTopItems = [
  { name: "Shawarma Rice", sold: 42, revenue: 2730 },
  { name: "Adobo Rice", sold: 38, revenue: 2090 },
  { name: "Burger Meal", sold: 28, revenue: 2380 },
  { name: "Fries", sold: 45, revenue: 1575 },
  { name: "Iced Tea", sold: 62, revenue: 1240 },
]

const mockPaymentBreakdown = [
  { method: "Cash", amount: 1840, percentage: 65 },
  { method: "E-Payment", amount: 1000, percentage: 35 },
]

const mockRecentOrders = [
  { id: "17", customer: "Maria Santos", items: "Shawarma Rice, Fries", total: 150, payment: "Cash", time: "10:45 AM" },
  {
    id: "16",
    customer: "Juan Dela Cruz",
    items: "Adobo Rice, Iced Tea",
    total: 85,
    payment: "E-Payment",
    time: "10:30 AM",
  },
  { id: "15", customer: "Anna Reyes", items: "Burger Meal", total: 95, payment: "Cash", time: "10:15 AM" },
]

export default function VendorSalesPage() {
  const { todaySales } = useVendor()
  const [timeRange, setTimeRange] = useState<TimeRange>("today")
  const [currentMonth, setCurrentMonth] = useState("January 2026")
  const [showCustomDateModal, setShowCustomDateModal] = useState(false)

  const currentData = mockSalesData[timeRange]
  const maxAmount = Math.max(...mockDailySales.map((d) => d.amount))

  const handleExportCSV = () => {
    alert("Exporting sales data to CSV...")
  }

  const handlePrevMonth = () => {
    setCurrentMonth("December 2025")
  }

  const handleNextMonth = () => {
    setCurrentMonth("February 2026")
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
            <p className="text-base font-bold text-foreground">₱{currentData.total.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 mt-0.5">+12%</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
            <p className="text-base font-bold text-foreground">{currentData.orders}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{currentData.orders} day avg</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Order</p>
            <p className="text-base font-bold text-foreground">₱{currentData.avgOrder.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 mt-0.5">+₱5.20</p>
          </div>
        </div>

        {/* Revenue This Week Chart */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Revenue This Week</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {mockDailySales.map((day) => (
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
          <div className="space-y-3">
            {mockTopItems.map((item, idx) => (
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
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-sm text-primary font-medium">
              View All Orders →
            </Link>
          </div>
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
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
