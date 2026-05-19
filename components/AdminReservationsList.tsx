"use client"

import { useState } from "react"
import { PaymentToggle } from "./PaymentToggle"
import { CancelReservationButton } from "./CancelReservationButton"

type Props = {
  sessions: any[]
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(session: any) {
  if (!session.schedule_blocks) return "Horario no disponible"

  return `${session.schedule_blocks.start_time.slice(0, 5)} – ${session.schedule_blocks.end_time.slice(0, 5)}`
}

function getReservation(session: any) {
  return Array.isArray(session.reservations)
    ? session.reservations[0]
    : session.reservations
}

function getService(session: any) {
  return Array.isArray(session.services)
    ? session.services[0]
    : session.services
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}

export function AdminReservationsList({ sessions }: Props) {
  const [filter, setFilter] = useState("active")
  const [statusByReservation, setStatusByReservation] = useState<
    Record<string, "confirmed" | "cancelled">
  >({})

  const today = getTodayDate()

  const groupedByReservation = sessions.reduce((groups: any, session: any) => {
    const reservation = getReservation(session)
    if (!reservation?.id) return groups

    if (!groups[reservation.id]) {
      groups[reservation.id] = {
        reservation,
        service: getService(session),
        sessions: [],
      }
    }

    groups[reservation.id].sessions.push(session)

    return groups
  }, {})

  const reservations = Object.values(groupedByReservation).map((item: any) => {
    const sortedSessions = item.sessions.sort((a: any, b: any) =>
      String(a.session_date).localeCompare(String(b.session_date))
    )

    const currentStatus =
      statusByReservation[item.reservation.id] ??
      item.reservation?.status ??
      "confirmed"

    const isCancelled = currentStatus === "cancelled"

    const hasFutureOrTodaySession = sortedSessions.some(
      (session: any) => session.session_date >= today
    )

    const isPast = !isCancelled && !hasFutureOrTodaySession

    return {
      ...item,
      sessions: sortedSessions,
      currentStatus,
      isCancelled,
      isPast,
    }
  })

  const filteredReservations = reservations.filter((item: any) => {
    if (filter === "all") return true
    if (filter === "cancelled") return item.isCancelled
    if (filter === "past") return item.isPast
    return !item.isCancelled && !item.isPast
  })

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98] ${
            filter === "active"
              ? "border-[#59B9C6] bg-[#59B9C6] text-white"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          Vigentes
        </button>

        <button
          type="button"
          onClick={() => setFilter("past")}
          className={`rounded-full border px-4 py-2 text-sm ${
            filter === "past"
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          Anteriores
        </button>

        <button
          type="button"
          onClick={() => setFilter("cancelled")}
          className={`rounded-full border px-4 py-2 text-sm ${
            filter === "cancelled"
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          Canceladas
        </button>

        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full border px-4 py-2 text-sm ${
            filter === "all"
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          Todas
        </button>
      </div>

      <div className="mt-8 grid gap-4">
        {filteredReservations.map((item: any) => {
          const reservation = item.reservation
          const firstSession = item.sessions[0]
          const service = item.service
          const shouldDim = item.isCancelled || item.isPast

          const nextSession = item.sessions.find(
  (session: any) => session.session_date >= today
)

const lastSession =
  item.sessions[item.sessions.length - 1]

          return (
            <article
              key={reservation.id}
              className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition ${
                shouldDim ? "bg-white/70" : ""
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className={shouldDim ? "opacity-45" : ""}>
<div className="space-y-1">
  {nextSession ? (
    <p className="text-sm uppercase tracking-[0.2em] text-[#59B9C6]">
      Siguiente sesión:{" "}
      {formatDate(nextSession.session_date)}
    </p>
  ) : (
    <p className="text-sm font-semibold tracking-[0.12em] text-gray-500">
      Última sesión:{" "}
      {lastSession?.session_date
        ? formatDate(lastSession.session_date)
        : "Sin fecha"}
    </p>
  )}

  <p className="text-xs text-[#1F1F1F]/60">
    {firstSession?.session_date
      ? `Primera sesión: ${formatDate(firstSession.session_date)}`
      : "Sin fecha"}
  </p>
</div>

                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
                    {reservation.customer_name} {reservation.customer_last_name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {service?.name ?? "Servicio no disponible"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                      Personas: {firstSession?.people_count ?? "-"}
                    </span>

                    <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                      Sesiones: {item.sessions.length}
                    </span>

                    <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                      Estado:{" "}
                      {item.isCancelled
                        ? "Reservación cancelada"
                        : item.isPast
                          ? "Reservación anterior"
                          : "Reservación vigente"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <PaymentToggle
                    reservationId={reservation.id}
                    initialStatus={reservation.payment_status ?? "pending"}
                  />

                  <CancelReservationButton
                    reservationId={reservation.id}
                    initialStatus={item.currentStatus}
                    onStatusChange={(nextStatus) =>
                      setStatusByReservation((current) => ({
                        ...current,
                        [reservation.id]: nextStatus,
                      }))
                    }
                  />
                </div>
              </div>

              <details className="mt-4 border-t border-gray-100 pt-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-[#59B9C6]">
                  Ver sesiones y contacto
                </summary>

                <div
                  className={`mt-4 grid gap-4 text-sm text-gray-600 ${
                    shouldDim ? "opacity-45" : ""
                  }`}
                >
                  <div>
                    <p>Tel: {reservation.phone}</p>
                    <p>Correo: {reservation.email}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F5F2] p-4">
                    <p className="font-medium text-[#1F1F1F]">
                      Sesiones de esta reservación
                    </p>

                    <ul className="mt-3 space-y-2">
                      {item.sessions.map((session: any) => (
                        <li key={session.id}>
                          • {formatDate(session.session_date)} ·{" "}
                          {formatTime(session)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </article>
          )
        })}

        {filteredReservations.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            No hay reservaciones para este filtro.
          </div>
        )}
      </div>
    </>
  )
}