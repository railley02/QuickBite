"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
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
          <span className="text-lg font-bold">Privacy Policy</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="space-y-6 text-sm text-foreground">
          <section>
            <h2 className="font-bold text-base mb-2">Information We Collect</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>
                <strong>Personal Information:</strong> PUP email, name, contact details.
              </li>
              <li>
                <strong>Order Information:</strong> Menu selections, pickup times, payment status.
              </li>
              <li>
                <strong>Device Information:</strong> IP address, device type, operating system (for analytics and
                security).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">How We Use Your Information</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>To process orders, assign pickup slots, and send notifications.</li>
              <li>To improve App functionality and user experience.</li>
              <li>To generate anonymized reports for cafeteria and university administration.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Data Sharing</h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>PUP cafeteria staff (for order fulfillment).</li>
              <li>Third-party services (payment gateways, SMS providers) strictly for operational purposes.</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures, including encryption (TLS 1.2+), secure authentication,
              and PCI-DSS compliance for payment data.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Order data is retained for at least 90 days for reporting and auditing. Personal data is deleted upon
              account deletion or after inactivity.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-1">You may:</p>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
              <li>Access, update, or delete your personal data via the App.</li>
              <li>Opt out of non-essential notifications.</li>
              <li>Request a copy of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              We adhere to the Philippine Data Privacy Act of 2012 and relevant campus data policies.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy. Continued use of the App constitutes acceptance of changes.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              QuickBite Development Team
              <br />
              BSCS 3-1N Group 6<br />
              Polytechnic University of the Philippines
              <br />
              abetcafeteria@gmail.com
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
