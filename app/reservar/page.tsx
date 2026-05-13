import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"

const serviceOrder = [
  "clases-de-torno-4",
  "construccion-manual-4",
  "ceramica-para-ninos",
  "sesiones-sabatinas",
  "clases-de-torno-8",
  "construccion-manual-8",
  "torno-en-pareja",
  "celebraciones-especiales",
  "evento-de-temporada",
]

const serviceCopy: Record<
  string,
  {
    label: string
    title: string
    description: string
    group: "clases" | "experiencias"
  }
> = {
  "construccion-manual-4": {
    label: "Construcción manual · 4 sesiones",
    title: "Manos a tu obra",
    description:
      "Una introducción tranquila para crear piezas con tus manos, explorar formas y disfrutar el proceso sin prisa.",
    group: "clases",
  },

  "clases-de-torno-4": {
    label: "Torno · 4 sesiones",
    title: "Tus primeras vueltas",
    description:
      "Aprende las bases del torno alfarero en sesiones guiadas, pensadas para empezar desde cero.",
    group: "clases",
  },

  "ceramica-para-ninos": {
    label: "Cerámica para niñ@s · mensualidad",
    title: "Pequeños ceramistas",
    description:
      "Un espacio creativo para que niñas y niños exploren el barro, la imaginación y el trabajo con las manos.",
    group: "clases",
  },

  "clases-de-torno-8": {
    label: "Torno · 8 sesiones",
    title: "Torno a su tiempo",
    description:
      "Un proceso más completo para practicar, mejorar y desarrollar piezas con mayor intención.",
    group: "clases",
  },

  "construccion-manual-8": {
    label: "Construcción manual · 8 sesiones",
    title: "A tu tiempo y a tu forma",
    description:
      "Un recorrido más amplio para crear con calma, probar técnicas y construir piezas personales.",
    group: "clases",
  },

  "sesiones-sabatinas": {
    label: "Sesiones sabatinas",
    title: "Piezas de Sábado por la Mañana",
    description:
      "Una pausa creativa de fin de semana para conectar con el barro y salir de la rutina.",
    group: "clases",
  },

  "torno-en-pareja": {
    label: "Torno en pareja",
    title: "Tornear es mejor a tu lado",
    description:
      "Una experiencia para desconectarse, crear y compartir entre dos. Incluye materiales, esmalte y quema de piezas.",
    group: "experiencias",
  },

  "celebraciones-especiales": {
  label: "Celebraciones privadas",
  title: "Celebrando entre piezas",
  description:
    "Cumpleaños, aniversarios, propuestas, coworkings o reuniones especiales con una experiencia de cerámica personalizada para tu grupo.",
  group: "experiencias",
},

  "evento-de-temporada": {
    label: "Evento temporal",
    title: "Eventos de temporada",
    description:
      "Talleres, dinámicas y experiencias especiales por temporadas, festividades o invitados especiales.",
    group: "experiencias",
  },
}

function normalizeName(name: string) {
  return name.trim().toLowerCase()
}

function getServicePresentation(service: any) {
const direct = serviceCopy[service.slug]

if (direct) return direct

const match = Object.entries(serviceCopy).find(([key]) =>
  normalizeName(service.slug).includes(normalizeName(key))
)

  return (
    match?.[1] ?? {
      label: "Experiencia de cerámica",
      title: service.name,
      description:
        "Una experiencia guiada para crear, aprender y disfrutar el proceso cerámico.",
      group: "clases" as const,
    }
  )
}

function sortServices(services: any[]) {
  return [...services].sort((a, b) => {
    const aIndex = serviceOrder.indexOf(a.slug)
    const bIndex = serviceOrder.indexOf(b.slug)

    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return aIndex - bIndex
  })
}

function ServiceCard({ service }: { service: any }) {
  const presentation = getServicePresentation(service)
  const isExperience = presentation.group === "experiencias"

  return (
    <article
      className={`group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-md ${
        isExperience ? "border border-[#F2D9DC]" : ""
      }`}
    >
      <div
        className={`relative h-56 overflow-hidden ${
          isExperience ? "bg-[#F2D9DC]" : "bg-[#DCCEC4]"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isExperience
              ? "bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.65),transparent_32%),linear-gradient(135deg,rgba(242,217,220,0.95),rgba(220,206,196,0.9))]"
              : "bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.65),transparent_32%),linear-gradient(135deg,rgba(89,185,198,0.35),rgba(242,217,220,0.85))]"
          }`}
        />

        <div
          className={`absolute left-5 top-5 rounded-full bg-white/80 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.22em] backdrop-blur ${
            isExperience ? "text-[#8a5f68]" : "text-[#2f8f9a]"
          }`}
        >
          {isExperience ? "Experiencia especial" : "Clase"}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <p className="inline-flex rounded-full bg-white/75 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#333333]/80 backdrop-blur">
            {presentation.label}
          </p>

          <h3 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.05em] text-[#333333]">
            {presentation.title}
          </h3>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-[0.95rem] leading-6 text-[#333333]/70">
          {presentation.description}
        </p>

        <div className="flex items-end justify-between gap-4 border-t border-[#333333]/10 pt-5">
          <div>
            {service.slug === "celebraciones-especiales" ? (
              <>
                <p className="text-xs uppercase tracking-[0.22em] text-[#333333]/45">
                  Eventos privados
                </p>

                <p className="mt-1 text-xl font-medium tracking-[-0.03em]">
                  Cotiza tu evento
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.22em] text-[#333333]/45">
                  Costo
                </p>

                <p className="mt-1 text-xl font-medium tracking-[-0.03em]">
                  ${service.price_mxn} MXN
                </p>
              </>
            )}
          </div>

          <div className="rounded-full bg-[#F7F5F2] px-3 py-2 text-xs text-[#333333]/60">
            {service.sessions_count} sesión
            {service.sessions_count > 1 ? "es" : ""}
          </div>
        </div>

        <Link
          href={`/reservar/${service.slug}`}
          className={`block rounded-2xl px-5 py-4 text-center text-sm font-semibold transition active:scale-[0.98] ${
            isExperience
              ? "bg-[#333333] !text-white hover:bg-[#222222]"
              : "bg-[#59B9C6] !text-white hover:bg-[#4ca9b5]"
          }`}
        >
          {isExperience ? "Ver experiencia" : "Ver horarios"}
        </Link>
      </div>
    </article>
  )
}

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
          <h1 className="text-2xl font-normal">Error cargando servicios</h1>

          <p className="mt-3 text-sm text-red-600">{error.message}</p>
        </div>
      </main>
    )
  }

  const orderedServices = sortServices(services ?? [])

  const classes = orderedServices.filter(
    (service) => getServicePresentation(service).group === "clases"
  )

const featuredTitles = [
  "Tus primeras vueltas",
  "Manos a tu obra",
  "Pequeños ceramistas",
  "Piezas de Sábado por la Mañana",
]

const featuredClasses = classes.filter((service) =>
  featuredTitles.includes(getServicePresentation(service).title)
)

const secondaryClasses = classes.filter(
  (service) =>
    !featuredTitles.includes(getServicePresentation(service).title)
)

  const experiences = orderedServices.filter(
    (service) => getServicePresentation(service).group === "experiencias"
  )

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#333333]">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium tracking-[-0.02em]">
            Son de Cerámica
          </Link>

          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[0.98]"
          >
            Inicio
          </Link>
        </header>

        <section className="animate-soft-enter overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[520px] flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#59B9C6]">
                  Estudio de cerámica contemporánea
                </p>

                <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
                  Un espacio para crear con calma
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-[#333333]/65 sm:text-lg">
                  Clases y experiencias de cerámica en un espacio pensado para
                  explorar, desconectarte y crear a tu ritmo.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#clases"
                  className="rounded-2xl bg-[#59B9C6] px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#4ca9b5] active:scale-[0.98]"
                >
                  Ver clases
                </a>

                <a
                  href="#experiencias"
                  className="rounded-2xl bg-[#333333] px-6 py-4 text-center text-sm font-semibold !text-white transition hover:bg-[#2a2a2a] active:scale-[0.98]"
                >
                  Ver experiencias
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] bg-[#DCCEC4] lg:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_28%),linear-gradient(135deg,rgba(89,185,198,0.45),rgba(242,217,220,0.9)_55%,rgba(220,206,196,0.95))]" />

              <div className="absolute inset-x-6 bottom-6 rounded-[2rem] bg-white/70 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-[#333333]/50">
                  Lo más reservado: clases
                </p>

                <p className="mt-2 text-2xl font-medium leading-tight tracking-[-0.04em]">
                  Empieza con una clase guiada y crea tus primeras piezas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            "No necesitas experiencia previa.",
            "Las clases son la opción más reservada.",
            "También hay experiencias para pareja o grupos.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] bg-white p-5 text-sm leading-6 text-[#333333]/70 shadow-sm ring-1 ring-black/5"
            >
              {item}
            </div>
          ))}
        </section>

        <section id="clases" className="mt-20 scroll-mt-8">
          <div className="mb-8 max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-[#59B9C6]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2f8f9a]">
              Lo más reservado
            </div>

            <p className="text-xs uppercase tracking-[0.28em] text-[#59B9C6]">
              Clases principales
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
              Empieza aquí
            </h2>

            <p className="mt-4 leading-7 text-[#333333]/65">
              Estas son las clases que más reservan quienes empiezan en Son de
              Cerámica.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredClasses.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-16 mb-8 max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-[#DCCEC4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7a685f]">
              Continúa tu proceso
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.05em]">
              Más sesiones, más práctica
            </h2>

            <p className="mt-4 leading-7 text-[#333333]/65">
              Para quienes quieren profundizar más tiempo en torno o construcción
              manual.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {secondaryClasses.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section id="experiencias" className="mt-20 scroll-mt-8">
          <div className="mb-7 max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-[#F2D9DC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a5f68]">
              Para compartir
            </div>

            <p className="text-xs uppercase tracking-[0.28em] text-[#59B9C6]">
              Experiencias
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
              Momentos especiales
            </h2>

            <p className="mt-4 leading-7 text-[#333333]/65">
              Experiencias más sociales y ocasionales: ideales para venir en
              pareja, celebrar algo o vivir la cerámica de una forma más
              puntual.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {experiences.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

      <section className="mt-20 rounded-[2.5rem] bg-white p-7 text-[#333333] shadow-sm ring-1 ring-black/5 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#59B9C6]">
                Antes de reservar
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Información importante
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Ven con ropa cómoda.",
                "Las uñas largas pueden complicar el trabajo con barro.",
                "La puntualidad ayuda a aprovechar mejor la sesión.",
                "Las piezas necesitan tiempo de secado, esmalte y quema.",
                "La entrega no es inmediata.",
                "Tu lugar se confirma al completar la reserva.",
              ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[#F7F5F2] p-4 text-sm font-medium leading-6 text-[#333333]/75"
                  >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2.5rem] bg-white p-7 text-center shadow-sm ring-1 ring-black/5 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-[#59B9C6]">
            Reserva tu lugar
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.06em]">
            Tu espacio para crear ya te está esperando
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#333333]/65">
            Elige primero entre nuestras clases más reservadas o explora una
            experiencia especial para compartir.
          </p>

          <a
            href="#clases"
            className="mt-7 inline-block rounded-2xl bg-[#59B9C6] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#4ca9b5] active:scale-[0.98]"
          >
            Ver clases disponibles
          </a>
        </section>
      </section>
    </main>
  )
}

