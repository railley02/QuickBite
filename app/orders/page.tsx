"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Star, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { CustomerBottomNav } from "@/components/customer-bottom-nav"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface SupabaseOrder {
  id: string
  order_number: number
  customer_name: string
  customer_email: string
  stall_id: string
  stall_name: string
  items: OrderItem[]
  total_amount: number
  status: "pending" | "preparing" | "ready" | "completed"
  payment_method: string
  pickup_time: string
  notes: string | null
  created_at: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [orders, setOrders] = useState<SupabaseOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<SupabaseOrder | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingOrder, setRatingOrder] = useState<SupabaseOrder | null>(null)
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [foodComment, setFoodComment] = useState("")
  const [serviceComment, setServiceComment] = useState("")
  const [displayAsAnonymous, setDisplayAsAnonymous] = useState(false)

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel("customer-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (user?.email) {
      query = query.eq("customer_email", user.email)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
    } else {
      setOrders(data || [])
    }
    setIsLoading(false)
  }

  const getStatusColor = (status: SupabaseOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "preparing":
        return "bg-blue-100 text-blue-700"
      case "ready":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleRate = (order: SupabaseOrder) => {
    setRatingOrder(order)
    setShowRatingModal(true)
  }

  const submitRating = async () => {
    if (ratingOrder) {
      await supabase.from("orders").update({ status: "completed" }).eq("id", ratingOrder.id)
      fetchOrders()
    }
    setShowRatingModal(false)
    setRatingOrder(null)
    setFoodRating(0)
    setServiceRating(0)
    setFoodComment("")
    setServiceComment("")
    setDisplayAsAnonymous(false)
  }

  const handleReceived = async (order: SupabaseOrder) => {
    await supabase.from("orders").update({ status: "completed" }).eq("id", order.id)
    fetchOrders()
  }

  const getQueuePosition = (order: SupabaseOrder) => {
    const pendingOrders = orders.filter(
      (o) =>
        (o.status === "pending" || o.status === "preparing") && new Date(o.created_at) <= new Date(order.created_at),
    )
    return pendingOrders.length
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
      </div>

      {/* Orders List */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link href="/home/customer" className="text-primary font-medium">
              Start ordering
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">Order #{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{order.stall_name}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {(order.status === "pending" || order.status === "preparing") && (
                  <div className="bg-primary/10 rounded-lg p-2 mb-2">
                    <p className="text-xs text-primary font-medium">
                      Queue Position: #{getQueuePosition(order)} • Pickup: {order.pickup_time}
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-2 mt-2">
                  <p className="text-sm text-muted-foreground">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium">₱{order.total_amount}</p>
                    <p className="text-xs text-muted-foreground">Pickup: {order.pickup_time}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  {order.status === "ready" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReceived(order)}
                        className="flex-1 h-9 bg-green-500 text-white text-sm font-medium rounded-lg cursor-pointer"
                      >
                        Mark as Received
                      </button>
                    </div>
                  )}
                  {order.status === "completed" && (
                    <button
                      onClick={() => handleRate(order)}
                      className="w-full h-9 bg-primary text-white text-sm font-medium rounded-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Rate Order
                    </button>
                  )}
                  {(order.status === "pending" || order.status === "preparing") && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full h-9 bg-muted text-foreground text-sm font-medium rounded-lg cursor-pointer flex items-center justify-center gap-1"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Order #{selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground cursor-pointer">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize mt-1 ${getStatusColor(selectedOrder.status)}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {(selectedOrder.status === "pending" || selectedOrder.status === "preparing") && (
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary">
                    You are #{getQueuePosition(selectedOrder)} in queue
                  </p>
                  <p className="text-xs text-primary/80 mt-1">Estimated pickup: {selectedOrder.pickup_time}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Cafeteria</p>
                <p className="font-medium">{selectedOrder.stall_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Pickup Time</p>
                <p className="font-medium">{selectedOrder.pickup_time}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>₱{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span>₱{selectedOrder.total_amount}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">{selectedOrder.payment_method}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && ratingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-foreground mb-1">Rate Your Experience</h3>
            <p className="text-sm text-muted-foreground mb-4">Order #{ratingOrder.order_number}</p>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Food Quality</p>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setFoodRating(star)} className="cursor-pointer">
                    <Star
                      className={`w-8 h-8 ${star <= foodRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Comment"
                value={foodComment}
                onChange={(e) => setFoodComment(e.target.value)}
                className="w-full h-20 p-3 bg-muted rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Service</p>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setServiceRating(star)} className="cursor-pointer">
                    <Star
                      className={`w-8 h-8 ${star <= serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Comment"
                value={serviceComment}
                onChange={(e) => setServiceComment(e.target.value)}
                className="w-full h-20 p-3 bg-muted rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Display as:</p>
              <div className="flex gap-4">
                <button onClick={() => setDisplayAsAnonymous(false)} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!displayAsAnonymous ? "border-primary" : "border-muted-foreground"}`}
                  >
                    {!displayAsAnonymous && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm">My Name</span>
                </button>
                <button onClick={() => setDisplayAsAnonymous(true)} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${displayAsAnonymous ? "border-primary" : "border-muted-foreground"}`}
                  >
                    {displayAsAnonymous && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm">Anonymous</span>
                </button>
              </div>
            </div>

            <button
              onClick={submitRating}
              disabled={foodRating === 0 || serviceRating === 0}
              className="w-full h-12 bg-primary text-white font-medium rounded-full cursor-pointer disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <CustomerBottomNav />
    </main>
  )
}
