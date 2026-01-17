"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
      <Image
        src="/images/screenshot-202026-01-17-20at-201.png"
        alt="QuickBite"
        width={200}
        height={200}
        className="animate-pulse"
        priority
      />
    </main>
  )
}
