"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { SlidersHorizontal, Star } from "lucide-react"
import { getCafeterias } from "@/lib/fake-api"
import type { Cafeteria } from "@/lib/mock-data"
import { CustomerBottomNav } from "@/components/customer-bottom-nav"

export default function CafeteriasPage() {
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all")
  const [sortBy, setSortBy] = useState<"stall" | "queue-high" | "queue-low" | "rating">("stall")

  useEffect(() => {
    async function loadData() {
      const data = await getCafeterias()
      setCafeterias(data)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const displayedCafeterias = useMemo(() => {
    let list = [...cafeterias]

    if (filterStatus !== "all") {
      list = list.filter((c) => c.status === filterStatus)
    }

    switch (sortBy) {
      case "queue-high":
        list = list.sort((a, b) => b.queueSize - a.queueSize)
        break
      case "queue-low":
        list = list.sort((a, b) => a.queueSize - b.queueSize)
        break
      case "rating":
        list = list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list = list.sort((a, b) => a.stallNumber - b.stallNumber)
    }

    return list
  }, [cafeterias, filterStatus, sortBy])

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Cafeterias</h1>
        <button onClick={() => setShowFilterModal(true)} className="text-primary cursor-pointer">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Cafeterias List */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : displayedCafeterias.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No cafeterias available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedCafeterias.map((cafeteria) => (
              <Link
                key={cafeteria.id}
                href={`/store/${cafeteria.id}`}
                className="block bg-card border border-border rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex">
                  <div className="w-24 h-28 relative flex-shrink-0">
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
                      <Link
                        href={`/cafeteria-reviews/${cafeteria.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {cafeteria.rating} ({cafeteria.totalRatings} reviews)
                        </span>
                      </Link>
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
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
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

      {/* Bottom Navigation */}
      <CustomerBottomNav />
    </main>
  )
}
