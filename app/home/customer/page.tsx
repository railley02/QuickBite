"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, SlidersHorizontal, ArrowLeft, Plus, Minus, X, Check } from "lucide-react"
import { getCafeterias, getRecommendedItems, searchCafeterias } from "@/lib/fake-api"
import type { Cafeteria, MenuItem } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CustomerBottomNav } from "@/components/customer-bottom-nav"

export default function CustomerHomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([])
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Cafeteria[] | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all")
  const [sortBy, setSortBy] = useState<"stall" | "queue-high" | "queue-low" | "rating">("stall")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { items: cartItems, addItem, removeItem } = useCart()
  const supabase = createClient()

  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find((ci) => ci.item.id === itemId)
    return cartItem?.quantity || 0
  }

  useEffect(() => {
    async function loadData() {
      const [cafData, recData] = await Promise.all([getCafeterias(), getRecommendedItems()])
      setCafeterias(cafData)
      setRecommendedItems(recData)
      setIsLoading(false)
    }
    loadData()

    const channel = supabase
      .channel("home-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        loadData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "stalls" }, () => {
        loadData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(null)
      return
    }

    const searchTimeout = setTimeout(async () => {
      const results = await searchCafeterias(searchQuery)
      setSearchResults(results)
    }, 150)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  const displayedCafeterias = useMemo(() => {
    let list = searchResults !== null ? searchResults : cafeterias

    if (filterStatus !== "all") {
      list = list.filter((c) => c.status === filterStatus)
    }

    switch (sortBy) {
      case "queue-high":
        list = [...list].sort((a, b) => b.queueSize - a.queueSize)
        break
      case "queue-low":
        list = [...list].sort((a, b) => a.queueSize - b.queueSize)
        break
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        list = [...list].sort((a, b) => a.stallNumber - b.stallNumber)
    }

    return list
  }, [cafeterias, searchResults, filterStatus, sortBy])

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-orange-400 px-4 pt-6 pb-6 rounded-b-3xl">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <Link
            href="/notifications"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary" />
          </Link>
        </div>

        {/* Branding */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-white">QUICKBITE</h1>
          <p className="text-white/80 text-sm">Skip the line, savor the time</p>
          {user && <p className="text-white/60 text-xs mt-1">Welcome, {user.fullName}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* You might like this */}
        {recommendedItems.length > 0 && !searchQuery && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground mb-3">You might like this</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recommendedItems.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-28 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    {getCartQuantity(item.id) > 0 ? (
                      <div className="absolute bottom-1 right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {getCartQuantity(item.id)}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addItem(item, item.stallId!, item.stallName!)
                        }}
                        className="absolute bottom-1 right-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
                    Stall {item.stallNumber} - {item.stallName}
                  </p>
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-primary font-semibold">₱{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cafeterias Header with Filter */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Cafeterias</h2>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-1 text-sm text-primary cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Cafeterias List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : displayedCafeterias.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No cafeterias available yet.</p>
            <p className="text-sm mt-2">Vendors can add stalls from their dashboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedCafeterias.map((cafeteria) => (
              <Link
                key={cafeteria.id}
                href={`/store/${cafeteria.id}`}
                className="block bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={cafeteria.image || "/placeholder.svg"}
                      alt={cafeteria.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        Stall {cafeteria.stallNumber} - {cafeteria.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${cafeteria.status === "open" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className={`text-xs ${cafeteria.status === "open" ? "text-green-600" : "text-red-500"}`}>
                          {cafeteria.status === "open" ? "Open - Accepting Orders" : "Closed"}
                        </span>
                      </div>
                    </div>
                    {cafeteria.status === "open" && (
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">In Queue: {cafeteria.queueSize}</p>
                        <p className="text-xs text-primary font-medium">
                          Next Pickup: {cafeteria.queueSize > 0 ? cafeteria.nextPickup : "No orders"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setShowFilterModal(false)} className="text-foreground cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-foreground">Filter and Sort</h3>
              <button
                onClick={() => {
                  setFilterStatus("all")
                  setSortBy("stall")
                }}
                className="text-sm text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilterStatus(filterStatus === "open" ? "all" : "open")}
                className={`px-4 py-2 rounded-full border text-sm cursor-pointer ${
                  filterStatus === "open"
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border text-foreground"
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilterStatus(filterStatus === "closed" ? "all" : "closed")}
                className={`px-4 py-2 rounded-full border text-sm cursor-pointer ${
                  filterStatus === "closed"
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border text-foreground"
                }`}
              >
                Closed
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSortBy("queue-high")}
                className={`w-full px-4 py-2 rounded-full border text-sm text-left cursor-pointer ${
                  sortBy === "queue-high"
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border text-foreground"
                }`}
              >
                In queue - High to Low
              </button>
              <button
                onClick={() => setSortBy("queue-low")}
                className={`w-full px-4 py-2 rounded-full border text-sm text-left cursor-pointer ${
                  sortBy === "queue-low"
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border text-foreground"
                }`}
              >
                In queue - Low to High
              </button>
              <button
                onClick={() => setSortBy("rating")}
                className={`w-full px-4 py-2 rounded-full border text-sm text-left cursor-pointer ${
                  sortBy === "rating"
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border text-foreground"
                }`}
              >
                Rating - High to Low
              </button>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full h-12 bg-primary text-white font-medium rounded-full cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl overflow-hidden">
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
            <div className="p-6">
              <p className="text-xs text-muted-foreground">
                Stall {selectedItem.stallNumber} - {selectedItem.stallName}
              </p>
              <h2 className="text-xl font-bold text-foreground mt-1">{selectedItem.name}</h2>
              <p className="text-muted-foreground text-sm mt-2">{selectedItem.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">₱{selectedItem.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.stock > 0 ? `${selectedItem.stock} available` : "Out of stock"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeItem(selectedItem.id)}
                    disabled={getCartQuantity(selectedItem.id) === 0}
                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-bold w-6 text-center">{getCartQuantity(selectedItem.id)}</span>
                  <button
                    onClick={() => addItem(selectedItem, selectedItem.stallId!, selectedItem.stallName!)}
                    disabled={getCartQuantity(selectedItem.id) >= selectedItem.stock || selectedItem.stock === 0}
                    className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 h-12 bg-muted text-foreground font-medium rounded-full cursor-pointer"
                >
                  Add More
                </button>
                <button
                  onClick={() => {
                    if (getCartQuantity(selectedItem.id) === 0) {
                      addItem(selectedItem, selectedItem.stallId!, selectedItem.stallName!)
                    }
                    router.push("/cart")
                  }}
                  disabled={selectedItem.stock === 0}
                  className="flex-1 h-12 bg-primary text-white font-medium rounded-full cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <CustomerBottomNav />
    </main>
  )
}
