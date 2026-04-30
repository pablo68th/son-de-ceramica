import { supabase } from "./supabaseClient"
import { generateSessionDates } from "./sessionGenerator"
import { validateFullAvailability } from "./availability"

type CreateReservationParams = {
  serviceId: string
  startDate: string
  secondDayDate?: string
  blockId: string
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

  const dates = generateSessionDates({
    startDate: params.startDate,
    secondDayDate: params.secondDayDate,
    sessionsCount: service.sessions_count,
    weeklyFrequency: service.weekly_frequency,
  })

  const validation = await validateFullAvailability({
    serviceId: params.serviceId,
    dates,
    blockId: params.blockId,
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
  console.error("reservationError:", reservationError)
  throw new Error(reservationError?.message || "Error creando la reserva")
}
  const sessions = dates.map((date) => ({
    reservation_id: reservation.id,
    service_id: params.serviceId,
    session_date: date,
    block_id: params.blockId,
    people_count: params.peopleCount,
    status: "confirmed",
  }))

  const { error: sessionsError } = await supabase
    .from("reservation_sessions")
    .insert(sessions)

  if (sessionsError) {
    throw new Error("Error creando sesiones")
  }

  return {
    reservation,
    sessions,
  }
}