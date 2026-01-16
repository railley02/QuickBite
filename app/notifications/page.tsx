"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell } from "lucide-react"

type Notification = {
  id: string
  type: "order_update" | "pickup_reminder" | "payment" | "system"
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order_update",
      title: "Order Ready for Pickup",
      message: "Your order #42 from Lagoon Cafeteria is ready. Please proceed to the pickup counter.",
      time: "5 mins ago",
      read: false,
    },
    {
      id: "2",
      type: "pickup_reminder",
      title: "Pickup Reminder",
      message: "Your order is scheduled for pickup in 15 minutes at 11:00 AM.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Confirmed",
      message: "Your payment of ₱150 has been received. Order #42 is being prepared.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "system",
      title: "New Cafeteria Added",
      message: "Snack Bar is now available on QuickBite! Browse their menu now.",
      time: "1 day ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="p-2 -ml-2 cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm text-primary font-medium cursor-pointer">
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`px-4 py-4 border-b border-border cursor-pointer ${!notification.read ? "bg-primary/5" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === "order_update"
                    ? "bg-green-100"
                    : notification.type === "pickup_reminder"
                      ? "bg-orange-100"
                      : notification.type === "payment"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                }`}
              >
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`font-semibold text-foreground ${!notification.read ? "font-bold" : ""}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No notifications yet</h2>
            <p className="text-muted-foreground text-sm text-center mt-2">
              We'll notify you when there are updates about your orders
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
