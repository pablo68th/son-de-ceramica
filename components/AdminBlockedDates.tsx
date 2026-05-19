"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Block = {
  id: string
  start_time: string
  end_time: string
}

type BlockedDate = {
  id: string
  date: string
  block_id: string | null
  reason: string | null
  created_at: string
  schedule_blocks?: {
    start_time: string
    end_time: string
  } | null
}

type Props = {
  blocks: Block[]
  initialBlockedDates: BlockedDate[]
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatBlock(blockedDate: BlockedDate) {
  if (!blockedDate.block_id) return "Todo el día"

  if (!blockedDate.schedule_blocks) return "Horario específico"

  return `${blockedDate.schedule_blocks.start_time.slice(0, 5)} – ${blockedDate.schedule_blocks.end_time.slice(0, 5)}`
}

export function AdminBlockedDates({
  blocks,
  initialBlockedDates,
}: Props) {
  const [date, setDate] = useState("")
  const [blockId, setBlockId] = useState("")
  const [reason, setReason] = useState("")
  const [items, setItems] = useState(initialBlockedDates)
  const [isSaving, setIsSaving] = useState(false)

  async function createBlockedDate() {
    if (!date) {
      alert("Selecciona una fecha")
      return
    }

    setIsSaving(true)

    const { data, error } = await supabase
      .from("blocked_schedule_dates")
      .insert({
        date,
        block_id: blockId || null,
        reason: reason || null,
      })
      .select(`
        id,
        date,
        block_id,
        reason,
        created_at,
        schedule_blocks (
          start_time,
          end_time
        )
      `)
      .single()

    if (error) {
      alert(error.message)
      setIsSaving(false)
      return
    }

    setItems((current) => [...current, {
      ...data,
      schedule_blocks: data.schedule_blocks?.[0] || null
    } as BlockedDate].sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    ))

    setDate("")
    setBlockId("")
    setReason("")
    setIsSaving(false)
  }

  async function updateReason(id: string, nextReason: string) {
    const { error } = await supabase
      .from("blocked_schedule_dates")
      .update({
        reason: nextReason || null,
      })
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, reason: nextReason || null } : item
      )
    )
  }

  async function deleteBlockedDate(id: string) {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este bloqueo?"
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("blocked_schedule_dates")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
        BLOQUEOS
      </p>

      <h2 className="mt-2 text-2xl font-light">
        Bloquear fechas y horarios
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Evita nuevas reservaciones para fechas específicas o ciertos horarios.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Fecha
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Horario opcional
          </label>

          <select
            value={blockId}
            onChange={(e) => setBlockId(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
          >
            <option value="">Todo el día</option>

            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.start_time.slice(0, 5)} – {block.end_time.slice(0, 5)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Motivo opcional
          </label>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej. Evento privado"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={createBlockedDate}
        disabled={isSaving}
        className="mt-5 rounded-2xl bg-[#59B9C6] px-5 py-3 text-sm font-semibold !text-white transition active:scale-[0.98] disabled:opacity-50"
      >
        {isSaving ? "Guardando..." : "Bloquear fecha"}
      </button>

      <div className="mt-10 border-t border-gray-100 pt-6">
        <h3 className="text-xl font-light">
          Fechas bloqueadas
        </h3>

        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#F7F5F2] p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium">
                    {formatDate(item.date)}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {formatBlock(item)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteBlockedDate(item.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition active:scale-[0.98]"
                >
                  Eliminar
                </button>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-gray-500">
                  Motivo
                </span>

                <input
                  type="text"
                  defaultValue={item.reason ?? ""}
                  onBlur={(e) => updateReason(item.id, e.target.value)}
                  placeholder="Sin motivo"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />
              </label>
            </article>
          ))}

          {items.length === 0 && (
            <div className="rounded-2xl bg-[#F7F5F2] p-4 text-sm text-gray-600">
              No hay fechas bloqueadas todavía.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
