import { supabase } from "./supabaseClient"

export async function getAvailability(
  serviceId: string,
  date: string,
  blockId: string
) {
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service) {
    return {
      available: false,
      remaining: 0,
      message: "Servicio no encontrado",
    }
  }

  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("*")
    .eq("blocked_date", date)

  const isDayBlocked = blocked?.some((b) => b.block_id === null)
  const isBlockBlocked = blocked?.some((b) => b.block_id === blockId)

  if (isDayBlocked || isBlockBlocked) {
    return {
      available: false,
      remaining: 0,
      message: "Fecha o bloque no disponible",
    }
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("reservation_sessions")
    .select("people_count")
    .eq("service_id", serviceId)
    .eq("session_date", date)
    .eq("block_id", blockId)
    .eq("status", "confirmed")

  if (sessionsError) {
    return {
      available: false,
      remaining: 0,
      message: "Error consultando disponibilidad",
    }
  }

  const reserved =
    sessions?.reduce((total, session) => total + session.people_count, 0) ?? 0

  const remaining = service.capacity - reserved

  return {
    available: remaining > 0,
    remaining,
    message: remaining > 0 ? "Disponible" : "Sin cupo",
  }
}
