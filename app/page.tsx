import { supabase } from "../lib/supabaseClient"
import { getAvailability, validateFullAvailability } from "../lib/availability";
import { generateSessionDates } from "../lib/sessionGenerator"

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

const testFourSessions = generateSessionDates({
  startDate: "2026-05-20",
  sessionsCount: 4,
  weeklyFrequency: 1,
})

const testEightSessions = generateSessionDates({
  startDate: "2026-05-20",
  secondDayDate: "2026-05-22",
  sessionsCount: 8,
  weeklyFrequency: 2,
})

const fullAvailabilityTest =
  firstService && firstBlock
    ? await validateFullAvailability({
        serviceId: firstService.id,
        dates: testFourSessions,
        blockId: firstBlock.id,
        peopleCount: 2,
      })
    : null

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

            <section className="mb-8 rounded-xl border p-4">
        <h2 className="font-bold mb-2">Prueba de generación de sesiones</h2>

        <h3 className="font-semibold">Paquete de 4 sesiones</h3>
        <ul className="mb-4">
          {testFourSessions.map((date) => (
            <li key={date}>{date}</li>
          ))}
        </ul>

        <section className="mb-8 rounded-xl border p-4">
          <h2 className="font-bold mb-2">Prueba de disponibilidad completa</h2>

          <p>
            ¿Todas las sesiones tienen cupo?:{" "}
            {fullAvailabilityTest?.allAvailable ? "Sí" : "No"}
          </p>

          <ul className="mt-4">
            {fullAvailabilityTest?.results.map((result) => (
              <li key={result.date}>
                {result.date} — {result.available ? "Disponible" : "Sin cupo"} —{" "}
                {result.remaining} lugares restantes
              </li>
            ))}
          </ul>
        </section>

        <h3 className="font-semibold">Paquete de 8 sesiones</h3>
        <ul>
          {testEightSessions.map((date) => (
            <li key={date}>{date}</li>
          ))}
        </ul>
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
