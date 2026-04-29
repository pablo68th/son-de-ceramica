import { supabase } from "../lib/supabaseClient"
import { getAvailability } from "../lib/availability"

export default async function Home() {
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true })

  const { data: blocks, error: blocksError } = await supabase
    .from("schedule_blocks")
    .select("*")
    .order("day_of_week", { ascending: true })

  if (servicesError || blocksError) {
    return (
      <main className="p-8">
        <h1>Error conectando a Supabase</h1>
        <pre>{servicesError?.message || blocksError?.message}</pre>
      </main>
    )
  }

  const firstService = services?.[0]
  const firstBlock = blocks?.find(
    (block) => block.day_of_week === 3 && block.label === "Mañana"
  )

  const availability =
    firstService && firstBlock
      ? await getAvailability(firstService.id, "2026-05-20", firstBlock.id)
      : null

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Son de Cerámica Studio</h1>

      <section className="mb-8 rounded-xl border p-4">
        <h2 className="font-bold mb-2">Prueba de disponibilidad</h2>

        <p>Servicio: {firstService?.name}</p>
        <p>Bloque: {firstBlock?.label}</p>
        <p>Fecha de prueba: 2026-05-20</p>

        <hr className="my-4" />

        <p>Disponible: {availability?.available ? "Sí" : "No"}</p>
        <p>Lugares restantes: {availability?.remaining}</p>
        <p>Mensaje: {availability?.message}</p>
      </section>

      <section>
        <h2 className="font-bold mb-2">Servicios cargados</h2>

        <div className="grid gap-4">
          {services?.map((service) => (
            <div key={service.id} className="rounded-xl border p-4">
              <h3>{service.name}</h3>
              <p>${service.price_mxn} MXN</p>
              <p>Cupo: {service.capacity}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
