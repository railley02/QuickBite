"use client"

import Link from "next/link"
import { QuickBiteLogo } from "@/components/quickbite-logo"

// Sign Up - Role Selection Screen matching Figma
export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center pt-20">
        <QuickBiteLogo variant="dark" size="default" />
      </div>

      {/* Buttons Section */}
      <div className="px-6 pb-12 space-y-4">
        <Link href="/register/customer" className="block">
          <button className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Sign-up as Customer
          </button>
        </Link>

        <Link href="/register/stall-owner" className="block">
          <button className="w-full h-12 bg-white text-foreground font-medium rounded-lg border border-border hover:bg-muted transition-colors">
            Sign-up as Stall Owner
          </button>
        </Link>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Login
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
