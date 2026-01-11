"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Banknote, Clock, CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/orders-context"
import { placeOrder } from "@/lib/fake-api"

type MealCategory = "breakfast" | "lunch" | "dinner"

interface TimeSlot {
  time: string
  category: MealCategory
}

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []

  for (let hour = 8; hour <= 10; hour++) {
    const maxMinutes = hour === 10 ? 55 : 55
    for (let minute = 0; minute <= maxMinutes; minute += 5) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        category: "breakfast",
      })
    }
  }

  for (let hour = 11; hour <= 17; hour++) {
    const maxMinutes = hour === 17 ? 55 : 55
    for (let minute = 0; minute <= maxMinutes; minute += 5) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        category: "lunch",
      })
    }
  }

  for (let hour = 18; hour <= 20; hour++) {
    const maxMinutes = hour === 20 ? 0 : 55
    for (let minute = 0; minute <= maxMinutes; minute += 5) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        category: "dinner",
      })
    }
  }

  return slots
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cafeteriaId, cafeteriaName, totalAmount, notes, clearCart } = useCart()
  const { addOrder } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [pickupTime, setPickupTime] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("lunch")
  const [allTimeSlots] = useState<TimeSlot[]>(generateTimeSlots())
  const [savedCafeteriaName, setSavedCafeteriaName] = useState<string>("")

  useEffect(() => {
    const categorySlots = allTimeSlots.filter((slot) => slot.category === selectedCategory)
    if (categorySlots.length > 0 && !pickupTime) {
      setPickupTime(categorySlots[0].time)
    }
  }, [selectedCategory, allTimeSlots, pickupTime])

  const handlePlaceOrder = async () => {
    if (!cafeteriaId || !pickupTime) return

    setSavedCafeteriaName(cafeteriaName || "")
    setIsLoading(true)
    const result = await placeOrder(items, paymentMethod, notes, cafeteriaId)

    if (result.success && result.order) {
      const orderWithPickupTime = {
        ...result.order,
        pickupSlot: {
          ...result.order.pickupSlot,
          time: pickupTime,
        },
      }
      addOrder(orderWithPickupTime)

      setOrderNumber(result.order.orderNumber)
      setIsSuccess(true)
      clearCart()
    } else {
      alert(result.error || "Failed to place order")
    }
    setIsLoading(false)
  }

  const displayedSlots = allTimeSlots.filter((slot) => slot.category === selectedCategory)

  if (isSuccess) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Order Placed!</h1>
        <p className="text-muted-foreground text-center mt-2">Your order #{orderNumber} has been received</p>

        <div className="w-full max-w-xs mt-8 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Cafeteria</span>
            <span className="font-medium text-foreground">{savedCafeteriaName}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Queue Number</span>
            <span className="font-bold text-2xl text-primary">#{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Pickup Time</span>
            <span className="font-medium text-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pickupTime}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-medium text-foreground capitalize">{paymentMethod}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push("/orders")}
            className="bg-muted text-foreground px-6 py-3 rounded-xl font-semibold cursor-pointer"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/home/customer")}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </main>
    )
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground">Your cart is empty</p>
        <button onClick={() => router.push("/home/customer")} className="mt-4 text-primary font-medium cursor-pointer">
          Browse Cafeterias
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="p-2 -ml-2 cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
      </div>

      <div className="flex-1 px-4 py-6 pb-32 overflow-y-auto">
        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">Order Summary</h2>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">{cafeteriaName}</p>
            {items.map((cartItem) => (
              <div key={cartItem.item.id} className="flex justify-between py-2">
                <span className="text-foreground">
                  {cartItem.item.name} × {cartItem.quantity}
                </span>
                <span className="font-medium text-foreground">₱{cartItem.item.price * cartItem.quantity}</span>
              </div>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-primary text-lg">₱{totalAmount}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-3">Special Instructions</h2>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-foreground">{notes}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">Select Pickup Time</h2>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory("breakfast")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === "breakfast"
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Breakfast
            </button>
            <button
              onClick={() => setSelectedCategory("lunch")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === "lunch" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Lunch
            </button>
            <button
              onClick={() => setSelectedCategory("dinner")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === "dinner" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Dinner
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {displayedSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setPickupTime(slot.time)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  pickupTime === slot.time ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-3">Payment Method</h2>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "cash" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <Banknote className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Cash on Pickup</p>
                <p className="text-sm text-muted-foreground">Pay when you collect your order</p>
              </div>
              {paymentMethod === "cash" && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("online")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "online" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Online Payment</p>
                <p className="text-sm text-muted-foreground">Pay now via GCash, Maya, etc.</p>
              </div>
              {paymentMethod === "online" && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-[390px] mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Placing Order..." : `Place Order • ₱${totalAmount}`}
          </button>
        </div>
      </div>
    </main>
  )
}
