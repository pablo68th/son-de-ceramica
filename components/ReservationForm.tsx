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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
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
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptPromos, setAcceptPromos] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit() {
    setErrorMessage("")
    setSuccessMessage("")

    const cleanPhone = onlyDigits(phone)

    if (!name.trim() || !lastName.trim() || !cleanPhone || !email.trim()) {
      setErrorMessage("Completa todos los campos obligatorios.")
      return
    }

    if (cleanPhone.length !== 10) {
      setErrorMessage("Ingresa un teléfono válido de 10 dígitos.")
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Ingresa un correo electrónico válido.")
      return
    }

    if (!acceptPrivacy) {
      setErrorMessage("Debes aceptar el aviso de privacidad para reservar.")
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
        name: name.trim(),
        lastName: lastName.trim(),
        phone: cleanPhone,
        email: email.trim().toLowerCase(),
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
      <div className="mt-6 rounded-[2rem] bg-[#F7F5F2] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#59B9C6]/15 text-3xl text-[#59B9C6]">
          ♡
        </div>

        <h2 className="mt-5 text-3xl font-light tracking-[-0.03em]">
          Reserva confirmada
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#333333]/65">
          {successMessage}
        </p>

        <p className="mt-2 text-sm leading-7 text-[#333333]/65">
          Te esperamos en Son de Cerámica Studio.
        </p>

        <a
          href="/"
          className="mt-6 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#4ca9b5]"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6]"
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Apellido"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6]"
      />

      <input
        value={phone}
        onChange={(event) =>
          setPhone(onlyDigits(event.target.value).slice(0, 10))
        }
        placeholder="Teléfono a 10 dígitos"
        inputMode="numeric"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6]"
      />

      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Correo electrónico"
        type="email"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6]"
      />

      {!isCoupleService && (
        <label className="grid gap-2">
          <span className="text-sm text-[#333333]/65">
            Número de personas
          </span>

          <select
            value={peopleCount}
            onChange={(event) => setPeopleCount(Number(event.target.value))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6]"
          >
            <option value={1}>1 persona</option>
            <option value={2}>2 personas</option>
          </select>
        </label>
      )}

      {isCoupleService && (
        <div className="rounded-2xl bg-[#F7F5F2] p-4 text-sm leading-6 text-[#333333]/65">
          Torno en pareja reserva automáticamente 2 lugares.
        </div>
      )}

      <label className="flex gap-3 rounded-2xl bg-[#F7F5F2] p-4 text-sm leading-6 text-[#333333]/70">
        <input
          type="checkbox"
          checked={acceptPrivacy}
          onChange={(event) => setAcceptPrivacy(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#59B9C6]"
        />

        <span>
          Acepto el aviso de privacidad y el uso de mis datos para gestionar mi reserva.
        </span>
      </label>

      <label className="flex gap-3 rounded-2xl bg-[#F7F5F2] p-4 text-sm leading-6 text-[#333333]/70">
        <input
          type="checkbox"
          checked={acceptPromos}
          onChange={(event) => setAcceptPromos(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#59B9C6]"
        />

        <span>
          Acepto recibir promociones, novedades y eventos especiales.
        </span>
      </label>

      {errorMessage && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-2 rounded-2xl bg-[#59B9C6] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#4ca9b5] disabled:opacity-50"
      >
        {isSubmitting ? "Confirmando..." : "Confirmar reserva"}
      </button>
    </div>
  )
}
