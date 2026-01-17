"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermsOfServicePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary hover:opacity-80 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-lg font-bold">Terms of Services</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="space-y-6 text-sm text-foreground">
          <section>
            <h2 className="font-bold text-base mb-2">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the QuickBite mobile application, you agree to be bound by these Terms of Service.
              If you do not agree, you may not use the App.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              The App is intended for use by students, faculty, and authorized staff of the Polytechnic University of
              the Philippines (PUP). You must use a valid PUP email address to register.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to provide
              accurate and current information during registration.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Ordering and Payments</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>Orders placed through QuickBite are subject to item availability and pickup slot capacity.</li>
              <li>Payment must be completed within the specified TTL (time-to-live) to confirm your order.</li>
              <li>
                The App supports integration with third-party payment gateways. QuickBite is not responsible for payment
                processing errors outside its control.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Pickup and Cancellation</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>You are responsible for collecting your order during the assigned pickup slot.</li>
              <li>Orders may be canceled subject to cafeteria policies and payment provider rules.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">User Conduct</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>Use the App for fraudulent or unauthorized purposes.</li>
              <li>Attempt to manipulate inventory, slots, or ordering systems.</li>
              <li>Share your account with unauthorized users.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">QuickBite and its developers are not liable for:</p>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1 mt-1">
              <li>
                Loss or delay of orders due to system outages, network issues, or manual errors by cafeteria staff.
              </li>
              <li>Any issues arising from third-party integrations (e.g., payment gateways, SMS services).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Modifications to Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              QuickBite reserves the right to modify, suspend, or discontinue any feature of the App at any time.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your account if you violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the Republic of the Philippines.
            </p>
          </section>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="flex justify-center pb-4 pt-4">
        <div className="w-32 h-1 bg-foreground rounded-full" />
      </div>
    </main>
  )
}
