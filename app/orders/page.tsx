"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, UtensilsCrossed, ShoppingCart, User, Star, ChevronRight } from "lucide-react"
import { useOrders } from "@/lib/orders-context"
import { useCart } from "@/lib/cart-context"
import type { Order } from "@/lib/mock-data"

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useOrders()
  const { totalItems } = useCart()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null)
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [foodComment, setFoodComment] = useState("")
  const [serviceComment, setServiceComment] = useState("")
  const [displayAsAnonymous, setDisplayAsAnonymous] = useState(false)

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "preparing":
        return "bg-purple-100 text-purple-700"
      case "ready":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleRate = (order: Order) => {
    setRatingOrder(order)
    setShowRatingModal(true)
  }

  const submitRating = () => {
    if (ratingOrder) {
      updateOrderStatus(ratingOrder.id, "completed")
    }
    setShowRatingModal(false)
    setRatingOrder(null)
    setFoodRating(0)
    setServiceRating(0)
    setFoodComment("")
    setServiceComment("")
    setDisplayAsAnonymous(false)
  }

  const handleReceived = (order: Order) => {
    updateOrderStatus(order.id, "completed")
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
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
                    <p className="font-semibold text-foreground">Order #{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.cafeteriaName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-border pt-2 mt-2">
                  <p className="text-sm text-muted-foreground">
                    {order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium">₱{order.totalAmount}</p>
                    <p className="text-xs text-muted-foreground">Pickup: {order.pickupSlot.time}</p>
                  </div>
                </div>

                {/* Actions based on status */}
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
                  {(order.status === "pending" || order.status === "confirmed" || order.status === "preparing") && (
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
              <h3 className="text-lg font-bold text-foreground">Order #{selectedOrder.orderNumber}</h3>
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

              <div>
                <p className="text-sm text-muted-foreground">Cafeteria</p>
                <p className="font-medium">{selectedOrder.cafeteriaName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Pickup Time</p>
                <p className="font-medium">{selectedOrder.pickupSlot.time}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>
                      {item.quantity}x {item.item.name}
                    </span>
                    <span>₱{item.item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span>₱{selectedOrder.totalAmount}</span>
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
                <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
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
            <p className="text-sm text-muted-foreground mb-4">Order #{ratingOrder.orderNumber}</p>

            {/* Food Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Food Quality: ★★★★★</p>
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

            {/* Service Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Service: ★★★★★</p>
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

            {/* Display As section with radio buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Display as:</p>
              <div className="flex gap-4">
                <button onClick={() => setDisplayAsAnonymous(false)} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      !displayAsAnonymous ? "border-primary" : "border-muted-foreground"
                    }`}
                  >
                    {!displayAsAnonymous && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm">My Name</span>
                </button>
                <button onClick={() => setDisplayAsAnonymous(true)} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      displayAsAnonymous ? "border-primary" : "border-muted-foreground"
                    }`}
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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/customer" className="flex flex-col items-center text-muted-foreground">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/cafeterias" className="flex flex-col items-center text-muted-foreground">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs mt-1">Cafeterias</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-muted-foreground relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs mt-1">Basket</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/profile/customer" className="flex flex-col items-center text-muted-foreground">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
