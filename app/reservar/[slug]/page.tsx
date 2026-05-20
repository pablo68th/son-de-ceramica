import Link from "next/link"
import { supabase } from "../../../lib/supabaseClient"
import BookingCalendar from "../../../components/BookingCalendar"

export const dynamic = "force-dynamic"
export const revalidate = 0

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function getPresentation(service: any) {
  return {
    title: service.marketing_title ?? service.name,
    label: service.marketing_label ?? "Experiencia de cerámica",
    description:
      service.marketing_description ??
      "Elige fecha y horario para enviar tu solicitud de reservación.",
    isSpecialQuote: service.slug === "celebraciones-especiales",
  }
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
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#333333]">
        <section className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-normal">Servicio no encontrado</h1>

          <Link
            href="/reservar"
            className="mt-5 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-center text-sm font-semibold !text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
          >
            Volver a experiencias
          </Link>
        </section>
      </main>
    )
  }

  const presentation = getPresentation(service)

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
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-6 text-[#333333]">
      <section className="animate-soft-enter mx-auto max-w-md">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/reservar"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[0.98]"
          >
            Volver
          </Link>

          <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
            Reservación
          </p>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="relative min-h-64 bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/50 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.38),transparent_32%)]" />

            <div className="relative flex min-h-52 flex-col justify-end">
              <p className="inline-flex w-fit rounded-full bg-white/75 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#333333]/80 backdrop-blur">
                {presentation.label}
              </p>

              <h1 className="mt-3 text-4xl font-semibold leading-none tracking-[-0.06em]">
                {presentation.title}
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#333333]/70">
                {presentation.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-5">
            <div className="rounded-2xl bg-[#F7F5F2] p-4 text-center">
              <p className="text-base font-medium leading-tight">
                {presentation.isSpecialQuote
                  ? "Cotización personalizada"
                  : `$${service.price_mxn} MXN`}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#333333]/55">
                Costo
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F5F2] p-4 text-center">
              <p className="text-lg font-medium">
                {service.sessions_count}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#333333]/55">
                sesiones
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F5F2] p-4 text-center">
              <p className="text-lg font-medium">
                {service.capacity}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#333333]/55">
                cupo máx.
              </p>
            </div>
          </div>

          <div className="border-t border-[#333333]/10 p-5">
            <div className="rounded-2xl bg-[#F7F5F2] p-4 text-sm leading-6 text-[#333333]/70">
              Enviar tu solicitud no aparta el cupo todavía. Para confirmar tu lugar, deberás cubrir al menos el 50% de anticipo. El resto se liquida antes de iniciar la sesión.
            </div>
          </div>
        </section>

        {blocks.length > 0 ? (
          <BookingCalendar service={service} blocks={blocks} />
        ) : (
          <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#333333]/65">
              No hay horarios disponibles para esta experiencia.
            </p>
          </section>
        )}
      </section>
    </main>
  )
}

