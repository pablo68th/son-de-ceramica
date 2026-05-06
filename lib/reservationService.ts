import { supabase } from "./supabaseClient"
import { generateSessionPlan } from "./sessionGenerator"
import { validateSessionPlanAvailability } from "./availability"

type CreateReservationParams = {
  serviceId: string
  startDate: string
  secondDayDate?: string
  blockId: string
  secondBlockId?: string
  peopleCount: number
  name: string
  lastName: string
  phone: string
  email: string
}

export async function createReservation(params: CreateReservationParams) {
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.serviceId)
    .single()

  if (!service) {
    throw new Error("Servicio no encontrado")
  }

  const sessionPlan = generateSessionPlan({
    startDate: params.startDate,
    firstBlockId: params.blockId,
    secondDayDate: params.secondDayDate,
    secondBlockId: params.secondBlockId,
    sessionsCount: service.sessions_count,
    weeklyFrequency: service.weekly_frequency,
  })

  const validation = await validateSessionPlanAvailability({
    serviceId: params.serviceId,
    sessions: sessionPlan,
    peopleCount: params.peopleCount,
  })

  if (!validation.allAvailable) {
    throw new Error("No hay disponibilidad en todas las sesiones")
  }

  const { data: reservation, error: reservationError } = await supabase
    .from("reservations")
    .insert({
      service_id: params.serviceId,
      customer_name: params.name,
      customer_last_name: params.lastName,
      phone: params.phone,
      email: params.email,
      people_count: params.peopleCount,
      status: "confirmed",
      payment_status: "pending",
    })
    .select()
    .single()

  if (reservationError || !reservation) {
    throw new Error(reservationError?.message || "Error creando la reserva")
  }

  const sessions = sessionPlan.map((session) => ({
    reservation_id: reservation.id,
    service_id: params.serviceId,
    session_date: session.date,
    block_id: session.blockId,
    people_count: params.peopleCount,
    status: "confirmed",
  }))

  const { error: sessionsError } = await supabase
    .from("reservation_sessions")
    .insert(sessions)

  if (sessionsError) {
    throw new Error(sessionsError.message || "Error creando sesiones")
  }

  return {
    reservation,
    sessions,
  }
}

