"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { generateSessionPlan } from "../lib/sessionGenerator"
import {
  getAvailability,
  validateSessionPlanAvailability,
} from "../lib/availability"

type Service = {
  id: string
  name: string
  slug: string
  capacity: number
  sessions_count: number
  weekly_frequency: number
  max_people_per_booking: number
}

type Block = {
  id: string
  day_of_week: number
  label: string
  start_time: string
  end_time: string
}

type AvailabilityInfo = {
  remaining: number
  message: string
}

type Props = {
  service: Service
  blocks: Block[]
}

const daysMap: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
}

function getDayOfWeek(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`)
  return date.getDay()
}

function formatDateForDisplay(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`)
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0]
}

function getTodayDate() {
  return toDateInputValue(new Date())
}

function getMaxBookingDate() {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return toDateInputValue(date)
}

function AvailabilityCard({
  title,
  info,
}: {
  title: string
  info: AvailabilityInfo
}) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
        {title}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            info.remaining <= 0
              ? "bg-red-500"
              : info.remaining <= 2
                ? "bg-yellow-500"
                : "bg-[#59B9C6]"
          }`}
        />

        <p className="text-lg font-semibold text-[#333333]">
          {info.remaining <= 0
            ? "Horario lleno"
            : info.remaining <= 2
              ? `Últimos ${info.remaining} lugares`
              : `${info.remaining} lugares disponibles`}
        </p>
      </div>

      <p className="mt-1 text-xs text-[#333333]/55">
        Disponible para ese día y horario.
      </p>
    </div>
  )
}

export default function BookingCalendar({ service, blocks }: Props) {
  const router = useRouter()

  const needsSecondDay = service.weekly_frequency === 2
  const peopleCount = service.slug === "torno-en-pareja" ? 2 : 1

  const [firstDate, setFirstDate] = useState("")
  const [firstBlockId, setFirstBlockId] = useState<string | null>(null)

  const [secondDate, setSecondDate] = useState("")
  const [secondBlockId, setSecondBlockId] = useState<string | null>(null)

  const [availabilityError, setAvailabilityError] = useState("")
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  const [firstAvailabilityInfo, setFirstAvailabilityInfo] =
    useState<AvailabilityInfo | null>(null)

  const [secondAvailabilityInfo, setSecondAvailabilityInfo] =
    useState<AvailabilityInfo | null>(null)

  const today = getTodayDate()
  const maxBookingDate = getMaxBookingDate()

  const allowedDays = useMemo(() => {
    return Array.from(new Set(blocks.map((b) => b.day_of_week)))
  }, [blocks])

  const firstDayOfWeek = firstDate ? getDayOfWeek(firstDate) : null
  const secondDayOfWeek = secondDate ? getDayOfWeek(secondDate) : null

  const isFirstDateAllowed =
    Boolean(firstDate) &&
    firstDate >= today &&
    firstDate <= maxBookingDate &&
    firstDayOfWeek !== null &&
    allowedDays.includes(firstDayOfWeek)

  const isSecondDateAllowed =
    !needsSecondDay ||
    (Boolean(secondDate) &&
      secondDate >= today &&
      secondDate <= maxBookingDate &&
      secondDayOfWeek !== null &&
      allowedDays.includes(secondDayOfWeek) &&
      secondDayOfWeek !== firstDayOfWeek)

  const firstBlocks =
    firstDayOfWeek === null
      ? []
      : blocks.filter((b) => b.day_of_week === firstDayOfWeek)

  const secondBlocks =
    secondDayOfWeek === null
      ? []
      : blocks.filter((b) => b.day_of_week === secondDayOfWeek)

  const firstBlock = blocks.find((b) => b.id === firstBlockId)
  const secondBlock = blocks.find((b) => b.id === secondBlockId)

  const hasFirstAvailability =
    Boolean(firstAvailabilityInfo) &&
    (firstAvailabilityInfo?.remaining ?? 0) >= peopleCount

  const hasSecondAvailability =
    !needsSecondDay ||
    (Boolean(secondAvailabilityInfo) &&
      (secondAvailabilityInfo?.remaining ?? 0) >= peopleCount)

  const hasEnoughAvailability =
    hasFirstAvailability && hasSecondAvailability

  const canGeneratePlan =
    Boolean(firstDate) &&
    Boolean(firstBlock) &&
    isFirstDateAllowed &&
    (!needsSecondDay ||
      (Boolean(secondDate) &&
        Boolean(secondBlock) &&
        isSecondDateAllowed))

  let sessionPlan: { date: string; blockId: string }[] = []

  try {
    if (canGeneratePlan && firstBlockId) {
      sessionPlan = generateSessionPlan({
        startDate: firstDate,
        firstBlockId,
        secondDayDate: needsSecondDay ? secondDate : undefined,
        secondBlockId: needsSecondDay ? secondBlockId ?? undefined : undefined,
        sessionsCount: service.sessions_count,
        weeklyFrequency: service.weekly_frequency,
      })
    }
  } catch {
    sessionPlan = []
  }

  function getBlockLabel(blockId: string) {
    const block = blocks.find((b) => b.id === blockId)

    if (!block) return ""

    return `${block.start_time} – ${block.end_time}`
  }

  async function checkFirstAvailability(blockId: string) {
    setFirstBlockId(blockId)
    setAvailabilityError("")
    setFirstAvailabilityInfo(null)
    setSecondDate("")
    setSecondBlockId(null)
    setSecondAvailabilityInfo(null)
    setIsCheckingAvailability(true)

    try {
      const availability = await getAvailability(
        service.id,
        firstDate,
        blockId
      )

      setFirstAvailabilityInfo({
        remaining: availability.remaining,
        message: availability.message,
      })
    } catch {
      setAvailabilityError("No se pudo consultar la disponibilidad.")
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  async function checkSecondAvailability(blockId: string) {
    setSecondBlockId(blockId)
    setAvailabilityError("")
    setSecondAvailabilityInfo(null)
    setIsCheckingAvailability(true)

    try {
      const availability = await getAvailability(
        service.id,
        secondDate,
        blockId
      )

      setSecondAvailabilityInfo({
        remaining: availability.remaining,
        message: availability.message,
      })
    } catch {
      setAvailabilityError("No se pudo consultar la disponibilidad.")
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  return (
    <section className="animate-soft-enter mt-6 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-2 text-xl font-semibold tracking-[-0.03em]">
        Elige tu horario
      </h2>

      <p className="mb-5 text-sm leading-6 text-[#333333]/65">
        Selecciona los días y horarios disponibles para tu experiencia.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <label className="mb-2 block text-sm text-gray-600">
            Primer día
          </label>

          <input
            type="date"
            value={firstDate}
            min={today}
            max={maxBookingDate}
            onChange={(e) => {
              setFirstDate(e.target.value)
              setFirstBlockId(null)
              setSecondDate("")
              setSecondBlockId(null)
              setAvailabilityError("")
              setFirstAvailabilityInfo(null)
              setSecondAvailabilityInfo(null)
              setIsCheckingAvailability(false)
            }}
            className="w-full min-w-0 appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-[#1F1F1F]"
          />

          <p className="mt-2 text-xs text-gray-500">
            Días disponibles: {allowedDays.map((d) => daysMap[d]).join(", ")}
          </p>

          {firstDate && !isFirstDateAllowed && (
            <p className="mt-3 text-sm text-gray-600">
              Ese día no está disponible para esta experiencia.
            </p>
          )}

          {firstDate && isFirstDateAllowed && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-600">
                Horario del primer día
              </p>

              <div className="grid gap-3">
                {firstBlocks.map((block) => {
                  const isSelected = firstBlockId === block.id

                  return (
                    <button
                      key={block.id}
                      disabled={isCheckingAvailability}
                      type="button"
                      onClick={() => checkFirstAvailability(block.id)}
                      className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                        isSelected
                          ? "border-[#59B9C6] bg-[#59B9C6] text-white"
                          : "border-gray-200 bg-white text-[#333333]"
                      }`}
                    >
                      {block.start_time} – {block.end_time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {needsSecondDay && (
            <div className="mt-6">
              <label className="mb-2 block text-sm text-gray-600">
                Segundo día
              </label>

              <input
                type="date"
                value={secondDate}
                min={today}
                max={maxBookingDate}
                disabled={!firstBlockId}
                onChange={(e) => {
                  setSecondDate(e.target.value)
                  setSecondBlockId(null)
                  setSecondAvailabilityInfo(null)
                  setAvailabilityError("")
                }}
                className="w-full min-w-0 appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-[#1F1F1F] disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-gray-500">
                Debe ser un día de la semana distinto al primero.
              </p>

              {secondDate && !isSecondDateAllowed && (
                <p className="mt-3 text-sm text-gray-600">
                  Ese segundo día no es válido. Elige otro día disponible y distinto.
                </p>
              )}

              {secondDate && isSecondDateAllowed && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-600">
                    Horario del segundo día
                  </p>

                  <div className="grid gap-3">
                    {secondBlocks.map((block) => {
                      const isSelected = secondBlockId === block.id

                      return (
                        <button
                          key={block.id}
                          type="button"
                          disabled={isCheckingAvailability}
                          onClick={() => checkSecondAvailability(block.id)}
                          className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                            isSelected
                              ? "border-[#59B9C6] bg-[#59B9C6] text-white"
                              : "border-gray-200 bg-white text-[#333333]"
                          }`}
                        >
                          {block.start_time} – {block.end_time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-2xl bg-[#F7F5F2] p-4">
          {!firstDate && (
            <p className="text-sm text-gray-600">
              Selecciona un día para consultar disponibilidad y horarios.
            </p>
          )}

          {firstDate && (
            <div>
              <p className="font-medium">Resumen</p>

              <p className="mt-2 text-sm text-gray-600">{service.name}</p>

              {firstDate && firstBlock && (
                <p className="text-sm text-gray-600">
                  Primer día: {formatDateForDisplay(firstDate)} ·{" "}
                  {firstBlock.start_time} – {firstBlock.end_time}
                </p>
              )}

              {firstDate && firstBlock && firstAvailabilityInfo && (
                <div className="mt-3">
                  <AvailabilityCard
                    title="Cupo primer día"
                    info={firstAvailabilityInfo}
                  />
                </div>
              )}

              {needsSecondDay && secondDate && secondBlock && (
                <p className="mt-3 text-sm text-gray-600">
                  Segundo día: {formatDateForDisplay(secondDate)} ·{" "}
                  {secondBlock.start_time} – {secondBlock.end_time}
                </p>
              )}

              {needsSecondDay && secondDate && secondBlock && secondAvailabilityInfo && (
                <div className="mt-3">
                  <AvailabilityCard
                    title="Cupo segundo día"
                    info={secondAvailabilityInfo}
                  />
                </div>
              )}

              {!hasEnoughAvailability &&
                firstAvailabilityInfo &&
                (!needsSecondDay || secondAvailabilityInfo) && (
                  <p className="mt-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                    No hay cupo suficiente para uno o más horarios.
                  </p>
                )}

              {sessionPlan.length > 0 && (
                <>
                  <p className="mt-4 text-sm text-gray-600">
                    Sesiones incluidas:
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {sessionPlan.map((session, index) => (
                      <li key={`${session.date}-${session.blockId}-${index}`}>
                        • {formatDateForDisplay(session.date)} —{" "}
                        {getBlockLabel(session.blockId)}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {availabilityError && (
                <p className="mt-3 text-sm text-red-600">
                  {availabilityError}
                </p>
              )}

              {canGeneratePlan && (
                <button
                  type="button"
                  disabled={isCheckingAvailability || !hasEnoughAvailability}
                  onClick={async () => {
                    if (!firstBlockId) return

                    setAvailabilityError("")

                    const result = await validateSessionPlanAvailability({
                      serviceId: service.id,
                      sessions: sessionPlan,
                      peopleCount,
                    })

                    if (!result.allAvailable) {
                      setAvailabilityError(
                        "No hay cupo suficiente para una o más sesiones."
                      )
                      return
                    }

                    const secondParams =
                      needsSecondDay && secondDate && secondBlockId
                        ? `&secondDate=${secondDate}&secondBlockId=${secondBlockId}`
                        : ""

                    router.push(
                      `/reservar/${service.slug}/datos?date=${firstDate}&blockId=${firstBlockId}${secondParams}`
                    )
                  }}
                  className="mt-4 w-full rounded-2xl bg-[#59B9C6] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#4ca9b5] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  {isCheckingAvailability
                    ? "Consultando disponibilidad..."
                    : "Continuar"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

