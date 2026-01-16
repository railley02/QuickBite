"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { useState } from "react"

interface Review {
  id: string
  userName: string
  anonymous: boolean
  items: string[]
  foodRating: number
  foodComment: string
  serviceRating: number
  serviceComment: string
  date: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Maria Santos",
    anonymous: false,
    items: ["Shawarma Rice", "Fries"],
    foodRating: 4,
    foodComment: "Tasty but portion was small",
    serviceRating: 5,
    serviceComment: "Fast and friendly service",
    date: "March 15, 2025",
  },
  {
    id: "2",
    userName: "Anonymous",
    anonymous: true,
    items: ["Adobo Rice"],
    foodRating: 5,
    foodComment: "Delicious! Best adobo in campus",
    serviceRating: 4,
    serviceComment: "Good service, could be faster",
    date: "March 14, 2025",
  },
  {
    id: "3",
    userName: "Juan Dela Cruz",
    anonymous: false,
    items: ["Burger Meal"],
    foodRating: 3,
    foodComment: "Average taste, needs improvement",
    serviceRating: 5,
    serviceComment: "Excellent customer service",
    date: "March 13, 2025",
  },
]

export default function VendorReviewsPage() {
  const router = useRouter()
  const [reviews] = useState<Review[]>(mockReviews)
  const [filterRating, setFilterRating] = useState<"all" | "5" | "4+" | "food">("all")

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true
    if (filterRating === "5") return review.foodRating === 5 && review.serviceRating === 5
    if (filterRating === "4+") return review.foodRating >= 4 || review.serviceRating >= 4
    if (filterRating === "food") return review.foodRating >= 4
    return true
  })

  const overallRating = 4.5
  const totalRatings = 42

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FF6901] to-orange-500 px-4 pt-6 pb-6">
        <button onClick={() => router.back()} className="text-white mb-4 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">My Reviews</h1>
        <div className="flex items-center gap-2 mt-2">
          <Star className="w-5 h-5 text-white fill-white" />
          <span className="text-white font-semibold">{overallRating}</span>
          <span className="text-white/80">({totalRatings} reviews)</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { key: "all", label: "All Ratings" },
              { key: "5", label: "5 Stars" },
              { key: "4+", label: "4+ Stars" },
              { key: "food", label: "By Food Item" },
            ] as { key: typeof filterRating; label: string }[]
          ).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterRating(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                filterRating === filter.key ? "bg-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">{review.anonymous ? "A" : review.userName[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{review.anonymous ? "Anonymous" : review.userName}</p>
                  <p className="text-xs text-muted-foreground">Ordered: {review.items.join(", ")}</p>
                </div>
              </div>

              {/* Food Rating */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">🍽️ Food:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.foodRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({review.foodRating}/5)</span>
                </div>
                <p className="text-sm text-muted-foreground">"{review.foodComment}"</p>
              </div>

              {/* Service Rating */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">👨‍🍳 Service:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.serviceRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({review.serviceRating}/5)</span>
                </div>
                <p className="text-sm text-muted-foreground">"{review.serviceComment}"</p>
              </div>

              {/* Date */}
              <p className="text-xs text-muted-foreground">[{review.date}]</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
