"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, UtensilsCrossed, ShoppingCart, User, Search, Bell, SlidersHorizontal, ArrowLeft } from "lucide-react"
import { getCafeterias, getRecommendedItems, searchCafeterias } from "@/lib/fake-api"
import type { Cafeteria, MenuItem } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

export default function CustomerHomePage() {
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([])
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Cafeteria[] | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all")
  const [sortBy, setSortBy] = useState<"stall" | "queue-high" | "queue-low" | "rating">("stall")
  const { totalItems } = useCart()

  useEffect(() => {
    async function loadData() {
      const [cafData, recData] = await Promise.all([getCafeterias(), getRecommendedItems()])
      setCafeterias(cafData)
      setRecommendedItems(recData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Live search as user types
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

  // Filter and sort cafeterias
  const displayedCafeterias = useMemo(() => {
    let list = searchResults !== null ? searchResults : cafeterias

    // Apply status filter
    if (filterStatus !== "all") {
      list = list.filter((c) => c.status === filterStatus)
    }

    // Apply sorting
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
            {/* Red badge for unread notifications */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary" />
          </Link>
        </div>

        {/* Branding */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-white">QUICKBITE</h1>
          <p className="text-white/80 text-sm">Skip the line, savor the time</p>
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
                <Link key={item.id} href={`/store/${item.stallId}`} className="flex-shrink-0 w-28">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
                    Stall {item.stallNumber} - {item.stallName}
                  </p>
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-primary font-semibold">₱{item.price}</p>
                </Link>
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
        ) : (
          <div className="space-y-3">
            {displayedCafeterias.map((cafeteria) => (
              <Link
                key={cafeteria.id}
                href={`/store/${cafeteria.id}`}
                className="block bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={cafeteria.image || "/placeholder.svg"}
                      alt={cafeteria.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
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
                        <p className="text-xs text-primary font-medium">Next Pickup: {cafeteria.nextPickup}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {displayedCafeterias.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No cafeterias found</div>
            )}
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

            {/* Status Filter */}
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

            {/* Sort Options */}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/customer" className="flex flex-col items-center text-primary">
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
