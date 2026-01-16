"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { QuickBiteLogo } from "@/components/quickbite-logo"
import { supabase } from "../../../lib/supabaseClient"

export default function CustomerLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1️⃣ Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error || !data.user) {
        setIsLoading(false)
        return alert("Invalid login credentials")
      }

      // 2️⃣ Fetch role from users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        setIsLoading(false)
        return alert("Failed to verify user role")
      }

      // 3️⃣ Role check: CUSTOMER ONLY
      if (profile.role !== "customer") {
        await supabase.auth.signOut()
        setIsLoading(false)
        return alert("This account is not a customer")
      }

      // 4️⃣ Success → customer home
      setIsLoading(false)
      router.push("/home/customer")

    } catch (err) {
      console.error(err)
      setIsLoading(false)
      alert("Something went wrong")
    }
  }


  return (
    <main className="min-h-dvh bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => router.push("/sign-in")}
          className="flex items-center text-primary hover:opacity-80 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Logo Section */}
      <div className="pt-8 pb-8 flex flex-col items-center">
        <QuickBiteLogo variant="dark" size="small" />
        <p className="text-muted-foreground mt-4 text-sm">Login as Customer</p>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="email@iskolarngbayan.pup.edu.ph"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-12 px-4 pr-12 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Loading..." : "LOG IN"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password/customer" className="hover:underline cursor-pointer">
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>

    </main>
  )
}
