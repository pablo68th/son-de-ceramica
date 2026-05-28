"use client"

import { useMemo, useState } from "react"

type Props = {
  sessions: any[]
}

function getReservation(session: any) {
  return Array.isArray(session.reservations)
    ? session.reservations[0]
    : session.reservations
}

function getService(session: any) {
  return Array.isArray(session.services) ? session.services[0] : session.services
}

function formatTime(session: any) {
  if (!session.schedule_blocks) return "Sin horario"
  return `${session.schedule_blocks.start_time.slice(0, 5)} – ${session.schedule_blocks.end_time.slice(0, 5)}`
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  const startPadding = firstDay.getDay()

  for (let i = 0; i < startPadding; i++) days.push(null)

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    days.push(date.toISOString().split("T")[0])
  }

  return days
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  })
}

function getPeriodSummary(daySessions: any[]) {
  const activeSessions = daySessions.filter((session) => {
    const reservation = getReservation(session)

    return (
      reservation?.status !== "cancelled" &&
      session.status !== "cancelled" &&
      ["deposit_paid", "paid"].includes(reservation?.payment_status)
    )
  })

  function summarize(sessions: any[]) {
    const torno = sessions.filter((session) => {
      const service = getService(session)
      return String(service?.name ?? "").toLowerCase().includes("torno")
    })

    const ninos = sessions.filter((session) => {
      const service = getService(session)
      return String(service?.name ?? "").toLowerCase().includes("niñ")
    })

    const manual = sessions.filter((session) => {
      const service = getService(session)
      const name = String(service?.name ?? "").toLowerCase()

      return name.includes("manual") && !name.includes("niñ")
    })

    return {
      total: sessions.reduce(
        (sum, session) => sum + (session.people_count ?? 0),
        0
      ),
      torno: torno.reduce(
        (sum, session) => sum + (session.people_count ?? 0),
        0
      ),
      manual: manual.reduce(
        (sum, session) => sum + (session.people_count ?? 0),
        0
      ),
      ninos: ninos.reduce(
        (sum, session) => sum + (session.people_count ?? 0),
        0
      ),
    }
  }

  const morning = activeSessions.filter((session) => {
    const start = session.schedule_blocks?.start_time ?? "00:00"
    return start < "15:00"
  })

  const afternoon = activeSessions.filter((session) => {
    const start = session.schedule_blocks?.start_time ?? "00:00"
    return start >= "15:00"
  })

  return {
    morning: summarize(morning),
    afternoon: summarize(afternoon),
  }
}

export function AdminMonthlyCalendar({ sessions }: Props) {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const days = useMemo(
    () => getMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  const sessionsByDate = useMemo(() => {
    return sessions.reduce((groups: Record<string, any[]>, session: any) => {
      if (!groups[session.session_date]) groups[session.session_date] = []
      groups[session.session_date].push(session)
      return groups
    }, {})
  }, [sessions])

  const selectedSessions = selectedDate ? sessionsByDate[selectedDate] ?? [] : []

  function changeMonth(offset: number) {
    const next = new Date(currentYear, currentMonth + offset, 1)
    setCurrentMonth(next.getMonth())
    setCurrentYear(next.getFullYear())
    setSelectedDate(null)
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 print:shadow-none print:ring-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
            Calendario
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] capitalize">
            {monthLabel(currentYear, currentMonth)}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => changeMonth(-1)} className="rounded-2xl bg-[#F7F5F2] px-4 py-3 text-sm font-medium transition active:scale-[0.98]">
            Anterior
          </button>

          <button type="button" onClick={() => changeMonth(1)} className="rounded-2xl bg-[#F7F5F2] px-4 py-3 text-sm font-medium transition active:scale-[0.98]">
            Siguiente
          </button>

          <button type="button" onClick={() => window.print()} className="rounded-2xl bg-[#59B9C6] px-4 py-3 text-sm font-semibold !text-white transition hover:bg-[#4ca9b5] active:scale-[0.98]">
            Imprimir
          </button>
        </div>
      </div>

      <h2 className="hidden text-2xl font-semibold capitalize print:block">
        Calendario — {monthLabel(currentYear, currentMonth)}
      </h2>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-[#333333]/45">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const daySessions = date ? sessionsByDate[date] ?? [] : []
          const summary = getPeriodSummary(daySessions)
          const hasMorning = summary.morning.total > 0
          const hasAfternoon = summary.afternoon.total > 0
          const isSelected = selectedDate === date
          const today = new Date().toISOString().split("T")[0]
          const isToday = date === today
          const isMonday = date
            ? new Date(`${date}T12:00:00`).getDay() === 1
            : false

          return (
            <button
              key={date ?? `empty-${index}`}
              type="button"
              disabled={!date}
              onClick={() => date && setSelectedDate(date)}
              className={`min-h-[130px] rounded-2xl p-2 text-left text-xs transition print:min-h-[95px] print:bg-white print:ring-1 print:ring-gray-200 ${
                isSelected
                ? "bg-[#59B9C6]/15 ring-2 ring-[#59B9C6]"
                : isToday
                    ? "bg-white ring-2 ring-[#59B9C6]/60 shadow-md shadow-[#59B9C6]/10"
                    : "bg-[#F7F5F2] hover:bg-[#EFEAE5]"
              } ${!date ? "cursor-default opacity-0" : "active:scale-[0.98]"}`}
            >
              {date && (
                <>
                  <p className={`mb-2 font-semibold ${isToday ? "text-[#2f8f9a]" : "text-[#333333]"}`}>
                    {Number(date.split("-")[2])}
                  </p>

                  {(hasMorning || hasAfternoon) && (
                    <div className={`grid gap-1 ${hasMorning && hasAfternoon ? "grid-rows-2" : "grid-rows-1"}`}>
                      {hasMorning && (
                        <div className="rounded-xl bg-white px-2 py-2 text-[0.66rem] leading-4 text-[#333333]/75">
                          <p className="font-semibold text-[#333333]">
                            Mañana: {summary.morning.total}
                          </p>
                          <p>Torno: {summary.morning.torno}</p>
                          <p>Manual: {summary.morning.manual}</p>
                          {isMonday && <p>Niños: {summary.morning.ninos}</p>}
                        </div>
                      )}

                      {hasAfternoon && (
                        <div className="rounded-xl bg-white px-2 py-2 text-[0.66rem] leading-4 text-[#333333]/75">
                          <p className="font-semibold text-[#333333]">
                            Tarde: {summary.afternoon.total}
                          </p>
                          <p>Torno: {summary.afternoon.torno}</p>
                          <p>Manual: {summary.afternoon.manual}</p>
                          {isMonday && <p>Niños: {summary.afternoon.ninos}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <section className="mt-8 rounded-[2rem] bg-[#F7F5F2] p-5 print:hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
                Detalle del día
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] capitalize">
                {formatDate(selectedDate)}
              </h3>
            </div>

            <p className="text-sm text-[#333333]/60">
              {selectedSessions.length} sesión
              {selectedSessions.length === 1 ? "" : "es"}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {selectedSessions.length === 0 && (
              <div className="rounded-2xl bg-white p-4 text-sm text-[#333333]/65">
                No hay sesiones registradas este día.
              </div>
            )}

            {selectedSessions.map((session: any) => {
              const reservation = getReservation(session)
              const service = getService(session)
              const isCancelled =
                reservation?.status === "cancelled" ||
                session.status === "cancelled"

              return (
                <article key={session.id} className={`rounded-2xl bg-white p-4 shadow-sm ${isCancelled ? "opacity-55" : ""}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
                        {formatTime(session)}
                      </p>

                      <h4 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                        {reservation?.customer_name} {reservation?.customer_last_name}
                      </h4>

                      <p className="mt-1 text-sm text-[#333333]/65">
                        {service?.name ?? "Servicio no disponible"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-[#333333]/70">
                        {session.people_count ?? 0} persona
                        {session.people_count === 1 ? "" : "s"}
                      </span>

                      <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-xs text-[#333333]/70">
                        {reservation?.payment_status === "paid"
                          ? "Pagado"
                          : reservation?.payment_status === "deposit_paid"
                            ? "Anticipo 50%"
                            : "Pendiente"}
                      </span>

                      {isCancelled && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
                          Cancelada
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#F7F5F2] p-3 text-sm leading-6 text-[#333333]/65">
                    <p>Tel: {reservation?.phone || "Sin teléfono"}</p>
                    <p>Correo: {reservation?.email || "Sin correo"}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </section>
  )
}