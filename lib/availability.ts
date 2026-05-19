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

    const { data: blockedDates } = await supabase
    .from("blocked_schedule_dates")
    .select("*")
    .eq("date", date)

  const isBlocked = blockedDates?.some((blocked) => {
    if (!blocked.block_id) return true

    return blocked.block_id === blockId
  })

  if (isBlocked) {
    return {
      available: false,
      remaining: 0,
      message: "Horario no disponible",
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

    const { data: reservedCount, error: reservedError } = await supabase.rpc(
    "get_reserved_people_count",
    {
      p_service_id: serviceId,
      p_session_date: date,
      p_block_id: blockId,
    }
  )

  if (reservedError) {
    return {
      available: false,
      remaining: 0,
      message: "Error consultando disponibilidad",
    }
  }

  const reserved = reservedCount ?? 0

  const remaining = Math.max(service.capacity - reserved, 0)
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

