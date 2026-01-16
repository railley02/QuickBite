"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Order, MenuItem } from "./mock-data"
import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react"


interface VendorOrder extends Order {
  customerName: string
}

interface VendorContextType {
  stallName: string
  isOpen: boolean
  isPaused: boolean
  vendorOrders: VendorOrder[]
  menuItems: MenuItem[]
  todaySales: number
  toggleOpen: () => void
  togglePause: () => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  updateItemStock: (itemId: string, stock: number) => void
  addMenuItem: (item: MenuItem) => void
  deleteMenuItem: (itemId: string) => void
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

// Mock vendor orders
const initialOrders: VendorOrder[] = [
  {
    id: "vo-1",
    orderNumber: 17,
    items: [
      {
        item: {
          id: "1",
          name: "Shawarma Rice",
          price: 65,
          stock: 25,
          image: "/shawarma-rice-bowl.jpg",
          description: "",
          category: "rice-meals",
          stallId: "lagoon-1",
          stallName: "Lagoon Cafeteria",
          stallNumber: 1,
        },
        quantity: 1,
      },
      {
        item: {
          id: "4",
          name: "Fries",
          price: 35,
          stock: 3,
          image: "/crispy-french-fries.png",
          description: "",
          category: "snacks",
          stallId: "lagoon-1",
          stallName: "Lagoon Cafeteria",
          stallNumber: 1,
        },
        quantity: 1,
      },
    ],
    status: "pending",
    pickupSlot: { id: "slot-1", time: "10:45 AM", capacity: 10, booked: 5, available: true },
    totalAmount: 100,
    paymentMethod: "cash",
    customerName: "Maria Santos",
    createdAt: new Date().toISOString(),
    cafeteriaId: "lagoon-1",
    cafeteriaName: "Lagoon Cafeteria",
  },
  {
    id: "vo-2",
    orderNumber: 16,
    items: [
      {
        item: {
          id: "2",
          name: "Adobo Rice",
          price: 55,
          stock: 3,
          image: "/chicken-adobo-rice.jpg",
          description: "",
          category: "rice-meals",
          stallId: "lagoon-1",
          stallName: "Lagoon Cafeteria",
          stallNumber: 1,
        },
        quantity: 2,
      },
    ],
    status: "preparing",
    pickupSlot: { id: "slot-2", time: "12:00 PM", capacity: 10, booked: 5, available: true },
    totalAmount: 110,
    paymentMethod: "online",
    customerName: "Juan Dela Cruz",
    createdAt: new Date().toISOString(),
    cafeteriaId: "lagoon-1",
    cafeteriaName: "Lagoon Cafeteria",
  },
  {
    id: "vo-3",
    orderNumber: 15,
    items: [
      {
        item: {
          id: "9",
          name: "Burger Meal",
          price: 85,
          stock: 15,
          image: "/burger-meal-combo.jpg",
          description: "",
          category: "combo",
          stallId: "lagoon-1",
          stallName: "Lagoon Cafeteria",
          stallNumber: 1,
        },
        quantity: 1,
      },
      {
        item: {
          id: "7",
          name: "Iced Tea",
          price: 20,
          stock: 50,
          image: "/iced-tea-glass.png",
          description: "",
          category: "drinks",
          stallId: "lagoon-1",
          stallName: "Lagoon Cafeteria",
          stallNumber: 1,
        },
        quantity: 2,
      },
    ],
    status: "ready",
    pickupSlot: { id: "slot-3", time: "11:30 AM", capacity: 10, booked: 5, available: true },
    totalAmount: 125,
    paymentMethod: "cash",
    customerName: "Anna Reyes",
    createdAt: new Date().toISOString(),
    cafeteriaId: "lagoon-1",
    cafeteriaName: "Lagoon Cafeteria",
  },
]

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Shawarma Rice",
    description: "Flavorful shawarma meat served with garlic rice",
    price: 65,
    image: "/shawarma-rice-bowl.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 25,
  },
  {
    id: "2",
    name: "Adobo Rice",
    description: "Classic Filipino adobo with steamed rice",
    price: 55,
    image: "/chicken-adobo-rice.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 3,
  },
  {
    id: "3",
    name: "Burger",
    description: "Juicy beef patty with fresh vegetables",
    price: 45,
    image: "/burger-sandwich.jpg",
    category: "snacks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 18,
  },
  {
    id: "4",
    name: "Fries",
    description: "Crispy golden french fries",
    price: 35,
    image: "/crispy-french-fries.png",
    category: "snacks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 3,
  },
  {
    id: "7",
    name: "Iced Tea",
    description: "Refreshing cold iced tea",
    price: 20,
    image: "/iced-tea-glass.png",
    category: "drinks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 50,
  },
  {
    id: "9",
    name: "Burger Meal",
    description: "Burger with fries and drinks combo",
    price: 85,
    image: "/burger-meal-combo.jpg",
    category: "combo",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 15,
  },
]

export function VendorProvider({ children }: { children: ReactNode }) {
  const [stallName, setStallName] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(initialOrders)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)

  useEffect(() => {
    const fetchVendor = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("vendors")
        .select("stall_name")
        .eq("user_id", session.user.id)
        .maybeSingle() // ✅ FIX

      if (error) {
        console.error("Failed to fetch vendor:", error.message)
        return
      }

      if (!data) {
        // vendor row doesn't exist yet (new account) — you can handle onboarding here
        setStallName("New Vendor")
        return
      }

      setStallName(data.stall_name)

    }

    fetchVendor()
  }, [])


  const todaySales =
    vendorOrders
      .filter((o) => o.status === "completed" || o.status === "ready")
      .reduce((sum, o) => sum + o.totalAmount, 0) + 2840

  const toggleOpen = () => setIsOpen(!isOpen)
  const togglePause = () => setIsPaused(!isPaused)

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setVendorOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const updateItemStock = (itemId: string, stock: number) => {
    setMenuItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, stock } : i)))
  }

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item])
  }

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  return (
    <VendorContext.Provider
      value={{
        stallName,
        isOpen,
        isPaused,
        vendorOrders,
        menuItems,
        todaySales,
        toggleOpen,
        togglePause,
        updateOrderStatus,
        updateItemStock,
        addMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </VendorContext.Provider>
  )
}

export function useVendor() {
  const context = useContext(VendorContext)
  if (context === undefined) {
    throw new Error("useVendor must be used within a VendorProvider")
  }
  return context
}
