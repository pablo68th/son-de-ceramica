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

export async function validateFullAvailability({
  serviceId,
  dates,
  blockId,
  peopleCount,
}: {
  serviceId: string
  dates: string[]
  blockId: string
  peopleCount: number
}) {
  const results = []

  for (const date of dates) {
    const availability = await getAvailability(serviceId, date, blockId)

    const hasEnoughSpace = availability.remaining >= peopleCount

    results.push({
      date,
      available: hasEnoughSpace,
      remaining: availability.remaining,
      message: availability.message,
    })
  }

  const allAvailable = results.every((result) => result.available)

  return {
    allAvailable,
    results,
  }
}

export async function validateSessionPlanAvailability({
  serviceId,
  sessions,
  peopleCount,
}: {
  serviceId: string
  sessions: { date: string; blockId: string }[]
  peopleCount: number
}) {
  const results = []

  for (const session of sessions) {
    const availability = await getAvailability(
      serviceId,
      session.date,
      session.blockId
    )

    const hasEnoughSpace = availability.remaining >= peopleCount

    results.push({
      date: session.date,
      blockId: session.blockId,
      available: hasEnoughSpace,
      remaining: availability.remaining,
      message: availability.message,
    })
  }

  return {
    allAvailable: results.every((result) => result.available),
    results,
  }
}