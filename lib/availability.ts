import { supabase } from "./supabaseClient"

type AvailabilityResult = {
  available: boolean
  remaining: number
  message: string
  blocked?: boolean
}

async function isScheduleBlocked(date: string, blockId: string) {
  const { data, error } = await supabase
    .from("blocked_schedule_dates")
    .select("id, block_id")
    .eq("date", date)

  if (error) {
    return {
      blocked: true,
      message: "Error consultando bloqueos",
    }
  }

  const blocked = data?.some((item) => {
    if (!item.block_id) return true
    return item.block_id === blockId
  })

  return {
    blocked: Boolean(blocked),
    message: blocked ? "Horario bloqueado por el estudio" : "",
  }
}

export async function getAvailability(
  serviceId: string,
  date: string,
  blockId: string
): Promise<AvailabilityResult> {
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, capacity")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service) {
    return {
      available: false,
      remaining: 0,
      message: "Servicio no encontrado",
    }
  }

  const blocked = await isScheduleBlocked(date, blockId)

  if (blocked.blocked) {
    return {
      available: false,
      remaining: 0,
      message: blocked.message,
      blocked: true,
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

    const hasEnoughSpace =
      availability.available && availability.remaining >= peopleCount

    results.push({
      date,
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

    const hasEnoughSpace =
      availability.available && availability.remaining >= peopleCount

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

