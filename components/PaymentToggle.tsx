"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Props = {
  reservationId: string
  initialStatus: "paid" | "pending"
}

export function PaymentToggle({ reservationId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [isSaving, setIsSaving] = useState(false)
  const isPaid = status === "paid"

  async function togglePayment() {
    const nextStatus = isPaid ? "pending" : "paid"

    setIsSaving(true)

    const { error } = await supabase
      .from("reservations")
      .update({ payment_status: nextStatus })
      .eq("id", reservationId)

    if (!error) {
      setStatus(nextStatus)
    }

    setIsSaving(false)
  }

  return (
    <button
      type="button"
      onClick={togglePayment}
      disabled={isSaving}
      className={`rounded-full px-3 py-1 text-sm border ${
        isPaid
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-300"
      } disabled:opacity-50`}
    >
      {isSaving ? "Guardando..." : isPaid ? "Pagado" : "Pendiente"}
    </button>
  )
}

