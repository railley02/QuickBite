"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, ClipboardList, BarChart3, UtensilsCrossed, User } from "lucide-react"
import { useVendor } from "@/lib/vendor-context"
import type { Order } from "@/lib/mock-data"

type FilterStatus = "all" | "pending" | "preparing" | "ready" | "completed"

export default function VendorOrdersPage() {
  const { vendorOrders, updateOrderStatus } = useVendor()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [cookMode, setCookMode] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState("10:00 - 10:15 AM")

  const filteredOrders = filterStatus === "all" ? vendorOrders : vendorOrders.filter((o) => o.status === filterStatus)

  const statusOptions: Order["status"][] = ["pending", "preparing", "ready", "completed"]

  const getNextStatus = (current: Order["status"]): Order["status"] | null => {
    const idx = statusOptions.indexOf(current)
    return idx < statusOptions.length - 1 ? statusOptions[idx + 1] : null
  }

  const cookModeItems = vendorOrders
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .flatMap((o) => o.items)
    .reduce(
      (acc, item) => {
        const existing = acc.find((a) => a.name === item.item.name)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          acc.push({ name: item.item.name, quantity: item.quantity })
        }
        return acc
      },
      [] as { name: string; quantity: number }[],
    )

  const handleCookModeStatusChange = (itemName: string, newStatus: Order["status"]) => {
    const ordersToUpdate = vendorOrders.filter(
      (o) => (o.status === "pending" || o.status === "preparing") && o.items.some((i) => i.item.name === itemName),
    )
    ordersToUpdate.forEach((order) => {
      updateOrderStatus(order.id, newStatus)
    })
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Orders</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cook Mode</span>
            <button
              onClick={() => setCookMode(!cookMode)}
              className={`w-12 h-6 rounded-full transition-colors ${cookMode ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${cookMode ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        {!cookMode && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(["all", "pending", "preparing", "ready", "completed"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize cursor-pointer ${
                  filterStatus === status ? "bg-primary text-white" : "bg-muted text-foreground"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        )}

        {/* Cook Mode Slot Selector */}
        {cookMode && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Current Pickup Time Slot</span>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="px-3 py-1.5 bg-muted rounded-lg text-sm"
            >
              <option>10:00 - 10:15 AM</option>
              <option>10:15 - 10:30 AM</option>
              <option>10:30 - 10:45 AM</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {cookMode ? (
          <div className="space-y-3">
            {cookModeItems.map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">Qty: {item.quantity}</span>
                </div>
                <select
                  onChange={(e) => handleCookModeStatusChange(item.name, e.target.value as Order["status"])}
                  className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium cursor-pointer"
                  defaultValue="pending"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{order.orderNumber}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 text-sm text-muted-foreground">
                  <p>Items: {order.items.map((i) => `${i.item.name}`).join(", ")}</p>
                  <p>Payment: {order.paymentMethod === "cash" ? "Cash" : "E-Payment"}</p>
                  <p>Pickup Time: {order.pickupSlot.time}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize cursor-pointer ${
                      order.status === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : order.status === "preparing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No orders found</div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/vendor" className="flex flex-col items-center text-zinc-600">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/vendor/orders" className="flex flex-col items-center text-primary">
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
