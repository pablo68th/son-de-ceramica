"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Status = "confirmed" | "cancelled"

type Props = {
  reservationId: string
  initialStatus: Status
}

export function ReservationStatusToggle({
  reservationId,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<Status>(initialStatus ?? "confirmed")
  const [isSaving, setIsSaving] = useState(false)

  const isCancelled = status === "cancelled"

  async function toggleStatus() {
    const confirmMessage = isCancelled
      ? "¿Seguro que quieres reactivar esta reservación?"
      : "¿Seguro que quieres cancelar esta reservación?"

    const confirmed = window.confirm(confirmMessage)

    if (!confirmed) return

    const nextStatus = isCancelled ? "confirmed" : "cancelled"

    setIsSaving(true)

    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .update({ status: nextStatus })
      .eq("id", reservationId)
      .select("id, status")
      .single()

    if (reservationError || !reservation) {
      alert(
        `No se pudo actualizar la reservación: ${
          reservationError?.message ?? "No se actualizó ninguna fila"
        }`
      )
      setIsSaving(false)
      return
    }

    const { error: sessionsError } = await supabase
      .from("reservation_sessions")
      .update({ status: nextStatus })
      .eq("reservation_id", reservationId)

    if (sessionsError) {
      alert(`La reservación cambió, pero las sesiones no: ${sessionsError.message}`)
      setIsSaving(false)
      return
    }

    setStatus(nextStatus)
    setIsSaving(false)
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={isSaving}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98] disabled:opacity-50 ${
        isCancelled
          ? "border-[#59B9C6] bg-[#59B9C6] !text-white hover:bg-[#4ca9b5]"
          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      }`}
    >
      {isSaving
        ? "Guardando..."
        : isCancelled
          ? "Reactivar"
          : "Cancelar"}
    </button>
  )
}