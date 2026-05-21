"use client"

import { useState } from "react"
import { PageTransitionOverlay } from "./PageTransitionOverlay"
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

  const [step, setStep] = useState<"form" | "review">("form")

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [peopleCount, setPeopleCount] = useState(isCoupleService ? 2 : 1)

  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptPromos, setAcceptPromos] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function validateForm() {
    const cleanPhone = onlyDigits(phone)

    if (!name.trim() || !lastName.trim() || !cleanPhone) {
      setErrorMessage("Completa nombre, apellido y teléfono.")
      return false
    }

    if (cleanPhone.length !== 10) {
      setErrorMessage("Ingresa un teléfono válido de 10 dígitos.")
      return false
    }

    if (email.trim() && !isValidEmail(email)) {
      setErrorMessage("Ingresa un correo electrónico válido.")
      return false
    }

    if (!acceptPrivacy) {
      setErrorMessage("Debes aceptar el aviso de privacidad para reservar.")
      return false
    }

    return true
  }

  async function handleSubmit() {
    setErrorMessage("")

    const cleanPhone = onlyDigits(phone)

    try {
      setIsSubmitting(true)
      setIsTransitioning(true)

    await createReservation({
      serviceId: service.id,
      startDate: date,
      blockId,
      secondDayDate: secondDate,
      secondBlockId,
      peopleCount,
      name: name.trim(),
      lastName: lastName.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
    })

setSuccessMessage(
  "Recibimos tu solicitud. Tu lugar se aparta cuando se registre un anticipo mínimo del 50%. El resto se liquida antes de iniciar la sesión."
)
    } catch (error) {
      setIsTransitioning(false)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo crear la reserva."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isTransitioning && !successMessage) {
    return (
      <PageTransitionOverlay message="Enviando tu solicitud..." />
    )
  }

  if (successMessage) {
    return (
      <div className="mt-6 rounded-[2rem] bg-[#F7F5F2] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#59B9C6]/15 text-3xl text-[#59B9C6]">
          ✦
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-[#59B9C6]">
          Solicitud recibida
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
          Pre-reserva enviada
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#333333]/65">
          {successMessage}
        </p>

        <p className="mt-2 text-sm leading-7 text-[#333333]/65">
          Te esperamos en Son de Cerámica Studio.
        </p>

        <a
          href="/"
          className="mt-6 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  if (step === "review") {
    return (
      <div className="mt-6 rounded-[2rem] bg-[#F7F5F2] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#59B9C6]">
            Revisión final
          </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
          Revisa tu información
        </h2>

        <div className="mt-8 space-y-5 rounded-2xl bg-white p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
              Nombre
            </p>

            <p className="mt-1 text-base font-medium">
              {name} {lastName}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
              Teléfono
            </p>

            <p className="mt-1 text-base font-medium">
              {phone}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
              Correo electrónico 
            </p>

            <p className="mt-1 text-base font-medium">
              {email}
            </p>
          </div>

          {!isCoupleService && (
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
                Personas
              </p>

              <p className="mt-1 text-base font-medium">
                {peopleCount}
              </p>
            </div>
          )}
        </div>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
              Experiencia
            </p>

            <p className="mt-1 text-base font-medium">
              {service.name}
            </p>
          </div>

        {errorMessage && (
          <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-5 w-full rounded-2xl bg-[#59B9C6] px-5 py-4 text-base font-semibold text-white transition active:scale-[0.98] hover:bg-[#4ca9b5] disabled:opacity-50"
        >
          {isSubmitting
            ? "Enviando solicitud..."
            : "Enviar solicitud"}
        </button>

        <button
          type="button"
          onClick={() => setStep("form")}
          className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base font-medium text-[#333333] transition active:scale-[0.98]"
        >
          Editar información
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6] focus:ring-2 focus:ring-[#59B9C6]/10"
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Apellido"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6] focus:ring-2 focus:ring-[#59B9C6]/10"
      />

      <input
        value={phone}
        onChange={(event) =>
          setPhone(onlyDigits(event.target.value).slice(0, 10))
        }
        placeholder="Teléfono a 10 dígitos"
        inputMode="numeric"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6] focus:ring-2 focus:ring-[#59B9C6]/10"
      />

      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Correo electrónico (opcional)"
        type="email"
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6] focus:ring-2 focus:ring-[#59B9C6]/10"
      />

      {!isCoupleService && (
        <label className="grid gap-2">
          <span className="text-sm text-[#333333]/65">
            Número de personas
          </span>

          <select
            value={peopleCount}
            onChange={(event) => setPeopleCount(Number(event.target.value))}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#59B9C6] focus:ring-2 focus:ring-[#59B9C6]/10"
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
          Acepto el aviso de privacidad y el uso de mis datos para gestionar mi solicitud de reservación.
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

      <div className="rounded-2xl bg-[#F7F5F2] p-4 text-sm leading-6 text-[#333333]/70">
        Tu solicitud no aparta el cupo todavía. Para confirmar tu lugar, deberás cubrir al menos el 50% de anticipo. El resto se liquida antes de iniciar la sesión.
      </div>

      <button
        type="button"
        onClick={() => {
          setErrorMessage("")

          if (!validateForm()) return

          setStep("review")
        }}
        className="mt-2 rounded-2xl bg-[#59B9C6] px-5 py-4 text-base font-semibold text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
      >
        Revisar solicitud
      </button>
    </div>
  )
}
