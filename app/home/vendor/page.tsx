"use client"

import Link from "next/link"
import { Home, ClipboardList, BarChart3, UtensilsCrossed, User, AlertTriangle, ChevronRight } from "lucide-react"
import { useVendor } from "@/lib/vendor-context"

export default function VendorHomePage() {
  const {
    stallName,
    isOpen,
    isPaused,
    vendorOrders,
    menuItems,
    todaySales,
    toggleOpen,
    togglePause,
    updateOrderStatus,
  } = useVendor()

  const pendingCount = vendorOrders.filter((o) => o.status === "pending").length
  const preparingCount = vendorOrders.filter((o) => o.status === "preparing").length
  const readyCount = vendorOrders.filter((o) => o.status === "ready").length

  const lowStockItems = menuItems.filter((i) => i.stock <= 5 && i.stock > 0)
  const nextPickup =
    vendorOrders.find((o) => o.status === "pending" || o.status === "preparing")?.pickupSlot.time || "—"
  const inQueue = vendorOrders.filter((o) => o.status !== "completed").length

  const markAllReady = () => {
    vendorOrders.filter((o) => o.status === "preparing").forEach((o) => updateOrderStatus(o.id, "ready"))
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FF6901] to-orange-500 px-4 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-sm">QUICKBITE</p>
            <h1 className="text-xl font-bold text-white">Stall 1 - {stallName}</h1>
          </div>
          <button
            onClick={toggleOpen}
            className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
              isOpen ? "bg-white text-[#FF6901]" : "bg-orange-800 text-white"
            }`}
          >
            {isOpen ? "Close" : "Open"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-400" : "bg-red-300"}`} />
          <span className="text-white/90 text-sm">
            {isOpen ? (isPaused ? "Paused - Not Accepting Orders" : "Open & Accepting Orders") : "Closed"}
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
          <span>In Queue: {inQueue}</span>
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
            onClick={togglePause}
            className={`py-3 rounded-xl font-medium cursor-pointer ${
              isPaused ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
            }`}
          >
            {isPaused ? "Resume Orders" : "Pause Orders"}
          </button>
        </div>

        {/* Recent Orders */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Active Orders</h2>
            <Link href="/vendor/orders" className="text-sm text-primary font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {vendorOrders
              .filter((o) => o.status !== "completed")
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">{order.orderNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.map((i) => i.item.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "preparing"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment: {order.paymentMethod}</span>
                    <span className="text-muted-foreground">Pickup: {order.pickupSlot.time}</span>
                  </div>
                </div>
              ))}
          </div>
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
