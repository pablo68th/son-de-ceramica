import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"

export default async function ReservarPage() {
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) {
    return (
      <main className="p-6">
        <h1>Error cargando servicios</h1>
        <p>{error.message}</p>
      </main>
    )
  }

  return (
    <main className="p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Elige tu experiencia</h1>

        <Link href="/" className="text-sm underline">
            Inicio
        </Link>
        </div>

      <div className="grid gap-4">
        {services?.map((service) => (
          <div key={service.id} className="border rounded-xl p-4">
            <h2 className="text-lg font-semibold">{service.name}</h2>

            <p className="text-sm text-gray-600">
              ${service.price_mxn} MXN
            </p>

            <Link
              href={`/reservar/${service.slug}`}
              className="mt-4 inline-block border px-4 py-2 rounded"
            >
              Seleccionar
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
