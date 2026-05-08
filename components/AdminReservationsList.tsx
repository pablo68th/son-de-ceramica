"use client"

import { useState } from "react"
import { PaymentToggle } from "./PaymentToggle"
import { CancelReservationButton } from "./CancelReservationButton"

type Props = {
  sessions: any[]
}

export function AdminReservationsList({ sessions }: Props) {
  const [filter, setFilter] = useState("active")

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true
    if (filter === "cancelled") return session.status === "cancelled"
    return session.status !== "cancelled"
  })

  const groupedSessions = filteredSessions.reduce((groups: any, session: any) => {
    const date = session.session_date || "Sin fecha"

    if (!groups[date]) {
      groups[date] = []
    }

    groups[date].push(session)

    return groups
  }, {})

  const groupedEntries = Object.entries(groupedSessions)

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
          Activas
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

      <div className="mt-8 space-y-8">
        {groupedEntries.map(([date, dateSessions]: any) => (
          <section key={date}>
            <h2 className="mb-3 text-xl font-semibold tracking-[-0.03em] text-[#1F1F1F]">
              {date === "Sin fecha"
                ? "Sin fecha"
                : new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
            </h2>

            <div className="grid gap-4">
              {dateSessions.map((session: any) => (
                <article
                  key={session.id}
                  className={`rounded-3xl bg-white p-5 shadow-sm ${
                    session.status === "cancelled"
  ? "border border-red-100 bg-red-50/40"
  : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.02em]">
                        {session.reservations.customer_name}{" "}
                        {session.reservations.customer_last_name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {session.services.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {session.schedule_blocks
                          ? `${session.schedule_blocks.start_time.slice(0, 5)} – ${session.schedule_blocks.end_time.slice(0, 5)}`
                          : "Horario no disponible"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                          Personas: {session.people_count}
                        </span>

                        <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-gray-700">
                          Estado:{" "}
                          {session.status === "cancelled" ? "Cancelada" : "Activa"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <PaymentToggle
                        reservationId={session.reservations.id}
                        initialStatus={session.reservations.payment_status}
                      />

                      {session.status !== "cancelled" ? (
                        <CancelReservationButton reservationId={session.reservations.id} />
                      ) : (
                        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">
                          Cancelada
                        </span>
                      )}
                    </div>
                  </div>

                    <details className="mt-4 border-t border-gray-100 pt-4">
                      <summary className="cursor-pointer list-none text-sm font-medium text-[#59B9C6]">
                        Ver detalles
                      </summary>

                      <div className="mt-3 text-sm text-gray-600">
                        <p>Tel: {session.reservations.phone}</p>
                        <p>Correo: {session.reservations.email}</p>
                      </div>
                    </details>
                </article>
              ))}
            </div>
          </section>
        ))}

        {filteredSessions.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            No hay reservas para este filtro.
          </div>
        )}
      </div>
    </>
  )
}