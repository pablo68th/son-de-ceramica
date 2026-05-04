import { supabase } from "../../../lib/supabaseClient"
import BookingCalendar from "../../../components/BookingCalendar"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ServiceReservationPage({ params }: PageProps) {
  const { slug } = await params

  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !service) {
    return (
      <main className="p-6">
        <h1>Servicio no encontrado</h1>
      </main>
    )
  }

  const { data: serviceBlocks } = await supabase
    .from("service_schedule_blocks")
    .select(`
      schedule_blocks (
        id,
        day_of_week,
        label,
        start_time,
        end_time
      )
    `)
    .eq("service_id", service.id)

  const customBlocks =
    serviceBlocks?.flatMap((item: any) => {
      if (!item.schedule_blocks) return []
      if (Array.isArray(item.schedule_blocks)) return item.schedule_blocks
      return [item.schedule_blocks]
    }) || []

  let blocks = customBlocks

  if (blocks.length === 0) {
    const { data: defaultBlocks } = await supabase
      .from("schedule_blocks")
      .select("id, day_of_week, label, start_time, end_time")
      .eq("is_active", true)
      .neq("label", "Niños")
      .order("day_of_week", { ascending: true })

    blocks = defaultBlocks || []
  }

  return (
    <main className="p-6">
      <a href="/reservar" className="text-sm underline mb-4 inline-block">
        Volver a servicios
      </a>

      <section className="mt-6 rounded-xl border p-4">
        <h1 className="text-2xl font-semibold">{service.name}</h1>

        <p className="mt-2 text-gray-600">
          ${service.price_mxn} MXN
        </p>

        <p className="mt-2 text-gray-600">
          Sesiones: {service.sessions_count}
        </p>

        <p className="mt-2 text-gray-600">
          Cupo por horario: {service.capacity}
        </p>
      </section>

      {blocks.length > 0 ? (
        <BookingCalendar service={service} blocks={blocks} />
      ) : (
        <section className="mt-6 rounded-xl border p-4">
          <p>No hay horarios disponibles para este servicio.</p>
        </section>
      )}
    </main>
  )
}
