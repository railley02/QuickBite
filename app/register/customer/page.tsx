"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient"

export default function CustomerRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
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
    // 1️⃣ Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })
    if (authError) {
      setIsLoading(false)
      return alert(`Sign-up error: ${authError.message}`)
    }

    // 2️⃣ Save extra user info in 'users' table
    const { error: tableError } = await supabase.from("users").insert([
      {
        id: authData.user?.id,
        full_name: formData.fullName,
        email: formData.email,
        contact: formData.contactNumber,
        role: "customer", // this page is for customer
      },
    ])
    if (tableError) {
      setIsLoading(false)
      return alert(`Error saving profile info: ${tableError.message}`)
    }

    setIsLoading(false)
    alert("Sign-up successful! Please log in.")
    router.push("/sign-in") // redirect to login after successful registration
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
              placeholder="email@iskolarngbayan.pup.edu.ph"
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

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="flex justify-center pb-4 pt-6">
        <div className="w-32 h-1 bg-foreground rounded-full" />
      </div>
    </main>
  )
}
