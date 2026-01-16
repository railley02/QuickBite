"use client"

import { Home, Search, ShoppingCart, User } from "lucide-react"
import Link from "next/link"

interface BottomNavProps {
  cartCount?: number
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        <Link href="/menu" className="flex flex-col items-center text-primary">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center text-muted-foreground hover:text-primary relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
