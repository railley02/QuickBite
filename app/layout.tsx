import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { OrdersProvider } from "@/lib/orders-context"
import { VendorProvider } from "@/lib/vendor-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickBite",
  description: "Skip the line, savor the time",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <OrdersProvider>
            <VendorProvider>
              <div className="phone-frame">{children}</div>
            </VendorProvider>
          </OrdersProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
