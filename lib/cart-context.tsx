"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { CartItem, MenuItem } from "./mock-data"

interface CartContextType {
  items: CartItem[]
  cafeteriaId: string | null
  cafeteriaName: string | null
  notes: string
  addItem: (item: MenuItem, cafeteriaId: string, cafeteriaName: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  setNotes: (notes: string) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cafeteriaId, setCafeteriaId] = useState<string | null>(null)
  const [cafeteriaName, setCafeteriaName] = useState<string | null>(null)
  const [notes, setNotesState] = useState("")

  const addItem = (item: MenuItem, newCafeteriaId: string, newCafeteriaName: string) => {
    // If cart has items from different cafeteria, clear it
    if (cafeteriaId && cafeteriaId !== newCafeteriaId) {
      setItems([{ item, quantity: 1 }])
      setCafeteriaId(newCafeteriaId)
      setCafeteriaName(newCafeteriaName)
      return
    }

    setCafeteriaId(newCafeteriaId)
    setCafeteriaName(newCafeteriaName)

    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: Math.min(ci.quantity + 1, item.stock) } : ci,
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((ci) => ci.item.id !== itemId)
      if (newItems.length === 0) {
        setCafeteriaId(null)
        setCafeteriaName(null)
        setNotesState("")
      }
      return newItems
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: Math.min(quantity, ci.item.stock) } : ci)),
    )
  }

  const setNotes = (newNotes: string) => {
    setNotesState(newNotes)
  }

  const clearCart = () => {
    setItems([])
    setCafeteriaId(null)
    setCafeteriaName(null)
    setNotesState("")
  }

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0)
  const totalAmount = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        cafeteriaId,
        cafeteriaName,
        notes,
        addItem,
        removeItem,
        updateQuantity,
        setNotes,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
