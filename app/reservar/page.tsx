import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"

const gradients = [
  "from-[#DCCEC4] to-[#F2D9DC]",
  "from-[#59B9C6]/70 to-[#DCCEC4]",
  "from-[#F2D9DC] to-[#DCCEC4]",
  "from-[#DCCEC4] to-[#59B9C6]/40",
]

export default async function ReservarPage() {
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-6 text-[#333333]">
        <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-normal">
            Error cargando servicios
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error.message}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-6 text-[#333333]">
      <section className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#59B9C6]">
              Son de Cerámica
            </p>

            <h1 className="mt-2 text-3xl font-normal leading-tight">
              Elige tu experiencia
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[0.98]"
          >
            Inicio
          </Link>
        </div>

        <div className="space-y-5">
          {services?.map((service, index) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <div
                className={`relative h-40 bg-gradient-to-br ${
                  gradients[index % gradients.length]
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_30%)]" />

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#333333]/60">
                    Experiencia
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                    {service.name}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333]/60">
                      Desde
                    </p>

                    <p className="text-xl font-medium">
                      ${service.price_mxn} MXN
                    </p>
                  </div>

                  <div className="rounded-full bg-[#F7F5F2] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#333333]/60">
                    {service.sessions_count} sesión
                    {service.sessions_count > 1 ? "es" : ""}
                  </div>
                </div>

                <Link
                  href={`/reservar/${service.slug}`}
                  className="mt-5 block rounded-2xl bg-[#59B9C6] px-5 py-4 text-center text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-[#4ca9b5]"
                >
                  Reservar experiencia
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
