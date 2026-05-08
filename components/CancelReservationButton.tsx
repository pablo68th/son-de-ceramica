"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Props = {
  reservationId: string
}

export function CancelReservationButton({ reservationId }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  async function cancelReservation() {
    const confirmed = window.confirm("¿Seguro que quieres cancelar esta reserva?")

    if (!confirmed) return

    setIsSaving(true)

    const { error: reservationError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservationId)

    const { error: sessionsError } = await supabase
      .from("reservation_sessions")
      .update({ status: "cancelled" })
      .eq("reservation_id", reservationId)

    if (!reservationError && !sessionsError) {
      setIsCancelled(true)
    }

    setIsSaving(false)
  }

  if (isCancelled) {
    return (
      <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">
        Cancelada
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={cancelReservation}
      disabled={isSaving}
      className="rounded-full border border-red-200 bg-white px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {isSaving ? "Cancelando..." : "Cancelar"}
    </button>
  )
}
