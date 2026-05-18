"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type PaymentStatus = "pending" | "deposit_paid" | "paid"

type Props = {
  reservationId: string
  initialStatus: PaymentStatus
}

const options: {
  value: PaymentStatus
  label: string
}[] = [
  { value: "pending", label: "Pendiente" },
  { value: "deposit_paid", label: "Anticipo 50%" },
  { value: "paid", label: "Pagado" },
]

export function PaymentToggle({ reservationId, initialStatus }: Props) {
  const [status, setStatus] = useState<PaymentStatus>(
    initialStatus ?? "pending"
  )
  const [isSaving, setIsSaving] = useState(false)

  async function updatePayment(nextStatus: PaymentStatus) {
    if (nextStatus === status) return

    setIsSaving(true)

    const { data, error } = await supabase
      .from("reservations")
      .update({
        payment_status: nextStatus,
      })
      .eq("id", reservationId)
      .select("id, payment_status")
      .single()

    if (error) {
      alert(`No se pudo actualizar el pago: ${error.message}`)
      setIsSaving(false)
      return
    }

    setStatus(data.payment_status as PaymentStatus)
    setIsSaving(false)
  }

  return (
    <div className="rounded-2xl bg-[#F7F5F2] p-2">
      <p className="mb-2 px-2 text-xs uppercase tracking-[0.18em] text-[#333333]/45">
        Estado de pago
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = status === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updatePayment(option.value)}
              disabled={isSaving}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition active:scale-[0.98] disabled:opacity-50 ${
                isSelected
                  ? "border-[#59B9C6] bg-[#59B9C6] text-white"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}