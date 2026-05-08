import Link from "next/link"
import { supabase } from "../../../../lib/supabaseClient"
import { ReservationForm } from "../../../../components/ReservationForm"

type PageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    date?: string
    blockId?: string
    secondDate?: string
    secondBlockId?: string
  }>
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`)

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export default async function DatosPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params
  const { date, blockId, secondDate, secondBlockId } = await searchParams

  if (!date || !blockId) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#333333]">
        <section className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">
            Falta información de la reserva
          </h1>

          <Link
            href={`/reservar/${slug}`}
            className="mt-5 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-center text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
          >
            Volver a elegir horario
          </Link>
        </section>
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

  const { data: secondBlock } =
    secondBlockId
      ? await supabase
          .from("schedule_blocks")
          .select("*")
          .eq("id", secondBlockId)
          .single()
      : { data: null }

  if (serviceError || blockError || !service || !block) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#333333]">
        <section className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">
            Error cargando la información de la reserva
          </h1>

          <Link
            href="/reservar"
            className="mt-5 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-center text-sm font-semibold text-white"
          >
            Volver a experiencias
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-6 text-[#333333]">
      <section className="mx-auto max-w-md">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href={`/reservar/${slug}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[0.98]"
          >
            Volver
          </Link>

          <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
            Confirmación
          </p>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/40 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.35),transparent_34%)]" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.25em] text-[#333333]/60">
                Último paso
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em]">
                Completa tu reserva
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#333333]/65">
                Revisa los detalles y déjanos tus datos para apartar tu lugar.
              </p>
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-[1.5rem] bg-[#F7F5F2] p-5 text-sm text-[#333333]/70">
              <p className="text-lg font-semibold tracking-[-0.02em] text-[#333333]">
                {service.name}
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
                    Primer día
                  </p>

                  <p className="mt-1">
                    {formatDate(date)}
                  </p>

                  <p className="mt-1">
                    {block.start_time.slice(0, 5)} – {block.end_time.slice(0, 5)}
                  </p>
                </div>

                {secondDate && secondBlock && (
                  <div className="border-t border-white pt-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#333333]/45">
                      Segundo día
                    </p>

                    <p className="mt-1">
                      {formatDate(secondDate)}
                    </p>

                    <p className="mt-1">
                      {secondBlock.start_time.slice(0, 5)} –{" "}
                      {secondBlock.end_time.slice(0, 5)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <ReservationForm
              service={service}
              date={date}
              blockId={blockId}
              secondDate={secondDate}
              secondBlockId={secondBlockId}
            />
          </div>
        </section>
      </section>
    </main>
  )
}

