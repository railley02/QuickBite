import { supabase } from "@/lib/supabaseClient"
import type { Cafeteria } from "@/lib/mock-data"

/**
 * Raw row type coming from Supabase `vendors` table
 */
type VendorRow = {
  id: string
  stall_name: string | null
  stall_number: number | null
  created_at: string | null
}

export async function getCafeteriasFromDB(): Promise<Cafeteria[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("id, stall_name, stall_number, created_at")
    // Numbered stalls first
    .order("stall_number", { ascending: true, nullsFirst: false })
    // Newly registered stalls next
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Failed to fetch cafeterias:", error.message)
    return []
  }

  const rows = (data ?? []) as VendorRow[]

  return rows.map((v): Cafeteria => ({
    id: v.id,
    name: v.stall_name ?? "Unnamed Stall",
    image: "/placeholder.svg",

    // REQUIRED BY INTERFACE
    status: "open", // later: map from vendors.is_open
    waitTimeMinutes: 0,
    queueSize: 0,
    availabilityPercent: 100,
    nextPickup: "—",

    stallNumber: v.stall_number ?? 0,
    rating: 4.5,
    totalRatings: 0,
  }))
}
