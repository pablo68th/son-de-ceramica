import { supabase } from "../../../../lib/supabaseClient"
import { ReservationForm } from "../../../../components/ReservationForm"

type PageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    date?: string
    blockId?: string
  }>
}

export default async function DatosPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params
  const { date, blockId } = await searchParams

  if (!date || !blockId) {
    return (
      <main className="p-6">
        <h1>Error: falta información de la reserva</h1>
      </main>
    )
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single()

  const { data: block, error: blockError } = await supabase
    .from("schedule_blocks")
    .select("*")
    .eq("id", blockId)
    .single()

  if (serviceError || blockError || !service || !block) {
    return (
      <main className="p-6">
        <h1>Error cargando la información de la reserva</h1>
      </main>
    )
  }

  return (
    <main className="p-6">
      <a href={`/reservar/${slug}`} className="text-sm underline">
        Volver
      </a>

      <section className="mt-6 rounded-xl border p-4">
        <h1 className="text-xl font-semibold">Completa tu reserva</h1>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <p>{service.name}</p>
          <p>Fecha: {date}</p>
          <p>
            Horario: {block.start_time} – {block.end_time}
          </p>
        </div>

        <ReservationForm service={service} date={date} blockId={blockId} />
      </section>
    </main>
  )
}
