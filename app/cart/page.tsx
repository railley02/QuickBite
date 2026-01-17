"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const router = useRouter()
  const { items, cafeteriaName, updateQuantity, removeItem, totalAmount, clearCart, notes, setNotes } = useCart()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map((i) => i.item.id)))

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map((i) => i.item.id)))
    }
  }

  const selectedTotal = items
    .filter((i) => selectedItems.has(i.item.id))
    .reduce((sum, i) => sum + i.item.price * i.quantity, 0)

  const selectedCount = items.filter((i) => selectedItems.has(i.item.id)).reduce((sum, i) => sum + i.quantity, 0)

  if (items.length === 0) {
    return (
      <main className="min-h-dvh bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-border">
          <button onClick={() => router.back()} className="p-2 -ml-2 cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Basket</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Your basket is empty</h2>
          <p className="text-muted-foreground text-sm text-center mt-2">
            Browse cafeterias and add some delicious items to your basket
          </p>
          <Link
            href="/cafeterias"
            className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-medium cursor-pointer"
          >
            Browse Cafeterias
          </Link>
        </div>
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
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Basket</h1>
          <p className="text-sm text-muted-foreground">{cafeteriaName}</p>
        </div>
        <button onClick={clearCart} className="text-red-500 text-sm font-medium cursor-pointer">
          Clear
        </button>
      </div>

      {/* Select All */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <button
          onClick={toggleSelectAll}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
            selectedItems.size === items.length ? "bg-primary border-primary" : "border-border"
          }`}
        >
          {selectedItems.size === items.length && <Check className="w-4 h-4 text-white" />}
        </button>
        <span className="text-sm text-foreground">Select All ({items.length} items)</span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-48">
        <div className="space-y-4">
          {items.map((cartItem) => (
            <div key={cartItem.item.id} className="flex gap-3 bg-card border border-border rounded-xl p-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleItem(cartItem.item.id)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 mt-6 ${
                  selectedItems.has(cartItem.item.id) ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {selectedItems.has(cartItem.item.id) && <Check className="w-4 h-4 text-white" />}
              </button>

              <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={cartItem.item.image || "/placeholder.svg"}
                  alt={cartItem.item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{cartItem.item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₱{cartItem.item.price} × {cartItem.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">₱{cartItem.item.price * cartItem.quantity}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="w-8 h-8 bg-muted rounded-full flex items-center justify-center cursor-pointer"
                    >
                      {cartItem.quantity === 1 ? (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>
                    <span className="font-medium w-6 text-center">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      disabled={cartItem.quantity >= cartItem.item.stock}
                      className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">Notes to Vendor (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests? e.g., no onions, extra sauce..."
            className="w-full h-24 p-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Bottom Summary & Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-[390px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">
              Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"})
            </span>
            <span className="font-bold text-lg text-foreground">₱{selectedTotal}</span>
          </div>
          <Link
            href={selectedItems.size > 0 ? "/checkout" : "#"}
            className={`block w-full text-center py-4 rounded-xl font-semibold ${
              selectedItems.size > 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground pointer-events-none"
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  )
}
