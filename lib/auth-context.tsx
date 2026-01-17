"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  type: "customer" | "vendor"
  stallId?: string // For vendors
  stallName?: string // For vendors
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, type: "customer" | "vendor") => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
}

interface RegisterData {
  email: string
  password: string
  fullName: string
  phone: string
  type: "customer" | "vendor"
  stallName?: string // For vendors
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("quickbite_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, type: "customer" | "vendor"): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (type === "customer") {
        // Check if user exists in users table
        const { data: userData, error } = await supabase.from("users").select("*").eq("email", email).single()

        if (error || !userData) {
          // Create user if not exists (for demo purposes)
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              email,
              full_name: email.split("@")[0],
              phone: "",
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating user:", createError)
            setIsLoading(false)
            return false
          }

          const user: User = {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name,
            phone: newUser.phone,
            type: "customer",
          }
          setUser(user)
          localStorage.setItem("quickbite_user", JSON.stringify(user))
        } else {
          const user: User = {
            id: userData.id,
            email: userData.email,
            fullName: userData.full_name,
            phone: userData.phone,
            type: "customer",
          }
          setUser(user)
          localStorage.setItem("quickbite_user", JSON.stringify(user))
        }
      } else {
        // Vendor login - find stall by vendor email pattern
        const { data: stallData, error } = await supabase.from("stalls").select("*").limit(1).single()

        if (error || !stallData) {
          // Create a default stall for the vendor
          const { data: newStall, error: createError } = await supabase
            .from("stalls")
            .insert({
              name: "My Cafeteria",
              description: "Welcome to my cafeteria!",
              stall_number: 1,
              status: "open",
              rating: 4.5,
              total_ratings: 0,
              slot_capacity: 10,
              operating_hours: "8:00 AM - 6:00 PM",
              image: "/main-cafeteria-restaurant.jpg",
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating stall:", createError)
            setIsLoading(false)
            return false
          }

          const user: User = {
            id: newStall.id,
            email,
            fullName: email.split("@")[0],
            type: "vendor",
            stallId: newStall.id,
            stallName: newStall.name,
          }
          setUser(user)
          localStorage.setItem("quickbite_user", JSON.stringify(user))
        } else {
          const user: User = {
            id: stallData.vendor_id || stallData.id,
            email,
            fullName: stallData.name,
            type: "vendor",
            stallId: stallData.id,
            stallName: stallData.name,
          }
          setUser(user)
          localStorage.setItem("quickbite_user", JSON.stringify(user))
        }
      }

      setIsLoading(false)
      return true
    } catch (err) {
      console.error("Login error:", err)
      setIsLoading(false)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (data.type === "customer") {
        const { data: newUser, error } = await supabase
          .from("users")
          .insert({
            email: data.email,
            full_name: data.fullName,
            phone: data.phone,
          })
          .select()
          .single()

        if (error) {
          console.error("Error registering user:", error)
          setIsLoading(false)
          return false
        }

        const user: User = {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          phone: newUser.phone,
          type: "customer",
        }
        setUser(user)
        localStorage.setItem("quickbite_user", JSON.stringify(user))
      } else {
        // Vendor registration - create stall
        const { data: newStall, error } = await supabase
          .from("stalls")
          .insert({
            name: data.stallName || "My Cafeteria",
            description: "Welcome to my cafeteria!",
            stall_number: Math.floor(Math.random() * 100) + 1,
            status: "open",
            rating: 0,
            total_ratings: 0,
            slot_capacity: 10,
            operating_hours: "8:00 AM - 6:00 PM",
            image: "/main-cafeteria-restaurant.jpg",
          })
          .select()
          .single()

        if (error) {
          console.error("Error registering vendor:", error)
          setIsLoading(false)
          return false
        }

        const user: User = {
          id: newStall.id,
          email: data.email,
          fullName: data.fullName,
          type: "vendor",
          stallId: newStall.id,
          stallName: newStall.name,
        }
        setUser(user)
        localStorage.setItem("quickbite_user", JSON.stringify(user))
      }

      setIsLoading(false)
      return true
    } catch (err) {
      console.error("Register error:", err)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quickbite_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
