"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  ClipboardList,
  BarChart3,
  UtensilsCrossed,
  User,
  ChevronRight,
  Edit2,
  History,
  FileText,
  Shield,
  LogOut,
  Store,
  Clock,
  Camera,
  Star,
  Users,
} from "lucide-react"
import { useVendor } from "@/lib/vendor-context"

export default function VendorProfilePage() {
  const router = useRouter()
  const { stallName, isOpen, todaySales, vendorOrders } = useVendor()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditHoursModal, setShowEditHoursModal] = useState(false)
  const [showEditSlotModal, setShowEditSlotModal] = useState(false)
  const [profile, setProfile] = useState({
    name: "Maria Santos",
    email: "msantos@pup.edu.ph",
    phone: "+63 917 123 4567",
    stallNumber: "Stall 1",
    operatingHours: "8:00 AM - 8:00 PM",
    slotCapacity: 15,
  })
  const [editPhone, setEditPhone] = useState(profile.phone)
  const [editHours, setEditHours] = useState(profile.operatingHours)
  const [editSlotCapacity, setEditSlotCapacity] = useState(profile.slotCapacity)

  const handleSavePhone = () => {
    setProfile({ ...profile, phone: editPhone })
    setShowEditModal(false)
  }

  const handleSaveHours = () => {
    setProfile({ ...profile, operatingHours: editHours })
    setShowEditHoursModal(false)
  }

  const handleSaveSlotCapacity = () => {
    setProfile({ ...profile, slotCapacity: editSlotCapacity })
    setShowEditSlotModal(false)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const completedOrders = vendorOrders.filter((o) => o.status === "completed" || o.status === "ready").length

  const vendorRating = {
    overall: 4.5,
    totalReviews: 42,
    foodRating: 4.6,
    serviceRating: 4.4,
    recentReviews: [
      { user: "Anonymous", comment: "Great food, fast service!", rating: 5, date: "2 days ago" },
      { user: "Juan D.", comment: "Portions could be bigger", rating: 4, date: "5 days ago" },
    ],
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FF6901] to-orange-500 px-4 pt-8 pb-16 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white text-center">Vendor Profile</h1>
      </div>

      <div className="px-4 -mt-10">
        <div className="bg-card border border-border rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                <Store className="w-10 h-10 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground text-lg">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{stallName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-muted-foreground">{isOpen ? "Open" : "Closed"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4 py-6 flex-1 pb-24 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Today's Sales</p>
            <p className="text-lg font-bold text-primary">₱{todaySales.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Orders Completed</p>
            <p className="text-lg font-bold text-foreground">{completedOrders}</p>
          </div>
        </div>

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

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Stall Information
          </h3>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Stall Name</p>
              <p className="text-foreground font-medium">{stallName}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Stall Number</p>
              <p className="text-foreground font-medium">{profile.stallNumber}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Operating Hours</p>
                  <p className="text-foreground font-medium">{profile.operatingHours}</p>
                </div>
              </div>
              <button onClick={() => setShowEditHoursModal(true)} className="text-primary cursor-pointer">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Slot Capacity</p>
                  <p className="text-foreground font-medium">{profile.slotCapacity} persons per slot</p>
                </div>
              </div>
              <button onClick={() => setShowEditSlotModal(true)} className="text-primary cursor-pointer">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">My Ratings</h3>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-foreground">{vendorRating.overall}</span>
                  <span className="text-muted-foreground">/5</span>
                </div>
                <p className="text-sm text-muted-foreground">{vendorRating.totalReviews} reviews</p>
              </div>
              <Link
                href="/cafeteria-reviews/lagoon-1"
                className="flex items-center gap-1 text-sm text-primary font-medium cursor-pointer"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-lg font-bold text-foreground">{vendorRating.foodRating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">Food Quality</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-lg font-bold text-foreground">{vendorRating.serviceRating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">Service</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-sm font-medium text-foreground">Recent Reviews</p>
              {vendorRating.recentReviews.map((review, idx) => (
                <div key={idx} className="bg-muted rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{review.user}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-muted-foreground">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">"{review.comment}"</p>
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <Link href="/vendor/sales" className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Sales History</p>
                  <p className="text-xs text-muted-foreground">View all transactions</p>
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

      {showEditHoursModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Operating Hours</h3>
            <input
              type="text"
              value={editHours}
              onChange={(e) => setEditHours(e.target.value)}
              placeholder="e.g., 8:00 AM - 8:00 PM"
              className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditHoursModal(false)}
                className="flex-1 h-12 bg-muted text-foreground font-medium rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHours}
                className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditSlotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Slot Capacity</h3>
            <div className="mb-2">
              <label className="block text-sm text-muted-foreground mb-2">Persons per slot</label>
              <input
                type="number"
                value={editSlotCapacity}
                onChange={(e) => setEditSlotCapacity(Number.parseInt(e.target.value) || 0)}
                min={1}
                max={50}
                className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              This determines how many customers can place orders per 15-minute time slot.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditSlotModal(false)}
                className="flex-1 h-12 bg-muted text-foreground font-medium rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlotCapacity}
                className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-[390px] mx-auto flex justify-around py-3">
          <Link href="/home/vendor" className="flex flex-col items-center text-zinc-600">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/vendor/orders" className="flex flex-col items-center text-zinc-600">
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <Link href="/vendor/menu" className="flex flex-col items-center text-zinc-600">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs mt-1">Menu</span>
          </Link>
          <Link href="/vendor/sales" className="flex flex-col items-center text-zinc-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Reports</span>
          </Link>
          <Link href="/profile/vendor" className="flex flex-col items-center text-primary">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
