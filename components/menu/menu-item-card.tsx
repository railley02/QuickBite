"use client"

import { Plus } from "lucide-react"
import type { MenuItem } from "@/lib/mock-data"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const isLowStock = item.stock <= 5

  return (
    <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-24 object-cover rounded-lg bg-muted"
        />
        {item.isPopular && (
          <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
            Popular
          </span>
        )}
        {isLowStock && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
            {item.stock} left
          </span>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{item.stallName}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">₱{item.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(item)}
            disabled={item.stock === 0}
            className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
