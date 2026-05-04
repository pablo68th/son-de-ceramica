"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function BookingCalendar({ service, blocks }: Props) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const router = useRouter()
  const allowedDays = useMemo(() => {
    return Array.from(new Set(blocks.map((block) => block.day_of_week)))
  }, [blocks])

  const selectedDayOfWeek = selectedDate ? getDayOfWeek(selectedDate) : null

  const blocksForSelectedDate =
    selectedDayOfWeek === null
      ? []
      : blocks.filter((block) => block.day_of_week === selectedDayOfWeek)

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId)

  const isSelectedDateAllowed =
    selectedDayOfWeek !== null && allowedDays.includes(selectedDayOfWeek)

  return (
    <section className="mt-6 rounded-xl border p-4">
      <h2 className="text-lg font-semibold mb-4">Elige una fecha</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Fecha
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value)
              setSelectedBlockId(null)
            }}
            className="w-full rounded-lg border px-3 py-2"
          />

          <p className="mt-3 text-sm text-gray-500">
            Días disponibles:{" "}
            {allowedDays.map((day) => daysMap[day]).join(", ")}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          {!selectedDate && (
            <p className="text-sm text-gray-600">
              Selecciona una fecha para ver los horarios disponibles.
            </p>
          )}

          {selectedDate && !isSelectedDateAllowed && (
            <p className="text-sm text-gray-600">
              Ese día no está disponible para esta experiencia. Elige otro día.
            </p>
          )}

          {selectedDate && isSelectedDateAllowed && (
            <>
              <h3 className="font-medium">
                {formatDateForDisplay(selectedDate)}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Horarios disponibles:
              </p>

              <div className="mt-4 grid gap-3">
                {blocksForSelectedDate.map((block) => {
                  const isSelected = selectedBlockId === block.id

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <p className="font-medium">
                        {block.start_time} – {block.end_time}
                      </p>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {selectedBlock && selectedDate && (
            <div className="mt-5 rounded-lg border bg-white p-3">
              <p className="text-sm font-medium">Resumen</p>

              <p className="mt-2 text-sm text-gray-600">
                {service.name}
              </p>

              <p className="text-sm text-gray-600">
                {formatDateForDisplay(selectedDate)}
              </p>

              <p className="text-sm text-gray-600">
                {selectedBlock.start_time} – {selectedBlock.end_time}
              </p>

            <button
            type="button"
            onClick={() => {
                if (!selectedDate || !selectedBlockId) return

                router.push(
                `/reservar/${service.slug}/datos?date=${selectedDate}&blockId=${selectedBlockId}`
                )
            }}
            className="mt-4 w-full rounded bg-black px-4 py-2 text-white"
            >
            Continuar
            </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
