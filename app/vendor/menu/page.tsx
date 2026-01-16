"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, ClipboardList, BarChart3, UtensilsCrossed, User, Plus, Edit2, X } from "lucide-react"
import { useVendor } from "@/lib/vendor-context"
import type { MenuItem } from "@/lib/mock-data"

type StockFilter = "all" | "low" | "high" | "out"

export default function VendorMenuPage() {
  const { menuItems, updateItemStock, addMenuItem, deleteMenuItem } = useVendor()
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editStock, setEditStock] = useState(0)
  const [newItemName, setNewItemName] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemInitialStock, setNewItemInitialStock] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editCategory, setEditCategory] = useState("")

  const filteredItems = menuItems.filter((item) => {
    switch (stockFilter) {
      case "low":
        return item.stock > 0 && item.stock <= 5
      case "high":
        return item.stock > 5
      case "out":
        return item.stock === 0
      default:
        return true
    }
  })

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" }
    if (stock <= 5) return { label: "Low", color: "bg-yellow-100 text-yellow-700" }
    return { label: "In Stock", color: "bg-green-100 text-green-700" }
  }

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item)
    setEditName(item.name)
    setEditDescription(item.description)
    setEditPrice(item.price.toString())
    setEditStock(item.stock)
    setEditCategory(item.category)
  }

  const handleSaveStock = () => {
    if (selectedItem) {
      updateItemStock(selectedItem.id, editStock)
      setSelectedItem(null)
    }
  }

  const handleMarkOutOfStock = () => {
    if (selectedItem) {
      updateItemStock(selectedItem.id, 0)
      setSelectedItem(null)
    }
  }

  const handleAddItem = () => {
    if (newItemName && newItemDescription && newItemPrice && newItemInitialStock && newItemCategory) {
      addMenuItem({
        id: menuItems.length + 1,
        name: newItemName,
        description: newItemDescription,
        price: Number.parseFloat(newItemPrice),
        stock: Number.parseInt(newItemInitialStock),
        category: newItemCategory,
        image: "/placeholder.svg",
      })
      setShowAddModal(false)
    }
  }

  return (
    <main className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground mb-4">Menu</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { key: "all", label: "All" },
              { key: "low", label: "Stock - Low to High" },
              { key: "high", label: "Stock - High to Low" },
              { key: "out", label: "Out of Stock" },
            ] as { key: StockFilter; label: string }[]
          ).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStockFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                stockFilter === filter.key ? "bg-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const status = getStockStatus(item.stock)
            return (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Stock: {item.stock}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary mt-1">₱{item.price}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      updateItemStock(item.id, 0)
                    }}
                    disabled={item.stock === 0}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                  >
                    Out of Stock
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Edit Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Edit Item</h3>
              <button onClick={() => setSelectedItem(null)} className="text-muted-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Item Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full h-20 px-4 py-3 bg-muted rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground">₱</span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full h-12 pl-8 pr-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number.parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="meals">Meals</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                  <option value="rice-meals">Rice Meals</option>
                  <option value="drinks">Drinks</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this item?")) {
                      deleteMenuItem(selectedItem.id)
                      setSelectedItem(null)
                    }
                  }}
                  className="flex-1 h-12 bg-red-500 text-white font-medium rounded-xl cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={handleSaveStock}
                  className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-[390px] rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Add New Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Upload Image *</label>
                <div className="w-full h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Tap to upload image</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Chicken Adobo Rice"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description *</label>
                <textarea
                  placeholder="Describe your dish..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full h-20 px-4 py-3 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground">₱</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full h-12 pl-8 pr-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Initial Stock *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItemInitialStock}
                  onChange={(e) => setNewItemInitialStock(e.target.value)}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Category *</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full h-12 px-4 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  <option value="meals">Meals</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-muted text-foreground font-medium rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 h-12 bg-primary text-white font-medium rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
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
          <Link href="/vendor/menu" className="flex flex-col items-center text-primary">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs mt-1">Menu</span>
          </Link>
          <Link href="/vendor/sales" className="flex flex-col items-center text-zinc-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Reports</span>
          </Link>
          <Link href="/profile/vendor" className="flex flex-col items-center text-zinc-600">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
