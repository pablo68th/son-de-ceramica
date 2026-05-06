"use client"

import { useState } from "react"
import { createReservation } from "../lib/reservationService"

type Service = {
  id: string
  name: string
  slug: string
  max_people_per_booking: number
}

type Props = {
  service: Service
  date: string
  blockId: string
  secondDate?: string
  secondBlockId?: string
}

export function ReservationForm({
  service,
  date,
  blockId,
  secondDate,
  secondBlockId,
}: Props) {
  const isCoupleService = service.slug === "torno-en-pareja"

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [peopleCount, setPeopleCount] = useState(isCoupleService ? 2 : 1)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit() {
    setErrorMessage("")
    setSuccessMessage("")

    if (!name || !lastName || !phone || !email) {
      setErrorMessage("Completa todos los campos obligatorios.")
      return
    }

    if (phone.length < 10) {
      setErrorMessage("Ingresa un teléfono válido.")
      return
    }

    try {
      setIsSubmitting(true)

await createReservation({
  serviceId: service.id,
  startDate: date,
  secondDayDate: secondDate,
  blockId,
  secondBlockId,
  peopleCount,
  name,
  lastName,
  phone,
  email,
})

      setSuccessMessage("Tu reserva quedó confirmada.")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo crear la reserva."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

if (successMessage) {
  return (
    <div className="mt-6 rounded-xl border p-4">
      <h2 className="text-xl font-semibold">Reserva confirmada</h2>

      <p className="mt-2 text-gray-600">{successMessage}</p>

      <p className="mt-4 text-sm text-gray-600">
        Te esperamos en Son de Cerámica Studio.
      </p>

      <a
        href="/"
        className="mt-5 inline-block rounded bg-black px-4 py-2 text-white"
      >
        Volver al inicio
      </a>
    </div>
  )
}

  return (
    <div className="mt-6 grid gap-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="border rounded px-3 py-2" />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className="border rounded px-3 py-2" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className="border rounded px-3 py-2" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" className="border rounded px-3 py-2" />

      {!isCoupleService && (
        <select value={peopleCount} onChange={(e) => setPeopleCount(Number(e.target.value))} className="border rounded px-3 py-2">
          <option value={1}>1 persona</option>
          <option value={2}>2 personas</option>
        </select>
      )}

      {isCoupleService && (
        <p className="text-sm text-gray-600">
          Torno en pareja reserva automáticamente 2 lugares.
        </p>
      )}

      {errorMessage && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Confirmando..." : "Confirmar reserva"}
      </button>
    </div>
  )
}

