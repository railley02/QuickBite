"use client"

import { categories } from "@/lib/mock-data"

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
            activeCategory === category.id
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
