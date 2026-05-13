"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Service = {
  id: string
  name: string
  slug: string
  price_mxn: number
  capacity: number
  is_active: boolean
  marketing_title: string | null
  marketing_label: string | null
  marketing_description: string | null
  display_order: number | null
  is_featured: boolean | null
}

type Props = {
  services: Service[]
}

export function AdminServicesList({ services }: Props) {
  const [items, setItems] = useState(services)
  const [savingId, setSavingId] = useState<string | null>(null)

async function updateService(serviceId: string, updates: Partial<Service>) {
  setSavingId(serviceId)

  const { error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", serviceId)

  if (error) {
    console.error("Error actualizando servicio:", error)
    alert(`No se pudo guardar: ${error.message}`)
    setSavingId(null)
    return
  }

  setItems((current) =>
    current.map((item) =>
      item.id === serviceId ? { ...item, ...updates } : item
    )
  )

  setSavingId(null)
}

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm tracking-[0.2em] text-[#59B9C6]">
        SERVICIOS
      </p>

      <h2 className="mt-2 text-2xl font-light">
        Control de servicios
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Activa, oculta y edita cómo aparecen los servicios en la página de reservas.
      </p>

      <div className="mt-6 grid gap-4">
        {items.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl bg-[#F7F5F2] p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-medium">{service.name}</h3>

                <p className="mt-1 text-xs text-gray-500">
                  /{service.slug}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateService(service.id, {
                    is_active: !service.is_active,
                  })
                }
                disabled={savingId === service.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98] disabled:opacity-50 ${
                  service.is_active
                    ? "border-[#59B9C6] bg-[#59B9C6] text-white"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {savingId === service.id
                  ? "Guardando..."
                  : service.is_active
                    ? "Visible"
                    : "Oculto"}
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Título comercial
                </span>

                <input
                  value={service.marketing_title ?? ""}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((item) =>
                        item.id === service.id
                          ? { ...item, marketing_title: event.target.value }
                          : item
                      )
                    )
                  }
                  onBlur={(event) =>
                    updateService(service.id, {
                      marketing_title: event.target.value,
                    })
                  }
                  placeholder="Ej. Tus Primeras Vueltas"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Subtítulo
                </span>

                <input
                  value={service.marketing_label ?? ""}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((item) =>
                        item.id === service.id
                          ? { ...item, marketing_label: event.target.value }
                          : item
                      )
                    )
                  }
                  onBlur={(event) =>
                    updateService(service.id, {
                      marketing_label: event.target.value,
                    })
                  }
                  placeholder="Ej. Clases de torno · 4 sesiones"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Descripción
                </span>

                <textarea
                  value={service.marketing_description ?? ""}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((item) =>
                        item.id === service.id
                          ? {
                              ...item,
                              marketing_description: event.target.value,
                            }
                          : item
                      )
                    )
                  }
                  onBlur={(event) =>
                    updateService(service.id, {
                      marketing_description: event.target.value,
                    })
                  }
                  placeholder="Descripción visible en la página de reservas"
                  rows={3}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Precio
                  </span>

                  <input
                    type="number"
                    value={service.price_mxn}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((item) =>
                          item.id === service.id
                            ? {
                                ...item,
                                price_mxn: Number(event.target.value),
                              }
                            : item
                        )
                      )
                    }
                    onBlur={(event) =>
                      updateService(service.id, {
                        price_mxn: Number(event.target.value),
                      })
                    }
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Cupo
                  </span>

                  <input
                    type="number"
                    value={service.capacity}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((item) =>
                          item.id === service.id
                            ? {
                                ...item,
                                capacity: Number(event.target.value),
                              }
                            : item
                        )
                      )
                    }
                    onBlur={(event) =>
                      updateService(service.id, {
                        capacity: Number(event.target.value),
                      })
                    }
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Orden
                  </span>

                  <input
                    type="number"
                    value={service.display_order ?? 0}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((item) =>
                          item.id === service.id
                            ? {
                                ...item,
                                display_order: Number(event.target.value),
                              }
                            : item
                        )
                      )
                    }
                    onBlur={(event) =>
                      updateService(service.id, {
                        display_order: Number(event.target.value),
                      })
                    }
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#59B9C6]"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(service.is_featured)}
                  onChange={(event) =>
                    updateService(service.id, {
                      is_featured: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#59B9C6]"
                />

                Mostrar como servicio destacado
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

