"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, X, Star } from "lucide-react"
import { getCafeteria, getMenuItems, getCategories } from "@/lib/fake-api"
import type { Cafeteria, MenuItem, Category } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

function StoreContent() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { items: cartItems, addItem, removeItem, totalItems } = useCart()

  const [cafeteria, setCafeteria] = useState<Cafeteria | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    async function loadData() {
      const [caf, items, cats] = await Promise.all([getCafeteria(id), getMenuItems(id), getCategories()])
      setCafeteria(caf)
      setMenuItems(items)
      setCategories(cats)
      setIsLoading(false)
    }
    loadData()
  }, [id])

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find((ci) => ci.item.id === itemId)
    return cartItem?.quantity || 0
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </main>
    )
  }

  if (!cafeteria) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground">Cafeteria not found</p>
        <button onClick={() => router.back()} className="mt-4 text-primary font-medium cursor-pointer">
          Go Back
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-orange-400 px-4 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-white p-2 -ml-2 cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Link href="/cart" className="relative text-white p-2 -mr-2">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-white text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <h1 className="text-xl font-bold text-white">
          Stall {cafeteria.stallNumber} - {cafeteria.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full ${cafeteria.status === "open" ? "bg-green-400" : "bg-red-400"}`} />
          <span className="text-white/90 text-sm">
            {cafeteria.status === "open" ? "Open - Accepting Orders" : "Closed"}
          </span>
        </div>
        {/* Rating */}
        <Link href={`/cafeteria-reviews/${cafeteria.id}`} className="flex items-center gap-1 mt-1 cursor-pointer">
          <Star className="w-3 h-3 fill-white text-white" />
          <span className="text-white/90 text-sm">
            {cafeteria.rating} ({cafeteria.totalRatings} reviews)
          </span>
        </Link>

        {/* Stats */}
        {cafeteria.status === "open" && (
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/20 backdrop-blur rounded-lg p-2 text-center">
              <span className="font-bold text-white">{cafeteria.queueSize}</span>
              <p className="text-white/80 text-xs">In Queue</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur rounded-lg p-2 text-center">
              <span className="font-bold text-white">{cafeteria.nextPickup}</span>
              <p className="text-white/80 text-xs">Next Pickup</p>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const quantity = getCartQuantity(item.id)
            const isLowStock = item.stock <= 5

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-24">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  {isLowStock && item.stock > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.stock} left
                    </span>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary">₱{item.price}</span>
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-6 h-6 bg-muted rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => addItem(item, cafeteria.id, cafeteria.name)}
                          disabled={quantity >= item.stock}
                          className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addItem(item, cafeteria.id, cafeteria.name)
                        }}
                        disabled={item.stock === 0}
                        className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-muted cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl overflow-hidden">
            {/* Image */}
            <div className="relative h-48">
              <Image
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground">{selectedItem.name}</h2>
              <p className="text-muted-foreground text-sm mt-2">{selectedItem.description}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">₱{selectedItem.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.stock > 0 ? `${selectedItem.stock} available` : "Out of stock"}
                  </p>
                </div>

                {getCartQuantity(selectedItem.id) > 0 ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeItem(selectedItem.id)}
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold w-6 text-center">{getCartQuantity(selectedItem.id)}</span>
                    <button
                      onClick={() => addItem(selectedItem, cafeteria.id, cafeteria.name)}
                      disabled={getCartQuantity(selectedItem.id) >= selectedItem.stock}
                      className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addItem(selectedItem, cafeteria.id, cafeteria.name)
                    }}
                    disabled={selectedItem.stock === 0}
                    className="h-12 px-6 bg-primary text-white font-medium rounded-full disabled:opacity-50 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 max-w-[360px] w-[calc(100%-32px)]"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="flex-1">View Cart ({totalItems} items)</span>
          <span className="font-bold">→</span>
        </Link>
      )}
    </main>
  )
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-background flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
      }
    >
      <StoreContent />
    </Suspense>
  )
}
