"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { QuickBiteLogo } from "@/components/quickbite-logo"

// Start Screen - Orange splash with QB logo
export default function StartPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to sign-in after 2 seconds
    const timer = setTimeout(() => {
      router.push("/sign-in")
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="min-h-dvh bg-primary flex flex-col items-center justify-center">
      <QuickBiteLogo variant="light" size="large" />
    </main>
  )
}
