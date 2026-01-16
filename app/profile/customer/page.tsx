"use client"
import { supabase } from "../../../lib/supabaseClient"
import { useEffect } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  UtensilsCrossed,
  ShoppingCart,
  User,
  ChevronRight,
  Edit2,
  History,
  FileText,
  Shield,
  LogOut,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/orders-context"

export default function CustomerProfilePage() {
  const router = useRouter()
  const { totalItems } = useCart()
  const { orders } = useOrders()
  const [showEditModal, setShowEditModal] = useState(false)
  const [profile, setProfile] = useState({
  name: "",
  email: "",
  phone: "",
})
  const [editPhone, setEditPhone] = useState(profile.phone)

  const handleSavePhone = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const userId = session.user.id

  const { error } = await supabase
    .from("users")
    .update({ contact: editPhone })
    .eq("id", userId)

  if (error) {
    alert("Failed to update phone: " + error.message)
    console.error(error)
  } else {
    setProfile({ ...profile, phone: editPhone })
    setShowEditModal(false)
    alert("Phone number updated!")
  }
}

  const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push("/sign-in")
}

useEffect(() => {
  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const userId = session.user.id

    const { data, error } = await supabase
      .from("users")
      .select("full_name, email, contact")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error.message)
    } else {
      setProfile({
        name: data.full_name,
        email: data.email,
        phone: data.contact,
      })
      setEditPhone(data.contact)
    }
  }

  fetchProfile()
}, [])

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-orange-400 px-4 pt-8 pb-16 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white text-center">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-10">
        <div className="bg-card border border-border rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground text-lg">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4 py-6 flex-1 pb-24 overflow-y-auto">
        {/* Account Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account Details</h3>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-foreground font-medium">{profile.name}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">{profile.email}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Contact Number</p>
                <p className="text-foreground font-medium">{profile.phone}</p>
              </div>
              <button onClick={() => setShowEditModal(true)} className="text-primary cursor-pointer">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Orders</h3>
          <div className="bg-card border border-border rounded-xl">
            <Link href="/orders" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Order History</p>
                  <p className="text-xs text-muted-foreground">{orders.length} orders</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Legal</h3>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <Link href="/terms" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">Terms of Service</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link href="/privacy" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">Privacy Policy</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Edit Phone Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Contact Number</h3>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 h-12 bg-muted text-foreground font-medium rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhone}
                className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/customer" className="flex flex-col items-center text-muted-foreground">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/cafeterias" className="flex flex-col items-center text-muted-foreground">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs mt-1">Cafeterias</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-muted-foreground relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs mt-1">Basket</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/profile/customer" className="flex flex-col items-center text-primary">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
