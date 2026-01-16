"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient"

export default function StallOwnerRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    stallName: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "vendor",
          },
        },
      })

      if (error) throw error
      if (!data.user) throw new Error("User not created")

      const userId = data.user.id

      // 🔹 CREATE users row
      const { error: userError } = await supabase
        .from("users")
        .insert({
          id: userId,
          full_name: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
          role: "vendor",
        })

      if (userError) throw userError

      // 🔹 CREATE vendors row
      const { error: vendorError } = await supabase
        .from("vendors")
        .insert({
          user_id: userId,
          stall_name: formData.stallName,
          stall_number: null,
          operating_hours: "8:00 AM - 5:00 PM",
          slot_capacity: 10,
        })

      if (vendorError) throw vendorError

      alert("Account created! Please log in.")
      router.push("/sign-in")

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }

  }



  return (
    <main className="min-h-dvh bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => router.push("/sign-up")}
          className="flex items-center text-primary hover:opacity-80 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-4">
        <h1 className="text-2xl font-bold text-primary">Sign-up</h1>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Email Address</label>
            <input
              type="email"
              placeholder="email@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Stall Name</label>
            <input
              type="text"
              value={formData.stallName}
              onChange={(e) => setFormData({ ...formData, stallName: e.target.value })}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-11 px-4 pr-12 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full h-11 px-4 pr-12 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isLoading ? "Loading..." : "Sign-up"}
          </button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            By clicking sign-up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline cursor-pointer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline cursor-pointer">
              Privacy Policy
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground pb-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="flex justify-center pb-4 pt-2">
        <div className="w-32 h-1 bg-foreground rounded-full" />
      </div>
    </main>
  )
}
