"use client"

import Link from "next/link"
import Image from "next/image"

// Sign In - Role Selection Screen matching Figma
export default function SignInPage() {
  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center pt-20">
        <Image src="/images/unknown.jpg" alt="QuickBite Logo" width={120} height={120} className="w-32 h-32" />
      </div>

      {/* Buttons Section */}
      <div className="px-6 pb-12 space-y-4">
        <Link href="/login/customer" className="block">
          <button className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Login as Customer
          </button>
        </Link>

        <Link href="/login/stall-owner" className="block">
          <button className="w-full h-12 bg-white text-foreground font-medium rounded-lg border border-border hover:bg-muted transition-colors">
            Login as Stall Owner
          </button>
        </Link>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Sign-up
          </Link>
        </p>
      </div>

      {/* Bottom Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-foreground rounded-full" />
      </div>
    </main>
  )
}
