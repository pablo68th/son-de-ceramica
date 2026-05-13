"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type PaymentStatus = "pending" | "deposit_paid" | "paid"

type Props = {
  reservationId: string
  initialStatus: PaymentStatus
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    next: "deposit_paid" as PaymentStatus,
    className: "bg-white text-gray-700 border-gray-300",
  },

  deposit_paid: {
    label: "Anticipo 50%",
    next: "paid" as PaymentStatus,
    className: "bg-[#59B9C6] text-white border-[#59B9C6]",
  },

  paid: {
    label: "Pagado",
    next: "pending" as PaymentStatus,
    className: "bg-black text-white border-black",
  },
}

export function PaymentToggle({
  reservationId,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<PaymentStatus>(
    initialStatus ?? "pending"
  )

  const [isSaving, setIsSaving] = useState(false)

  async function togglePayment() {
    const nextStatus = statusConfig[status].next

    setIsSaving(true)

    const { error } = await supabase
      .from("reservations")
      .update({
        payment_status: nextStatus,
      })
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
      className={`rounded-full border px-3 py-1 text-sm transition active:scale-[0.98] disabled:opacity-50 ${
        statusConfig[status].className
      }`}
    >
      {isSaving
        ? "Guardando..."
        : statusConfig[status].label}
    </button>
  )
}