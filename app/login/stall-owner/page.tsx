"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { QuickBiteLogo } from "@/components/quickbite-logo"
import { supabase } from "../../../lib/supabaseClient"

export default function StallOwnerLoginPage() {
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
      // 1️⃣ Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error || !data.user) {
        setIsLoading(false)
        return alert("Invalid login credentials")
      }

      const user = data.user
      const meta = user.user_metadata ?? {}

      // 2️⃣ Ensure users row exists
      await supabase.from("users").upsert(
        {
          id: user.id,
          full_name: meta.full_name ?? "",
          email: user.email,
          contact: meta.contact ?? null,
          role: meta.role ?? "vendor",
        },
        { onConflict: "id" }
      )

      // 3️⃣ Ensure vendors row exists
      await supabase.from("vendors").upsert(
        {
          user_id: user.id,
          stall_name: meta.stall_name ?? "Unnamed Stall",
          stall_number: null,
          operating_hours: "8:00 AM - 5:00 PM",
          slot_capacity: 10,
          is_open: true,
        },
        { onConflict: "user_id" }
      )

      // 4️⃣ Role verification
      if ((meta.role ?? "vendor") !== "vendor") {
        await supabase.auth.signOut()
        setIsLoading(false)
        return alert("This account is not a stall owner")
      }

      // 5️⃣ Success
      setIsLoading(false)
      router.push("/home/vendor")

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
        <p className="text-muted-foreground mt-4 text-sm">Login as Stall Owner</p>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="email@domain.com"
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
            <Link href="/forgot-password/vendor" className="hover:underline cursor-pointer">
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>

    </main>
  )
}
