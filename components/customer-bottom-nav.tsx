"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UtensilsCrossed, ShoppingCart, ClipboardList, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CustomerBottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const navItems = [
    { href: "/home/customer", icon: Home, label: "Home" },
    { href: "/cafeterias", icon: UtensilsCrossed, label: "Cafeterias" },
    { href: "/cart", icon: ShoppingCart, label: "Basket", badge: totalItems > 0 ? totalItems : undefined },
    { href: "/orders", icon: ClipboardList, label: "My Orders" },
    { href: "/profile/customer", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-[390px] mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
