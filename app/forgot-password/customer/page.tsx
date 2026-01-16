"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function CustomerForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-primary mb-2">Email Confirmation</h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
        </p>
        <button
          onClick={() => window.open("mailto:", "_blank")}
          className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer mb-4"
        >
          Open Email App
        </button>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive email?{" "}
          <button onClick={() => setSent(false)} className="text-primary hover:underline cursor-pointer">
            Resend
          </button>
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary hover:opacity-80 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-lg font-bold">Forgot Password</span>
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8">
        <p className="text-muted-foreground text-sm mb-6">Enter your WebMail to reset your password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="email@iskolarngbayan.pup.edu.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Remember Password?{" "}
          <Link href="/login/customer" className="text-primary hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>

      <div className="flex justify-center pb-4 pt-8">
        <div className="w-32 h-1 bg-foreground rounded-full" />
      </div>
    </main>
  )
}
