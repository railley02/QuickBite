// QuickBite Mock Data based on Functional Specification

export interface Cafeteria {
  id: string
  name: string
  image: string
  status: "open" | "closed"
  waitTimeMinutes: number
  queueSize: number
  availabilityPercent: number
  nextPickup: string
  stallNumber: number
  rating: number
  totalRatings: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stallId: string
  stallName: string
  stallNumber: number
  stock: number
  isPopular?: boolean
}

export interface Category {
  id: string
  name: string
}

export interface PickupSlot {
  id: string
  time: string
  capacity: number
  booked: number
  available: boolean
}

export interface CartItem {
  item: MenuItem
  quantity: number
}

export interface Order {
  id: string
  orderNumber: number
  items: CartItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed"
  pickupSlot: PickupSlot
  totalAmount: number
  paymentMethod: "cash" | "online"
  notes?: string
  customerName: string
  createdAt: string
  cafeteriaId: string
  cafeteriaName: string
}

// Multiple cafeterias
export const cafeterias: Cafeteria[] = [
  {
    id: "lagoon-1",
    name: "Lagoon Cafeteria",
    image: "/cafeteria-lagoon-food-stall.jpg",
    status: "open",
    waitTimeMinutes: 5,
    queueSize: 23,
    availabilityPercent: 89,
    nextPickup: "2:15 PM",
    stallNumber: 1,
    rating: 4.5,
    totalRatings: 128,
  },
  {
    id: "main-caf",
    name: "East Cafeteria",
    image: "/main-cafeteria-restaurant.jpg",
    status: "closed",
    waitTimeMinutes: 8,
    queueSize: 15,
    availabilityPercent: 75,
    nextPickup: "2:30 PM",
    stallNumber: 2,
    rating: 4.2,
    totalRatings: 96,
  },
  {
    id: "east-wing",
    name: "East Wing Canteen",
    image: "/canteen-food-court.jpg",
    status: "closed",
    waitTimeMinutes: 0,
    queueSize: 0,
    availabilityPercent: 100,
    nextPickup: "Tomorrow 8:00 AM",
    stallNumber: 4,
    rating: 4.9,
    totalRatings: 150,
  },
  {
    id: "snack-corner",
    name: "Mcjollibee",
    image: "/snack-bar-corner-shop.jpg",
    status: "open",
    waitTimeMinutes: 3,
    queueSize: 8,
    availabilityPercent: 95,
    nextPickup: "2:45 PM",
    stallNumber: 3,
    rating: 4.8,
    totalRatings: 215,
  },
]

// Categories
export const categories: Category[] = [
  { id: "all", name: "All" },
  { id: "rice-meals", name: "Rice Meals" },
  { id: "snacks", name: "Snacks" },
  { id: "drinks", name: "Drinks" },
  { id: "combo", name: "Combo" },
]

// Menu Items - Filipino cafeteria food as per spec
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Shawarma Rice",
    description: "Flavorful shawarma meat served with garlic rice and vegetables",
    price: 65,
    image: "/shawarma-rice-bowl.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 25,
    isPopular: true,
  },
  {
    id: "2",
    name: "Adobo Rice",
    description: "Classic Filipino adobo with steamed rice",
    price: 55,
    image: "/chicken-adobo-rice.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 3,
    isPopular: true,
  },
  {
    id: "3",
    name: "Burger",
    description: "Juicy beef patty with fresh vegetables",
    price: 45,
    image: "/burger-sandwich.jpg",
    category: "snacks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 18,
    isPopular: true,
  },
  {
    id: "4",
    name: "Fries",
    description: "Crispy golden french fries",
    price: 35,
    image: "/crispy-french-fries.png",
    category: "snacks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 3,
  },
  {
    id: "5",
    name: "Footlong",
    description: "Classic footlong hotdog sandwich",
    price: 40,
    image: "/footlong-hotdog.jpg",
    category: "snacks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 12,
  },
  {
    id: "6",
    name: "Siomai Rice",
    description: "Steamed siomai dumplings with rice and chili garlic sauce",
    price: 50,
    image: "/siomai-dumplings-rice.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 20,
  },
  {
    id: "7",
    name: "Iced Tea",
    description: "Refreshing cold iced tea",
    price: 20,
    image: "/iced-tea-glass.png",
    category: "drinks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 50,
  },
  {
    id: "8",
    name: "Gulaman",
    description: "Sweet sago and gulaman drink",
    price: 25,
    image: "/sago-gulaman-drink.jpg",
    category: "drinks",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 30,
  },
  {
    id: "9",
    name: "Burger Meal",
    description: "Burger with fries and drinks combo",
    price: 85,
    image: "/burger-meal-combo.jpg",
    category: "combo",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 15,
    isPopular: true,
  },
  {
    id: "10",
    name: "Sisig Rice",
    description: "Sizzling sisig served with steamed rice",
    price: 70,
    image: "/sisig-rice-meal.jpg",
    category: "rice-meals",
    stallId: "lagoon-1",
    stallName: "Lagoon Cafeteria",
    stallNumber: 1,
    stock: 10,
  },
  // Main Cafeteria items
  {
    id: "11",
    name: "Tapsilog",
    description: "Beef tapa with sinangag and itlog",
    price: 75,
    image: "/tapsilog-breakfast.jpg",
    category: "rice-meals",
    stallId: "main-caf",
    stallName: "East Cafeteria",
    stallNumber: 2,
    stock: 20,
    isPopular: true,
  },
  {
    id: "12",
    name: "Longsilog",
    description: "Longganisa with sinangag and itlog",
    price: 65,
    image: "/longsilog-breakfast.jpg",
    category: "rice-meals",
    stallId: "main-caf",
    stallName: "East Cafeteria",
    stallNumber: 2,
    stock: 18,
  },
  {
    id: "13",
    name: "Palabok",
    description: "Filipino noodles with shrimp sauce",
    price: 55,
    image: "/palabok-noodles.jpg",
    category: "rice-meals",
    stallId: "main-caf",
    stallName: "East Cafeteria",
    stallNumber: 2,
    stock: 12,
  },
  {
    id: "14",
    name: "Halo-Halo",
    description: "Filipino shaved ice dessert",
    price: 45,
    image: "/halo-halo-dessert.jpg",
    category: "drinks",
    stallId: "main-caf",
    stallName: "East Cafeteria",
    stallNumber: 2,
    stock: 25,
    isPopular: true,
  },
  // Snack Corner items
  {
    id: "15",
    name: "Fish Ball",
    description: "Street-style fish balls with sauce",
    price: 20,
    image: "/fish-ball-street-food.jpg",
    category: "snacks",
    stallId: "snack-corner",
    stallName: "Mcjollibee",
    stallNumber: 3,
    stock: 50,
  },
  {
    id: "16",
    name: "Kwek-Kwek",
    description: "Deep fried quail eggs",
    price: 25,
    image: "/kwek-kwek-eggs.jpg",
    category: "snacks",
    stallId: "snack-corner",
    stallName: "Mcjollibee",
    stallNumber: 3,
    stock: 40,
  },
  {
    id: "17",
    name: "Banana Cue",
    description: "Caramelized banana on stick",
    price: 15,
    image: "/banana-cue.jpg",
    category: "snacks",
    stallId: "snack-corner",
    stallName: "Mcjollibee",
    stallNumber: 3,
    stock: 30,
  },
  {
    id: "18",
    name: "Coke Float",
    description: "Coca-cola with vanilla ice cream",
    price: 35,
    image: "/coke-float.jpg",
    category: "drinks",
    stallId: "snack-corner",
    stallName: "Mcjollibee",
    stallNumber: 3,
    stock: 20,
  },
]

// Available Pickup Slots
export const pickupSlots: PickupSlot[] = [
  { id: "slot-1", time: "10:15 AM", capacity: 10, booked: 8, available: true },
  { id: "slot-2", time: "10:30 AM", capacity: 10, booked: 5, available: true },
  { id: "slot-3", time: "10:45 AM", capacity: 10, booked: 2, available: true },
  { id: "slot-4", time: "11:00 AM", capacity: 10, booked: 10, available: false },
  { id: "slot-5", time: "11:15 AM", capacity: 10, booked: 0, available: true },
  { id: "slot-6", time: "2:00 PM", capacity: 10, booked: 3, available: true },
  { id: "slot-7", time: "2:15 PM", capacity: 10, booked: 6, available: true },
  { id: "slot-8", time: "2:30 PM", capacity: 10, booked: 4, available: true },
]
